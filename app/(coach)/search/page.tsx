import Link from "next/link";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { searchParamsSchema } from "@/lib/validations/search";
import { buildPlayerWhere } from "@/lib/search/build-where";
import { playerTypeLabel } from "@/lib/player-types";
import { maskLastName } from "@/lib/coach-visibility";
import { QuickStarButton } from "@/components/coach/quick-star-button";
import { PlayerPhoto } from "@/components/player/player-photo";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      include: { sports: { include: { sport: true } } },
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

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <FilterSidebar sports={sports} />
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Search Players</h1>
          <p className="text-sm text-muted-foreground">
            {total} player{total === 1 ? "" : "s"}
          </p>
        </div>

        {!isVerified && <VerificationBanner />}

        {players.length === 0 ? (
          <p className="text-muted-foreground">
            No players match these filters. Try broadening your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {players.map((player) => {
              const displayLastName = isVerified
                ? player.lastName
                : maskLastName(player.lastName);
              const displayLocation = [
                isVerified ? player.city : null,
                player.state,
                player.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <Card key={player.id} className="border-border/60">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <PlayerPhoto
                          pathname={isVerified ? player.primaryPhotoUrl : null}
                          alt={`${player.firstName} ${displayLastName}`}
                          size="sm"
                        />
                        <div>
                          <Link
                            href={`/players/${player.id}`}
                            className="font-heading text-base font-semibold hover:text-gold"
                          >
                            {player.firstName} {displayLastName}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {player.sports
                              .map((s) => `${s.sport.name}${s.position ? ` · ${s.position}` : ""}`)
                              .join(", ") || "No sport set"}
                          </p>
                        </div>
                      </div>
                      <QuickStarButton
                        playerId={player.id}
                        initialStarred={starredIds.has(player.id)}
                        className="-mr-2 -mt-2 shrink-0"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{playerTypeLabel(player.playerType)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {player.gender === "MALE" ? "Boy" : "Girl"} &middot; Class of{" "}
                      {player.gradYear}
                      {displayLocation ? ` · ${displayLocation}` : ""}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
  );
}
