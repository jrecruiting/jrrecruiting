import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProfileViewsPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const { playerId } = await searchParams;

  const grouped = await prisma.profileViewEvent.groupBy({
    by: ["playerId", "coachId"],
    where: { coachId: { not: null }, ...(playerId ? { playerId } : {}) },
    _count: { _all: true },
    _max: { viewedAt: true },
    _min: { viewedAt: true },
    orderBy: { _max: { viewedAt: "desc" } },
    take: 200,
  });

  const playerIds = [...new Set(grouped.map((g) => g.playerId))];
  const coachIds = [...new Set(grouped.map((g) => g.coachId).filter((id): id is string => id !== null))];

  const [players, coaches] = await Promise.all([
    prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.user.findMany({
      where: { id: { in: coachIds } },
      select: { id: true, name: true, email: true, coachProfile: { select: { organization: true } } },
    }),
  ]);

  const playerById = new Map(players.map((p) => [p.id, p]));
  const coachById = new Map(coaches.map((c) => [c.id, c]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Profile Views</h1>
          <p className="text-sm text-muted-foreground">
            Which coaches have reviewed which player profiles, most recently viewed first.
          </p>
        </div>
        {playerId && (
          <Link href="/admin/profile-views" className="text-sm text-gold hover:underline">
            Clear filter
          </Link>
        )}
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>First Viewed</TableHead>
              <TableHead className="text-right">Last Viewed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grouped.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No coach has viewed a player profile yet.
                </TableCell>
              </TableRow>
            )}
            {grouped.map((row) => {
              const player = playerById.get(row.playerId);
              const coach = row.coachId ? coachById.get(row.coachId) : undefined;
              return (
                <TableRow key={`${row.playerId}-${row.coachId}`}>
                  <TableCell className="font-medium">
                    {player ? (
                      <Link href={`/admin/players/${player.id}/edit`} className="hover:underline">
                        {player.firstName} {player.lastName}
                      </Link>
                    ) : (
                      "Deleted player"
                    )}
                  </TableCell>
                  <TableCell>{coach ? `${coach.name} (${coach.email})` : "Unknown coach"}</TableCell>
                  <TableCell>{coach?.coachProfile?.organization ?? "—"}</TableCell>
                  <TableCell>{row._count._all}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row._min.viewedAt?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row._max.viewedAt?.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
