"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { parsePlayerForm, buildPlayerData, syncPlayerSportsAndVideo, guessVideoProvider } from "@/lib/player-data";

export type PlayerFormState = { error?: string } | undefined;

// ── Admin ────────────────────────────────────────────────

export async function createPlayerAdmin(
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("ADMIN");

  let playerId: string;
  try {
    const data = parsePlayerForm(formData);

    const player = await prisma.player.create({
      data: {
        ...buildPlayerData(data),
        isAdminAuthored: true,
        createdByAdminId: session.user.id,
        listingStatus: "ACTIVE",
        publishedAt: new Date(),
        sports: {
          create: data.sports.map((sport, index) => ({
            sportId: sport.sportId,
            position: sport.position || null,
            isPrimary: index === 0,
          })),
        },
        media: data.videoUrl
          ? {
              create: {
                type: "VIDEO",
                provider: guessVideoProvider(data.videoUrl),
                url: data.videoUrl,
              },
            }
          : undefined,
      },
    });
    playerId = player.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/admin/players");
  redirect(`/admin/players/${playerId}/edit`);
}

export async function updatePlayerAdmin(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  await requireRole("ADMIN");

  try {
    const data = parsePlayerForm(formData);
    await prisma.player.update({ where: { id: playerId }, data: buildPlayerData(data) });
    await syncPlayerSportsAndVideo(playerId, data);
    await recordPlayerUpdate(playerId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath(`/admin/players/${playerId}/edit`);
  revalidatePath("/admin/players");
  return { error: undefined };
}

export async function deletePlayerAdmin(playerId: string) {
  await requireRole("ADMIN");
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

// ── Parent ───────────────────────────────────────────────

export async function createPlayerParent(
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("PARENT");

  let playerId: string;
  try {
    const data = parsePlayerForm(formData);

    const player = await prisma.player.create({
      data: {
        ...buildPlayerData(data),
        parentId: session.user.id,
        isAdminAuthored: false,
        listingStatus: "DRAFT",
        sports: {
          create: data.sports.map((sport, index) => ({
            sportId: sport.sportId,
            position: sport.position || null,
            isPrimary: index === 0,
          })),
        },
        media: data.videoUrl
          ? {
              create: {
                type: "VIDEO",
                provider: guessVideoProvider(data.videoUrl),
                url: data.videoUrl,
              },
            }
          : undefined,
      },
    });
    playerId = player.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/players/${playerId}/payment`);
}

async function requireOwnedPlayer(playerId: string, parentId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== parentId) notFound();
  return player;
}

export async function updatePlayerParent(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);

  try {
    const data = parsePlayerForm(formData);

    // Parent edits are staged for admin review rather than applied directly,
    // so coaches watching this player aren't notified until an admin approves
    // the change. Resubmitting while a request is still pending replaces it
    // rather than piling up duplicates.
    const existing = await prisma.playerEditRequest.findFirst({
      where: { playerId, status: "PENDING" },
    });

    if (existing) {
      await prisma.playerEditRequest.update({
        where: { id: existing.id },
        data: { proposedData: data, submittedBy: session.user.id, createdAt: new Date() },
      });
    } else {
      await prisma.playerEditRequest.create({
        data: { playerId, submittedBy: session.user.id, proposedData: data },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath(`/dashboard/players/${playerId}/edit`);
  revalidatePath("/dashboard");
  return { error: undefined };
}

export async function deletePlayerParent(playerId: string) {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
