"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { PlayerProjection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { addSportFormSchema } from "@/lib/validations/player";
import { PLAYER_PROJECTIONS } from "@/lib/player-projections";
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
  formData: FormData,
  // Player Projection is admin-only. Parents can't set or clear it even by
  // tampering with the form -- their update path never includes this key,
  // so an admin-set value is preserved no matter what a parent submits.
  { includeProjection }: { includeProjection: boolean }
): Promise<{ error?: string } | undefined> {
  try {
    const data = parseSportDetailsForm(formData);

    // Guards against a stale page (the browser's back button, or another
    // tab) silently overwriting a newer change -- same reasoning as
    // updatePlayerAdmin's identical check in actions/players.ts. This
    // write has no per-field way to merge (position/bio/stats all get
    // replaced wholesale below), so a real conflict is refused outright
    // rather than risking a partial, confusing overwrite.
    const formLoadedAtRaw = Number(formData.get("formLoadedAt"));
    const protectSince = formLoadedAtRaw ? new Date(formLoadedAtRaw) : undefined;
    if (protectSince) {
      const current = await prisma.playerSport.findUnique({
        where: { playerId_sportId: { playerId, sportId } },
        select: { updatedAt: true },
      });
      if (current && current.updatedAt > protectSince) {
        return {
          error:
            "These sport details were updated elsewhere after you opened this page, so saving now could overwrite that change. Please reload the page and reapply your edit.",
        };
      }
    }

    await prisma.playerSport.update({
      where: { playerId_sportId: { playerId, sportId } },
      data: {
        position: data.position || null,
        ...(includeProjection ? { projections: data.projections } : {}),
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

const PROJECTION_VALUES = new Set<string>(PLAYER_PROJECTIONS.map((p) => p.value));

function parseProjections(values: string[]): PlayerProjection[] {
  return values.filter((v): v is PlayerProjection => {
    if (!PROJECTION_VALUES.has(v)) throw new Error("Invalid projection value");
    return true;
  });
}

// Quick-set from the admin players list -- lets an admin label every
// player's projection(s) per sport without opening each sport's full
// details form. A sport can carry more than one projection (e.g. FCS and
// D2 for the same sport).
export async function setSportProjectionAdmin(
  playerId: string,
  sportId: string,
  projections: string[]
) {
  await requireRole("ADMIN");

  await prisma.playerSport.update({
    where: { playerId_sportId: { playerId, sportId } },
    data: { projections: parseProjections(projections) },
  });

  revalidatePath("/admin/players");
}

export async function updateSportDetailsAdmin(
  playerId: string,
  sportId: string,
  _prevState: SportFormState,
  formData: FormData
): Promise<SportFormState> {
  await requireRole("ADMIN");
  const result = await updateSportDetails(playerId, sportId, formData, { includeProjection: true });
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
  const result = await updateSportDetails(playerId, sportId, formData, { includeProjection: false });
  if (result?.error) return result;

  await recordPlayerUpdate(playerId);
  revalidatePath(`/dashboard/players/${playerId}/edit`);
  redirect(`/dashboard/players/${playerId}/edit`);
}
