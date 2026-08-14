import Link from "next/link";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { searchParamsSchema } from "@/lib/validations/search";
import { buildPlayerWhere } from "@/lib/search/build-where";
import { playerTypeLabel } from "@/lib/player-types";
import { maskLastName } from "@/lib/coach-visibility";
import { formatHeight } from "@/lib/player-data";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import {
  PlayerResultsGrid,
  ResultsPendingIndicator,
  type PlayerCardData,
} from "@/components/search/player-results-grid";
import { SearchTransitionProvider } from "@/components/search/search-transition-context";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export default async function CoachSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireRole("COACH");
  const isVerified = session.user.coachVerificationStatus === "APPROVED";

  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const parsed = searchParamsSchema.parse(flatParams);

  const where = buildPlayerWhere(parsed);
  const page = parsed.page ?? 1;

  const [players, total, sports, myStars] = await Promise.all([
    prisma.player.findMany({
      where,
      include: {
        sports: {
          include: {
            sport: true,
            _count: { select: { offers: { where: { status: "APPROVED" } } } },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.player.count({ where }),
    getSports(),
    prisma.star.findMany({ where: { coachId: session.user.id }, select: { playerId: true } }),
  ]);

  const starredIds = new Set(myStars.map((s) => s.playerId));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const paramsForPage = (targetPage: number) => {
    const params = new URLSearchParams(
      Object.entries(flatParams).filter(([, v]) => v) as [string, string][]
    );
    params.set("page", String(targetPage));
    return `/search?${params.toString()}`;
  };

  const cards: PlayerCardData[] = players.map((player) => {
    const displayLastName = isVerified ? player.lastName : maskLastName(player.lastName);
    const displayLocation = [isVerified ? player.city : null, player.state, player.country]
      .filter(Boolean)
      .join(", ");
    const measurables = [
      player.heightIn ? formatHeight(player.heightIn) : null,
      player.weightLb ? `${player.weightLb} lb` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    const offerCount = player.sports.reduce((sum, s) => sum + s._count.offers, 0);
    const sportLine =
      player.sports
        .map(
          (s) =>
            `${s.sport.name}${s.position ? ` · ${s.position}` : ""}${s.projections.length > 0 ? ` · ${s.projections.join(", ")}` : ""}`
        )
        .join(", ") || "No sport set";
    const genderLocationLine = [
      player.gender === "MALE" ? "Boy" : "Girl",
      player.gradYear != null ? `Class of ${player.gradYear}` : null,
      displayLocation || null,
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      id: player.id,
      displayName: `${player.firstName} ${displayLastName}`,
      sportLine,
      photoUrl: player.primaryPhotoUrl,
      starred: starredIds.has(player.id),
      offerCount,
      playerTypeLabel: playerTypeLabel(player.playerType),
      genderLocationLine,
      measurables: measurables || null,
    };
  });

  return (
    <SearchTransitionProvider>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FilterSidebar sports={sports} />
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Search Players</h1>
            <div className="flex items-center gap-3">
              <ResultsPendingIndicator />
              <p className="text-sm text-muted-foreground">
                {total} player{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {!isVerified && <VerificationBanner />}

          {cards.length === 0 ? (
            <p className="text-muted-foreground">
              No players match these filters. Try broadening your search.
            </p>
          ) : (
            <PlayerResultsGrid players={cards} isVerified={isVerified} />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/60"
                disabled={page <= 1}
                nativeButton={false}
                render={<Link href={paramsForPage(page - 1)} aria-disabled={page <= 1} />}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-border/60"
                disabled={page >= totalPages}
                nativeButton={false}
                render={<Link href={paramsForPage(page + 1)} aria-disabled={page >= totalPages} />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </SearchTransitionProvider>
  );
}
