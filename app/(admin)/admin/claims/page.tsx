import { prisma } from "@/lib/prisma";
import { resolveClaim } from "@/actions/claims";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminClaimsPage() {
  const claims = await prisma.claimRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { player: true, requester: true },
    take: 100,
  });

  const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Claim Requests</h1>

      {claims.length === 0 ? (
        <p className="text-muted-foreground">No claim requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {claims.map((claim) => {
            const approve = resolveClaim.bind(null, claim.id, true);
            const reject = resolveClaim.bind(null, claim.id, false);
            return (
              <Card key={claim.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {claim.player.firstName} {claim.player.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested by {claim.requester.name} ({claim.requester.email})
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[claim.status]}>{claim.status}</Badge>
                    {claim.status === "PENDING" && (
                      <>
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
                      </>
                    )}
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
