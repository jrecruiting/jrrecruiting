"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { addSportFormSchema } from "@/lib/validations/player";
import { parseSportDetailsForm } from "@/lib/player-data";
import { requireOwnedPlayer } from "@/actions/players";

export type SportFormState = { error?: string } | undefined;

async function addPlayerSport(
  playerId: string,
  formData: FormData
): Promise<{ error: string } | { sportId: string }> {
  const parsed = addSportFormSchema.safeParse({ sportId: formData.get("sportId") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Select a sport" };
  }

  const existing = await prisma.playerSport.findUnique({
    where: { playerId_sportId: { playerId, sportId: parsed.data.sportId } },
  });
  if (existing) {
    return { error: "That sport is already on this profile" };
  }

  await prisma.playerSport.create({
    data: { playerId, sportId: parsed.data.sportId, isPrimary: false },
  });

  return { sportId: parsed.data.sportId };
}

async function removePlayerSport(playerId: string, sportId: string) {
  const count = await prisma.playerSport.count({ where: { playerId } });
  if (count <= 1) return;

  const removed = await prisma.playerSport.delete({
    where: { playerId_sportId: { playerId, sportId } },
  });

  if (removed.isPrimary) {
    const next = await prisma.playerSport.findFirst({ where: { playerId } });
    if (next) {
      await prisma.playerSport.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  }
}

async function updateSportDetails(
  playerId: string,
  sportId: string,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  try {
    const data = parseSportDetailsForm(formData);
    await prisma.playerSport.update({
      where: { playerId_sportId: { playerId, sportId } },
      data: {
        position: data.position || null,
        projection: data.projection || null,
        bio: data.bio || null,
        stats: data.stats,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }
}

// ── Admin ────────────────────────────────────────────────

export async function addPlayerSportAdmin(
  playerId: string,
  _prevState: SportFormState,
  formData: FormData
): Promise<SportFormState> {
  await requireRole("ADMIN");
  const result = await addPlayerSport(playerId, formData);
  if ("error" in result) return result;

  revalidatePath(`/admin/players/${playerId}/edit`);
  redirect(`/admin/players/${playerId}/sports/${result.sportId}/edit`);
}

export async function removePlayerSportAdmin(playerId: string, sportId: string) {
  await requireRole("ADMIN");
  await removePlayerSport(playerId, sportId);
  revalidatePath(`/admin/players/${playerId}/edit`);
}

export async function updateSportDetailsAdmin(
  playerId: string,
  sportId: string,
  _prevState: SportFormState,
  formData: FormData
): Promise<SportFormState> {
  await requireRole("ADMIN");
  const result = await updateSportDetails(playerId, sportId, formData);
  if (result?.error) return result;

  await recordPlayerUpdate(playerId);
  revalidatePath(`/admin/players/${playerId}/edit`);
  redirect(`/admin/players/${playerId}/edit`);
}

// ── Parent ───────────────────────────────────────────────

export async function addPlayerSportParent(
  playerId: string,
  _prevState: SportFormState,
  formData: FormData
): Promise<SportFormState> {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);
  const result = await addPlayerSport(playerId, formData);
  if ("error" in result) return result;

  revalidatePath(`/dashboard/players/${playerId}/edit`);
  redirect(`/dashboard/players/${playerId}/sports/${result.sportId}/edit`);
}

export async function removePlayerSportParent(playerId: string, sportId: string) {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);
  await removePlayerSport(playerId, sportId);
  revalidatePath(`/dashboard/players/${playerId}/edit`);
}

export async function updateSportDetailsParent(
  playerId: string,
  sportId: string,
  _prevState: SportFormState,
  formData: FormData
): Promise<SportFormState> {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);
  const result = await updateSportDetails(playerId, sportId, formData);
  if (result?.error) return result;

  await recordPlayerUpdate(playerId);
  revalidatePath(`/dashboard/players/${playerId}/edit`);
  redirect(`/dashboard/players/${playerId}/edit`);
}
