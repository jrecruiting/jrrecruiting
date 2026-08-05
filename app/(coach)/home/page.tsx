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

  if (isVerified) {
    const [newPlayers, newOffers, newSchoolInterests, approvedEdits] = await Promise.all([
      prisma.player.findMany({
        where: { listingStatus: "ACTIVE", publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: FEED_LIMIT,
        select: { id: true, firstName: true, lastName: true, publishedAt: true, primaryPhotoUrl: true },
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
              player: { select: { id: true, firstName: true, lastName: true, primaryPhotoUrl: true } },
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
              player: { select: { id: true, firstName: true, lastName: true, primaryPhotoUrl: true } },
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
          player: { select: { id: true, firstName: true, lastName: true, primaryPhotoUrl: true } },
        },
      }),
    ]);

    feed = [
      ...newPlayers.map(
        (p): FeedItemData => ({
          key: `player-${p.id}`,
          at: p.publishedAt!.toISOString(),
          type: "player",
          playerId: p.id,
          playerName: `${p.firstName} ${p.lastName}`,
          photoUrl: p.primaryPhotoUrl,
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
        announcement={announcement ? { title: announcement.title, body: announcement.body } : null}
        isVerified={isVerified}
        feed={feed}
      />
    </div>
  );
}
