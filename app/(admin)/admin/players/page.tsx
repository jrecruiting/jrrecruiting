import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { playerTypeLabel } from "@/lib/player-types";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  DRAFT: "secondary",
  PENDING_PAYMENT: "outline",
  INACTIVE: "outline",
  EXPIRED: "destructive",
};

export default async function AdminPlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { createdAt: "desc" },
    include: { sports: { include: { sport: true } } },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Players</h1>
        <Button nativeButton={false} render={<Link href="/admin/players/new" />}>
          <Plus className="h-4 w-4" weight="bold" aria-hidden />
          Add Player
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Grad Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No players yet. Add the first profile to get started.
                </TableCell>
              </TableRow>
            )}
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/players/${player.id}/edit`}
                    className="hover:underline"
                  >
                    {player.firstName} {player.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  {player.sports.map((s) => s.sport.name).join(", ") || "—"}
                </TableCell>
                <TableCell>{playerTypeLabel(player.playerType)}</TableCell>
                <TableCell>{player.gender === "MALE" ? "Boy" : "Girl"}</TableCell>
                <TableCell>
                  {[player.city, player.state, player.country].filter(Boolean).join(", ")}
                </TableCell>
                <TableCell>{player.gradYear}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[player.listingStatus] ?? "outline"}>
                    {player.listingStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {player.isAdminAuthored ? "Admin" : "Parent"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
