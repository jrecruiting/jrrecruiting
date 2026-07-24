"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { requireOwnedPlayer } from "@/actions/players";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";

const offerSchema = z.object({
  schoolName: z.string().trim().min(1, "School name is required").max(120),
});

async function getPlayerSportOrNotFound(playerId: string, sportId: string) {
  const playerSport = await prisma.playerSport.findUnique({
    where: { playerId_sportId: { playerId, sportId } },
    include: { player: { select: { firstName: true, lastName: true } } },
  });
  if (!playerSport) notFound();
  return playerSport;
}

export type OfferFormState = { error?: string } | undefined;

// ── Parent ───────────────────────────────────────────────

export async function addOfferParent(
  playerId: string,
  sportId: string,
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);

  const parsed = offerSchema.safeParse({ schoolName: formData.get("schoolName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const playerSport = await getPlayerSportOrNotFound(playerId, sportId);

  await prisma.offer.create({
    data: {
      playerSportId: playerSport.id,
      schoolName: parsed.data.schoolName,
      status: "PENDING",
      submittedBy: session.user.id,
    },
  });

  await prisma.emailOutbox.create({
    data: {
      toEmail: ADMIN_EMAIL,
      templateKey: "new-offer-submitted",
      payload: {
        playerName: `${playerSport.player.firstName} ${playerSport.player.lastName}`,
        schoolName: parsed.data.schoolName,
        submitterName: session.user.name,
        submitterEmail: session.user.email,
      },
    },
  });
  scheduleOutboxFlush();

  revalidatePath(`/dashboard/players/${playerId}/sports/${sportId}/edit`);
}

export async function removeOfferParent(offerId: string) {
  const session = await requireRole("PARENT");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { playerSport: { include: { player: { select: { parentId: true } } } } },
  });
  if (!offer || offer.playerSport.player.parentId !== session.user.id) notFound();

  await prisma.offer.delete({ where: { id: offerId } });
  revalidatePath(
    `/dashboard/players/${offer.playerSport.playerId}/sports/${offer.playerSport.sportId}/edit`
  );
}

// ── Admin ────────────────────────────────────────────────

export async function addOfferAdmin(
  playerId: string,
  sportId: string,
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const session = await requireRole("ADMIN");

  const parsed = offerSchema.safeParse({ schoolName: formData.get("schoolName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const playerSport = await getPlayerSportOrNotFound(playerId, sportId);

  // Admin-added offers are trusted and go live immediately -- no review
  // needed for the admin's own input.
  await prisma.offer.create({
    data: {
      playerSportId: playerSport.id,
      schoolName: parsed.data.schoolName,
      status: "APPROVED",
      submittedBy: session.user.id,
      resolvedAt: new Date(),
      resolvedBy: session.user.id,
    },
  });

  revalidatePath(`/admin/players/${playerId}/sports/${sportId}/edit`);
}

export async function removeOfferAdmin(offerId: string) {
  await requireRole("ADMIN");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { playerSport: { select: { playerId: true, sportId: true } } },
  });
  if (!offer) notFound();

  await prisma.offer.delete({ where: { id: offerId } });
  revalidatePath(`/admin/players/${offer.playerSport.playerId}/sports/${offer.playerSport.sportId}/edit`);
  revalidatePath("/admin/offers");
}

export async function resolveOffer(offerId: string, approve: boolean) {
  const session = await requireRole("ADMIN");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      playerSport: {
        include: {
          player: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      submitter: { select: { email: true } },
    },
  });
  if (!offer) notFound();

  const playerName = `${offer.playerSport.player.firstName} ${offer.playerSport.player.lastName}`;

  await prisma.$transaction(async (tx) => {
    await tx.offer.update({
      where: { id: offerId },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    await tx.notification.create({
      data: {
        userId: offer.submittedBy,
        type: approve ? "OFFER_APPROVED" : "OFFER_REJECTED",
        payload: { playerName, schoolName: offer.schoolName },
      },
    });

    await tx.emailOutbox.create({
      data: {
        toEmail: offer.submitter.email,
        templateKey: approve ? "offer-approved" : "offer-rejected",
        payload: { playerName, schoolName: offer.schoolName },
      },
    });
  });
  scheduleOutboxFlush();

  revalidatePath("/admin/offers");
  revalidatePath(`/admin/players/${offer.playerSport.player.id}/edit`);
  revalidatePath(
    `/admin/players/${offer.playerSport.player.id}/sports/${offer.playerSport.sportId}/edit`
  );
}
