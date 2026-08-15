import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent, type DashboardPlayer } from "@/components/parent/dashboard-content";

export default async function ParentDashboardPage() {
  const session = await auth();
  const [players, pendingEdits] = await Promise.all([
    prisma.player.findMany({
      where: { parentId: session!.user.id },
      include: {
        sports: { include: { sport: true } },
        _count: { select: { profileViews: true, stars: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.playerEditRequest.findMany({
      where: { player: { parentId: session!.user.id }, status: "PENDING" },
      select: { playerId: true },
    }),
  ]);
  const pendingPlayerIds = new Set(pendingEdits.map((e) => e.playerId));

  const playerIds = players.map((p) => p.id);
  const viewsThisWeek =
    playerIds.length > 0
      ? await prisma.profileViewEvent.count({
          where: {
            playerId: { in: playerIds },
            viewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        })
      : 0;
  const totalViews = players.reduce((sum, p) => sum + p._count.profileViews, 0);

  const dashboardPlayers: DashboardPlayer[] = players.map((player) => ({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    primaryPhotoUrl: player.primaryPhotoUrl,
    gradYear: player.gradYear,
    listingStatus: player.listingStatus,
    sportNames: player.sports.map((s) => s.sport.name),
    profileViewCount: player._count.profileViews,
    starCount: player._count.stars,
    editPending: pendingPlayerIds.has(player.id),
  }));

  return (
    <DashboardContent players={dashboardPlayers} totalViews={totalViews} viewsThisWeek={viewsThisWeek} />
  );
}
