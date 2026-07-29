import Link from "next/link";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { Trophy, ChatsCircle, UserPlus } from "@phosphor-icons/react/dist/ssr";

const FEED_LIMIT = 15;

type FeedItem = {
  key: string;
  at: Date;
  icon: typeof Trophy;
  content: React.ReactNode;
};

export default async function CoachHomePage() {
  const session = await requireRole("COACH");
  const isVerified = session.user.coachVerificationStatus === "APPROVED";

  const announcement = await prisma.announcement.findFirst({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  let feed: FeedItem[] = [];

  if (isVerified) {
    const [newPlayers, newOffers, newSchoolInterests] = await Promise.all([
      prisma.player.findMany({
        where: { listingStatus: "ACTIVE", publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: FEED_LIMIT,
        select: { id: true, firstName: true, lastName: true, publishedAt: true },
      }),
      prisma.offer.findMany({
        where: { status: "APPROVED" },
        orderBy: { resolvedAt: "desc" },
        take: FEED_LIMIT,
        select: {
          id: true,
          schoolName: true,
          resolvedAt: true,
          playerSport: { select: { player: { select: { id: true, firstName: true, lastName: true } } } },
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
          playerSport: { select: { player: { select: { id: true, firstName: true, lastName: true } } } },
        },
      }),
    ]);

    feed = [
      ...newPlayers.map((p): FeedItem => ({
        key: `player-${p.id}`,
        at: p.publishedAt!,
        icon: UserPlus,
        content: (
          <>
            <Link href={`/players/${p.id}`} className="font-semibold hover:text-gold">
              {p.firstName} {p.lastName}
            </Link>{" "}
            joined J.R. Recruiting
          </>
        ),
      })),
      ...newOffers
        .filter((o) => o.resolvedAt)
        .map((o): FeedItem => ({
          key: `offer-${o.id}`,
          at: o.resolvedAt!,
          icon: Trophy,
          content: (
            <>
              <Link
                href={`/players/${o.playerSport.player.id}`}
                className="font-semibold hover:text-gold"
              >
                {o.playerSport.player.firstName} {o.playerSport.player.lastName}
              </Link>{" "}
              added a new offer from <span className="font-semibold">{o.schoolName}</span>
            </>
          ),
        })),
      ...newSchoolInterests
        .filter((s) => s.resolvedAt)
        .map((s): FeedItem => ({
          key: `interest-${s.id}`,
          at: s.resolvedAt!,
          icon: ChatsCircle,
          content: (
            <>
              <Link
                href={`/players/${s.playerSport.player.id}`}
                className="font-semibold hover:text-gold"
              >
                {s.playerSport.player.firstName} {s.playerSport.player.lastName}
              </Link>{" "}
              is now in contact with <span className="font-semibold">{s.schoolName}</span>
            </>
          ),
        })),
    ]
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, FEED_LIMIT);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {!isVerified && <VerificationBanner />}

      {announcement && (
        <Card className="border-gold/40 bg-gradient-to-b from-gold/5 to-card/60">
          <CardContent className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Pinned by J.R. Recruiting
            </span>
            <h2 className="font-heading text-lg font-bold">{announcement.title}</h2>
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{announcement.body}</p>
          </CardContent>
        </Card>
      )}

      {isVerified && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent activity
          </h2>
          {feed.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing new to show yet.</p>
          ) : (
            <Card className="border-border/60">
              <CardContent className="flex flex-col divide-y divide-border/60 p-0">
                {feed.map((item) => (
                  <div key={item.key} className="flex items-start gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <item.icon className="h-[1.05rem] w-[1.05rem]" weight="bold" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm">{item.content}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDistanceToNow(item.at, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
