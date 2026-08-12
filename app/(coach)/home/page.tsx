import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { HomeContent, type FeedItemData } from "@/components/coach/home-content";

const FEED_LIMIT = 15;

export default async function CoachHomePage() {
  const session = await requireRole("COACH");
  const isVerified = session.user.coachVerificationStatus === "APPROVED";

  const announcement = await prisma.announcement.findFirst({
    orderBy: { createdAt: "desc" },
  });

  let feed: FeedItemData[] = [];
  let activePlayerCount = 0;
  let sportsCovered: string[] = [];

  if (isVerified) {
    const primarySportSelect = {
      where: { isPrimary: true },
      take: 1,
      select: { position: true, sport: { select: { name: true } } },
    } as const;

    const [newPlayers, newOffers, newSchoolInterests, approvedEdits, playerCount, activeSports] =
      await Promise.all([
        prisma.player.findMany({
          where: { listingStatus: "ACTIVE", publishedAt: { not: null } },
          orderBy: { publishedAt: "desc" },
          take: FEED_LIMIT,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gradYear: true,
            publishedAt: true,
            primaryPhotoUrl: true,
            sports: primarySportSelect,
          },
        }),
        prisma.offer.findMany({
          where: { status: "APPROVED" },
          orderBy: { resolvedAt: "desc" },
          take: FEED_LIMIT,
          select: {
            id: true,
            schoolName: true,
            resolvedAt: true,
            playerSport: {
              select: {
                position: true,
                sport: { select: { name: true } },
                player: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gradYear: true,
                    primaryPhotoUrl: true,
                  },
                },
              },
            },
          },
        }),
        prisma.schoolInterest.findMany({
          where: { status: "APPROVED" },
          orderBy: { resolvedAt: "desc" },
          take: FEED_LIMIT,
          select: {
            id: true,
            schoolName: true,
            resolvedAt: true,
            playerSport: {
              select: {
                position: true,
                sport: { select: { name: true } },
                player: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gradYear: true,
                    primaryPhotoUrl: true,
                  },
                },
              },
            },
          },
        }),
        prisma.playerEditRequest.findMany({
          where: { status: "APPROVED", announced: true, player: { listingStatus: "ACTIVE" } },
          orderBy: { resolvedAt: "desc" },
          take: FEED_LIMIT,
          select: {
            id: true,
            resolvedAt: true,
            player: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                gradYear: true,
                primaryPhotoUrl: true,
                sports: primarySportSelect,
              },
            },
          },
        }),
        prisma.player.count({ where: { listingStatus: "ACTIVE" } }),
        prisma.playerSport.findMany({
          where: { player: { listingStatus: "ACTIVE" } },
          distinct: ["sportId"],
          select: { sport: { select: { name: true } } },
          orderBy: { sport: { name: "asc" } },
        }),
      ]);

    activePlayerCount = playerCount;
    sportsCovered = activeSports.map((s) => s.sport.name);

    const sportLine = (
      gradYear: number | null,
      sport?: { position: string | null; sport: { name: string } }
    ) =>
      [sport?.sport.name, sport?.position, gradYear != null ? `Class of ${gradYear}` : null]
        .filter(Boolean)
        .join(" · ");

    feed = [
      ...newPlayers.map(
        (p): FeedItemData => ({
          key: `player-${p.id}`,
          at: p.publishedAt!.toISOString(),
          type: "player",
          playerId: p.id,
          playerName: `${p.firstName} ${p.lastName}`,
          photoUrl: p.primaryPhotoUrl,
          sportLine: sportLine(p.gradYear, p.sports[0]),
        })
      ),
      ...newOffers
        .filter((o) => o.resolvedAt)
        .map(
          (o): FeedItemData => ({
            key: `offer-${o.id}`,
            at: o.resolvedAt!.toISOString(),
            type: "offer",
            playerId: o.playerSport.player.id,
            playerName: `${o.playerSport.player.firstName} ${o.playerSport.player.lastName}`,
            photoUrl: o.playerSport.player.primaryPhotoUrl,
            schoolName: o.schoolName,
            sportLine: sportLine(o.playerSport.player.gradYear, o.playerSport),
          })
        ),
      ...newSchoolInterests
        .filter((s) => s.resolvedAt)
        .map(
          (s): FeedItemData => ({
            key: `interest-${s.id}`,
            at: s.resolvedAt!.toISOString(),
            type: "interest",
            playerId: s.playerSport.player.id,
            playerName: `${s.playerSport.player.firstName} ${s.playerSport.player.lastName}`,
            photoUrl: s.playerSport.player.primaryPhotoUrl,
            schoolName: s.schoolName,
            sportLine: sportLine(s.playerSport.player.gradYear, s.playerSport),
          })
        ),
      ...approvedEdits
        .filter((e) => e.resolvedAt)
        .map(
          (e): FeedItemData => ({
            key: `update-${e.id}`,
            at: e.resolvedAt!.toISOString(),
            type: "update",
            playerId: e.player.id,
            playerName: `${e.player.firstName} ${e.player.lastName}`,
            photoUrl: e.player.primaryPhotoUrl,
            sportLine: sportLine(e.player.gradYear, e.player.sports[0]),
          })
        ),
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, FEED_LIMIT);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {!isVerified && <VerificationBanner />}
      <HomeContent
        coachName={session.user.name ?? "Coach"}
        announcement={announcement ? { title: announcement.title, body: announcement.body } : null}
        isVerified={isVerified}
        activePlayerCount={activePlayerCount}
        sportsCovered={sportsCovered}
        feed={feed}
      />
    </div>
  );
}
