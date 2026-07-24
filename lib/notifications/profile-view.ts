import { prisma } from "@/lib/prisma";

const DEDUPE_WINDOW_HOURS = 6;

/**
 * Logs a coach's profile view and notifies the parent in-app — but only
 * once per (coach, player) pair within the dedupe window, so a coach
 * re-opening the same profile repeatedly in one session doesn't spam
 * the parent with notifications. No-ops entirely for a coach flagged as
 * a test account, so admin reviewing profiles internally doesn't log a
 * view, inflate view counts, or alert the parent.
 */
export async function recordProfileView(playerId: string, coachId: string) {
  const coachProfile = await prisma.coachProfile.findUnique({
    where: { userId: coachId },
    select: { isTestAccount: true },
  });
  if (coachProfile?.isTestAccount) return;

  await prisma.profileViewEvent.create({ data: { playerId, coachId } });

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { firstName: true, lastName: true, parentId: true },
  });
  if (!player?.parentId) return;

  const since = new Date(Date.now() - DEDUPE_WINDOW_HOURS * 60 * 60 * 1000);
  const recent = await prisma.notification.findFirst({
    where: {
      userId: player.parentId,
      type: "PROFILE_VIEWED",
      createdAt: { gte: since },
      payload: { path: ["playerId"], equals: playerId },
    },
  });
  if (recent) return;

  await prisma.notification.create({
    data: {
      userId: player.parentId,
      type: "PROFILE_VIEWED",
      payload: { playerId, playerName: `${player.firstName} ${player.lastName}` },
    },
  });
}
