"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { requireOwnedPlayer } from "@/actions/players";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";

const schoolInterestSchema = z.object({
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

export type SchoolInterestFormState = { error?: string } | undefined;

// ── Parent ───────────────────────────────────────────────

export async function addSchoolInterestParent(
  playerId: string,
  sportId: string,
  _prevState: SchoolInterestFormState,
  formData: FormData
): Promise<SchoolInterestFormState> {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);

  const parsed = schoolInterestSchema.safeParse({ schoolName: formData.get("schoolName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const playerSport = await getPlayerSportOrNotFound(playerId, sportId);

  await prisma.schoolInterest.create({
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
      templateKey: "new-school-interest-submitted",
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

export async function removeSchoolInterestParent(schoolInterestId: string) {
  const session = await requireRole("PARENT");

  const schoolInterest = await prisma.schoolInterest.findUnique({
    where: { id: schoolInterestId },
    include: { playerSport: { include: { player: { select: { parentId: true } } } } },
  });
  if (!schoolInterest || schoolInterest.playerSport.player.parentId !== session.user.id) {
    notFound();
  }

  await prisma.schoolInterest.delete({ where: { id: schoolInterestId } });
  revalidatePath(
    `/dashboard/players/${schoolInterest.playerSport.playerId}/sports/${schoolInterest.playerSport.sportId}/edit`
  );
}

// ── Admin ────────────────────────────────────────────────

export async function addSchoolInterestAdmin(
  playerId: string,
  sportId: string,
  _prevState: SchoolInterestFormState,
  formData: FormData
): Promise<SchoolInterestFormState> {
  const session = await requireRole("ADMIN");

  const parsed = schoolInterestSchema.safeParse({ schoolName: formData.get("schoolName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const playerSport = await getPlayerSportOrNotFound(playerId, sportId);

  // Admin-added entries are trusted and go live immediately -- no review
  // needed for the admin's own input.
  await prisma.schoolInterest.create({
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

export async function removeSchoolInterestAdmin(schoolInterestId: string) {
  await requireRole("ADMIN");

  const schoolInterest = await prisma.schoolInterest.findUnique({
    where: { id: schoolInterestId },
    include: { playerSport: { select: { playerId: true, sportId: true } } },
  });
  if (!schoolInterest) notFound();

  await prisma.schoolInterest.delete({ where: { id: schoolInterestId } });
  revalidatePath(
    `/admin/players/${schoolInterest.playerSport.playerId}/sports/${schoolInterest.playerSport.sportId}/edit`
  );
  revalidatePath("/admin/school-interest");
}

export async function resolveSchoolInterest(schoolInterestId: string, approve: boolean) {
  const session = await requireRole("ADMIN");

  const schoolInterest = await prisma.schoolInterest.findUnique({
    where: { id: schoolInterestId },
    include: {
      playerSport: {
        include: {
          player: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      submitter: { select: { email: true } },
    },
  });
  if (!schoolInterest) notFound();

  const playerName = `${schoolInterest.playerSport.player.firstName} ${schoolInterest.playerSport.player.lastName}`;

  await prisma.$transaction(async (tx) => {
    await tx.schoolInterest.update({
      where: { id: schoolInterestId },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    await tx.notification.create({
      data: {
        userId: schoolInterest.submittedBy,
        type: approve ? "SCHOOL_INTEREST_APPROVED" : "SCHOOL_INTEREST_REJECTED",
        payload: { playerName, schoolName: schoolInterest.schoolName },
      },
    });

    await tx.emailOutbox.create({
      data: {
        toEmail: schoolInterest.submitter.email,
        templateKey: approve ? "school-interest-approved" : "school-interest-rejected",
        payload: { playerName, schoolName: schoolInterest.schoolName },
      },
    });
  });
  scheduleOutboxFlush();

  revalidatePath("/admin/school-interest");
  revalidatePath(`/admin/players/${schoolInterest.playerSport.player.id}/edit`);
  revalidatePath(
    `/admin/players/${schoolInterest.playerSport.player.id}/sports/${schoolInterest.playerSport.sportId}/edit`
  );
}
