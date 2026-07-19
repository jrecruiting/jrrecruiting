import Link from "next/link";
import { requireVerifiedCoach } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { QuickStarButton } from "@/components/coach/quick-star-button";
import { Card, CardContent } from "@/components/ui/card";

export default async function CoachSearchPage() {
  const session = await requireVerifiedCoach();

  const [players, myStars] = await Promise.all([
    prisma.player.findMany({
      where: { listingStatus: "ACTIVE" },
      include: { sports: { include: { sport: true } } },
      orderBy: { publishedAt: "desc" },
      take: 60,
    }),
    prisma.star.findMany({
      where: { coachId: session.user.id },
      select: { playerId: true },
    }),
  ]);

  const starredIds = new Set(myStars.map((s) => s.playerId));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Search Players</h1>
        <p className="text-sm text-muted-foreground">
          Filtering by state, sport, gender, and position is coming soon &mdash;
          for now, here are all active player profiles.
        </p>
      </div>

      {players.length === 0 ? (
        <p className="text-muted-foreground">No active player profiles yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id} className="border-border/60">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/players/${player.id}`}
                      className="font-heading text-base font-semibold hover:text-gold"
                    >
                      {player.firstName} {player.lastName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {player.sports.map((s) => s.sport.name).join(", ") || "No sport set"}
                    </p>
                  </div>
                  <QuickStarButton
                    playerId={player.id}
                    initialStarred={starredIds.has(player.id)}
                    className="-mr-2 -mt-2 shrink-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {player.gender === "MALE" ? "Boy" : "Girl"} &middot; Class of{" "}
                  {player.gradYear} &middot;{" "}
                  {[player.city, player.state, player.country].filter(Boolean).join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
