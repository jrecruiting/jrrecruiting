"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

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
  });

  await prisma.notification.create({
    data: {
      userId: coachProfile.userId,
      type: "COACH_APPROVED",
      payload: {},
    },
  });

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
  });

  await prisma.notification.create({
    data: {
      userId: coachProfile.userId,
      type: "COACH_REJECTED",
      payload: {},
    },
  });

  revalidatePath("/admin/coaches");
}
