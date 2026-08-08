"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";

export async function toggleStar(playerId: string): Promise<{ starred: boolean }> {
  const session = await requireRole("COACH");

  const existing = await prisma.star.findUnique({
    where: { coachId_playerId: { coachId: session.user.id, playerId } },
  });

  if (existing) {
    await prisma.star.delete({ where: { id: existing.id } });
    revalidatePath("/search");
    revalidatePath("/coach/dashboard/starred");
    return { starred: false };
  }

  await prisma.star.create({
    data: { coachId: session.user.id, playerId, notifyOnUpdate: false },
  });

  // A star is the strongest buy-signal a coach can give -- worth a
  // real-time admin email rather than waiting for the weekly digest.
  const [player, coachProfile] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerId }, select: { firstName: true, lastName: true } }),
    prisma.coachProfile.findUnique({ where: { userId: session.user.id }, select: { organization: true } }),
  ]);
  if (player) {
    await prisma.emailOutbox.create({
      data: {
        toEmail: ADMIN_EMAIL,
        templateKey: "star-created",
        payload: {
          playerId,
          playerName: `${player.firstName} ${player.lastName}`,
          coachName: session.user.name || "A coach",
          organization: coachProfile?.organization || "",
        },
      },
    });
    scheduleOutboxFlush();
  }

  revalidatePath("/search");
  revalidatePath("/coach/dashboard/starred");
  return { starred: true };
}

export async function setNotifyOnUpdate(playerId: string, notify: boolean) {
  const session = await requireRole("COACH");

  await prisma.star.updateMany({
    where: { coachId: session.user.id, playerId },
    data: { notifyOnUpdate: notify },
  });

  revalidatePath("/coach/dashboard/starred");
}

export async function unstarPlayer(playerId: string) {
  const session = await requireRole("COACH");
  await prisma.star.deleteMany({ where: { coachId: session.user.id, playerId } });
  revalidatePath("/coach/dashboard/starred");
  revalidatePath("/search");
}
