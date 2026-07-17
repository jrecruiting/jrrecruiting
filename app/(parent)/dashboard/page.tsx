import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Eye } from "@phosphor-icons/react/dist/ssr";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  DRAFT: "secondary",
  PENDING_PAYMENT: "outline",
  INACTIVE: "outline",
  EXPIRED: "destructive",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Live",
  DRAFT: "Draft — payment needed",
  PENDING_PAYMENT: "Payment processing",
  INACTIVE: "Inactive",
  EXPIRED: "Expired",
};

export default async function ParentDashboardPage() {
  const session = await auth();
  const players = await prisma.player.findMany({
    where: { parentId: session!.user.id },
    include: {
      sports: { include: { sport: true } },
      _count: { select: { profileViews: true, stars: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">My Athletes</h1>
          <p className="text-sm text-muted-foreground">
            Manage your children&apos;s recruiting profiles.
          </p>
        </div>
        <Button
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/dashboard/players/new" />}
        >
          <Plus className="h-4 w-4" weight="bold" aria-hidden />
          Add Athlete
        </Button>
      </div>

      {players.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t added any athletes yet.
            </p>
            <Button
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/dashboard/players/new">Add Your First Athlete</Link>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((player) => (
            <Card key={player.id} className="border-border/60">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/dashboard/players/${player.id}/edit`}
                      className="font-heading text-lg font-semibold hover:text-gold"
                    >
                      {player.firstName} {player.lastName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {player.sports.map((s) => s.sport.name).join(", ") || "No sport set"}{" "}
                      &middot; Class of {player.gradYear}
                    </p>
                  </div>
                  <Badge variant={statusVariant[player.listingStatus] ?? "outline"}>
                    {statusLabel[player.listingStatus] ?? player.listingStatus}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {player._count.profileViews} coach view
                    {player._count.profileViews === 1 ? "" : "s"}
                  </span>
                  <span>
                    {player._count.stars} star{player._count.stars === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/60"
                    nativeButton={false}
                    render={<Link href={`/dashboard/players/${player.id}/edit`}>Edit</Link>}
                  />
                  {player.listingStatus === "DRAFT" && (
                    <Button
                      size="sm"
                      className="bg-gold text-gold-foreground hover:bg-gold/90"
                      nativeButton={false}
                      render={
                        <Link href={`/dashboard/players/${player.id}/payment`}>
                          Complete Listing
                        </Link>
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
