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

export default async function AdminParentViewsPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const { playerId } = await searchParams;

  const grouped = await prisma.parentViewEvent.groupBy({
    by: ["playerId", "parentId"],
    where: playerId ? { playerId } : {},
    _count: { _all: true },
    _max: { viewedAt: true },
    _min: { viewedAt: true },
    orderBy: { _max: { viewedAt: "desc" } },
    take: 200,
  });

  const playerIds = [...new Set(grouped.map((g) => g.playerId))];
  const parentIds = [...new Set(grouped.map((g) => g.parentId))];

  const [players, parents] = await Promise.all([
    prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.user.findMany({
      where: { id: { in: parentIds } },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const playerById = new Map(players.map((p) => [p.id, p]));
  const parentById = new Map(parents.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Parent Visits</h1>
          <p className="text-sm text-muted-foreground">
            When each parent has opened their own athlete's profile, most recently viewed first.
          </p>
        </div>
        {playerId && (
          <Link href="/admin/parent-views" className="text-sm text-gold hover:underline">
            Clear filter
          </Link>
        )}
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>First Visited</TableHead>
              <TableHead className="text-right">Last Visited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grouped.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No parent has visited their athlete's profile yet.
                </TableCell>
              </TableRow>
            )}
            {grouped.map((row) => {
              const player = playerById.get(row.playerId);
              const parent = parentById.get(row.parentId);
              return (
                <TableRow key={`${row.playerId}-${row.parentId}`}>
                  <TableCell className="font-medium">
                    {player ? (
                      <Link href={`/admin/players/${player.id}/edit`} className="hover:underline">
                        {player.firstName} {player.lastName}
                      </Link>
                    ) : (
                      "Deleted player"
                    )}
                  </TableCell>
                  <TableCell>{parent ? `${parent.name} (${parent.email})` : "Unknown parent"}</TableCell>
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
