import Link from "next/link";
import { requireVerifiedCoach } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { StarredPlayerRow } from "@/components/coach/starred-player-row";

export default async function StarredPlayersPage() {
  const session = await requireVerifiedCoach();

  const stars = await prisma.star.findMany({
    where: { coachId: session.user.id },
    include: {
      player: { include: { sports: { include: { sport: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Starred Players</h1>

      {stars.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t starred any players yet.{" "}
          <Link href="/search" className="text-gold hover:underline">
            Browse players
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
          {stars.map((star) => (
            <StarredPlayerRow
              key={star.id}
              playerId={star.playerId}
              name={`${star.player.firstName} ${star.player.lastName}`}
              detail={`${star.player.sports.map((s) => s.sport.name).join(", ") || "No sport set"} · Class of ${star.player.gradYear}`}
              notifyOnUpdate={star.notifyOnUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
