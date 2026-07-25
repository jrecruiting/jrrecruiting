import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlayerPhoto } from "@/components/player/player-photo";
import { Card, CardContent } from "@/components/ui/card";

export default async function TeamCoachDashboardPage() {
  const session = await auth();

  const access = await prisma.teamCoachAccess.findMany({
    where: { teamCoachId: session!.user.id },
    include: {
      player: {
        include: { sports: { include: { sport: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">My Athletes</h1>
        <p className="text-sm text-muted-foreground">
          Athletes J.R. Recruiting has given you access to follow.
        </p>
      </div>

      {access.length === 0 ? (
        <p className="text-muted-foreground">
          No athletes are linked to your account yet. Contact J.R. Recruiting if that doesn&apos;t
          look right.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {access.map(({ player }) => (
            <Link key={player.id} href={`/team/players/${player.id}`}>
              <Card className="border-border/60 transition-colors hover:border-gold/50">
                <CardContent className="flex items-center gap-3">
                  <PlayerPhoto
                    pathname={player.primaryPhotoUrl}
                    alt={`${player.firstName} ${player.lastName}`}
                    size="sm"
                  />
                  <div>
                    <p className="font-heading text-base font-semibold">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {player.sports.map((s) => s.sport.name).join(", ") || "No sport set"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
