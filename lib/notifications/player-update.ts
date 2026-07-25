import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";

/**
 * Fans a player-profile update out to every coach who starred that player
 * with notifyOnUpdate=true, and to any team coach linked to that athlete:
 * one in-app Notification (instant) + one EmailOutbox row (durable, sent
 * by the fire-and-forget/cron sweep) each.
 */
export async function recordPlayerUpdate(playerId: string) {
  const [interestedStars, teamCoachLinks] = await Promise.all([
    prisma.star.findMany({
      where: { playerId, notifyOnUpdate: true },
      include: { coach: { select: { id: true, email: true, name: true } } },
    }),
    prisma.teamCoachAccess.findMany({
      where: { playerId },
      select: { teamCoach: { select: { id: true, email: true } } },
    }),
  ]);

  if (interestedStars.length === 0 && teamCoachLinks.length === 0) return;

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { firstName: true, lastName: true },
  });
  if (!player) return;

  const playerName = `${player.firstName} ${player.lastName}`;

  await prisma.$transaction([
    ...(interestedStars.length > 0
      ? [
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
        ]
      : []),
    ...(teamCoachLinks.length > 0
      ? [
          prisma.notification.createMany({
            data: teamCoachLinks.map(({ teamCoach }) => ({
              userId: teamCoach.id,
              type: "TEAM_COACH_PROFILE_UPDATED" as const,
              payload: { playerId, playerName },
            })),
          }),
          prisma.emailOutbox.createMany({
            data: teamCoachLinks.map(({ teamCoach }) => ({
              toEmail: teamCoach.email,
              templateKey: "team-coach-profile-updated",
              payload: { playerId, playerName },
            })),
          }),
        ]
      : []),
  ]);

  scheduleOutboxFlush();
}
