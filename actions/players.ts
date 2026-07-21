"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { playerFormSchema } from "@/lib/validations/player";

export type PlayerFormState = { error?: string } | undefined;

function parsePlayerForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return playerFormSchema.parse(raw);
}

function buildPlayerData(data: ReturnType<typeof parsePlayerForm>) {
  const hasHeight = data.heightFeet != null || data.heightInches != null;

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    playerType: data.playerType,
    gradYear: data.gradYear,
    country: data.country.toUpperCase(),
    state: data.state ? data.state.toUpperCase() : null,
    heightIn: hasHeight ? (data.heightFeet ?? 0) * 12 + (data.heightInches ?? 0) : null,
    weightLb: data.weightLb ?? null,
    gpa: data.gpa ?? null,
    bio: data.bio || null,
    primaryPhotoUrl: data.primaryPhotoUrl || null,
    photoConsent: Boolean(data.photoConsent),
    instagramHandle: data.instagramHandle || null,
    xHandle: data.xHandle || null,
    cellPhone: data.cellPhone || null,
  };
}

async function upsertSportAndVideo(
  playerId: string,
  data: ReturnType<typeof parsePlayerForm>
) {
  await prisma.playerSport.upsert({
    where: { playerId_sportId: { playerId, sportId: data.sportId } },
    update: { position: data.position || null },
    create: {
      playerId,
      sportId: data.sportId,
      position: data.position || null,
      isPrimary: true,
    },
  });

  if (data.videoUrl) {
    const existing = await prisma.mediaAsset.findFirst({
      where: { playerId, type: "VIDEO", url: data.videoUrl },
    });
    if (!existing) {
      await prisma.mediaAsset.create({
        data: {
          playerId,
          type: "VIDEO",
          provider: guessVideoProvider(data.videoUrl),
          url: data.videoUrl,
        },
      });
    }
  }
}

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
          create: {
            sportId: data.sportId,
            position: data.position || null,
            isPrimary: true,
          },
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
    await upsertSportAndVideo(playerId, data);
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
          create: {
            sportId: data.sportId,
            position: data.position || null,
            isPrimary: true,
          },
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
    await prisma.player.update({ where: { id: playerId }, data: buildPlayerData(data) });
    await upsertSportAndVideo(playerId, data);
    await recordPlayerUpdate(playerId);
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

function guessVideoProvider(url: string): "YOUTUBE" | "HUDL" | "VIMEO" | "OTHER" {
  if (/youtube\.com|youtu\.be/.test(url)) return "YOUTUBE";
  if (/hudl\.com/.test(url)) return "HUDL";
  if (/vimeo\.com/.test(url)) return "VIMEO";
  return "OTHER";
}
