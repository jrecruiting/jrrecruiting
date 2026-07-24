import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveOffer } from "@/actions/offers";
import { formatPacificDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      playerSport: {
        include: { player: { select: { id: true, firstName: true, lastName: true } }, sport: true },
      },
      submitter: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Pending Offers</h1>

      {offers.length === 0 ? (
        <p className="text-muted-foreground">No offers waiting on review.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {offers.map((offer) => {
            const approve = resolveOffer.bind(null, offer.id, true);
            const reject = resolveOffer.bind(null, offer.id, false);
            return (
              <Card key={offer.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {offer.schoolName} &middot;{" "}
                      <Link
                        href={`/admin/players/${offer.playerSport.player.id}/edit`}
                        className="hover:underline"
                      >
                        {offer.playerSport.player.firstName} {offer.playerSport.player.lastName}
                      </Link>{" "}
                      ({offer.playerSport.sport.name})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {offer.submitter.name} ({offer.submitter.email}) &middot;{" "}
                      {formatPacificDateTime(offer.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={approve}>
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-gold text-gold-foreground hover:bg-gold/90"
                      >
                        Approve
                      </Button>
                    </form>
                    <form action={reject}>
                      <Button type="submit" size="sm" variant="destructive">
                        Reject
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
