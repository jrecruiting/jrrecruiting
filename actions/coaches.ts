"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";

export async function approveCoach(coachProfileId: string) {
  const session = await requireRole("ADMIN");

  const coachProfile = await prisma.coachProfile.update({
    where: { id: coachProfileId },
    data: {
      verificationStatus: "APPROVED",
      verifiedAt: new Date(),
      verifiedByAdminId: session.user.id,
      rejectionReason: null,
    },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  await prisma.$transaction([
    prisma.notification.create({
      data: { userId: coachProfile.userId, type: "COACH_APPROVED", payload: {} },
    }),
    prisma.emailOutbox.create({
      data: {
        toEmail: coachProfile.user.email,
        templateKey: "coach-approved",
        payload: { coachName: coachProfile.user.name },
      },
    }),
  ]);
  scheduleOutboxFlush();

  revalidatePath("/admin/coaches");
}

export async function deleteCoach(userId: string) {
  await requireRole("ADMIN");

  // Deletes the underlying account (cascades to the coach profile, stars,
  // notifications, and sessions), not just the coach profile -- otherwise
  // the account would be left in a broken, profile-less state and could
  // still sign in.
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/coaches");
}

export async function rejectCoach(coachProfileId: string, reason: string) {
  const session = await requireRole("ADMIN");

  const coachProfile = await prisma.coachProfile.update({
    where: { id: coachProfileId },
    data: {
      verificationStatus: "REJECTED",
      verifiedAt: new Date(),
      verifiedByAdminId: session.user.id,
      rejectionReason: reason || null,
    },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  await prisma.$transaction([
    prisma.notification.create({
      data: { userId: coachProfile.userId, type: "COACH_REJECTED", payload: {} },
    }),
    prisma.emailOutbox.create({
      data: {
        toEmail: coachProfile.user.email,
        templateKey: "coach-rejected",
        payload: { coachName: coachProfile.user.name, reason: reason || undefined },
      },
    }),
  ]);
  scheduleOutboxFlush();

  revalidatePath("/admin/coaches");
}
