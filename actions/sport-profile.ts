"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { requireOwnedPlayer } from "@/actions/players";
import { parseCreatePlayerForm, buildPlayerData, guessVideoProvider } from "@/lib/player-data";

export type PlayerFormState = { error?: string } | undefined;

async function createSpinoffProfile(
  formData: FormData,
  ownerFields: { parentId: string | null; isAdminAuthored: boolean; createdByAdminId?: string }
) {
  const data = parseCreatePlayerForm(formData);

  const player = await prisma.player.create({
    data: {
      ...buildPlayerData(data),
      parentId: ownerFields.parentId,
      isAdminAuthored: ownerFields.isAdminAuthored,
      createdByAdminId: ownerFields.createdByAdminId,
      // Free spin-off profile -- the family already paid for this athlete on
      // their original listing, so this one skips DRAFT/payment and goes
      // straight to ACTIVE like an admin-created profile would.
      listingStatus: "ACTIVE",
      publishedAt: new Date(),
      sports: {
        create: { sportId: data.sportId, position: data.position || null, isPrimary: true },
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

  return player.id;
}

export async function createSportProfileParent(
  sourcePlayerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("PARENT");
  const source = await requireOwnedPlayer(sourcePlayerId, session.user.id);

  if (source.listingStatus !== "ACTIVE") {
    return {
      error:
        "This athlete's current profile needs to be paid and active before you can add a free profile for another sport.",
    };
  }

  let playerId: string;
  try {
    playerId = await createSpinoffProfile(formData, {
      parentId: session.user.id,
      isAdminAuthored: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/players/${playerId}/edit`);
}

export async function createSportProfileAdmin(
  sourcePlayerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("ADMIN");
  const source = await prisma.player.findUnique({ where: { id: sourcePlayerId } });
  if (!source) notFound();

  let playerId: string;
  try {
    playerId = await createSpinoffProfile(formData, {
      parentId: source.parentId,
      isAdminAuthored: true,
      createdByAdminId: session.user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/admin/players");
  redirect(`/admin/players/${playerId}/edit`);
}
