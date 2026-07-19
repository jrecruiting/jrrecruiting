import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";

/**
 * Fans a player-profile update out to every coach who starred that player
 * with notifyOnUpdate=true: one in-app Notification (instant) + one
 * EmailOutbox row (durable, sent by the fire-and-forget/cron sweep).
 */
export async function recordPlayerUpdate(playerId: string) {
  const interestedStars = await prisma.star.findMany({
    where: { playerId, notifyOnUpdate: true },
    include: { coach: { select: { id: true, email: true, name: true } } },
  });

  if (interestedStars.length === 0) return;

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { firstName: true, lastName: true },
  });
  if (!player) return;

  const playerName = `${player.firstName} ${player.lastName}`;

  await prisma.$transaction([
    prisma.notification.createMany({
      data: interestedStars.map((star) => ({
        userId: star.coach.id,
        type: "PROFILE_UPDATED" as const,
        payload: { playerId, playerName },
      })),
    }),
    prisma.emailOutbox.createMany({
      data: interestedStars.map((star) => ({
        toEmail: star.coach.email,
        templateKey: "player-updated",
        payload: { playerId, playerName, coachName: star.coach.name },
      })),
    }),
  ]);

  scheduleOutboxFlush();
}
