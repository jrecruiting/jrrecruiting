import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveSchoolInterest } from "@/actions/school-interest";
import { formatPacificDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminSchoolInterestPage() {
  const schoolInterests = await prisma.schoolInterest.findMany({
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
      <h1 className="font-heading text-2xl font-bold tracking-tight">Pending Schools in Contact</h1>

      {schoolInterests.length === 0 ? (
        <p className="text-muted-foreground">No submissions waiting on review.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {schoolInterests.map((entry) => {
            const approve = resolveSchoolInterest.bind(null, entry.id, true);
            const reject = resolveSchoolInterest.bind(null, entry.id, false);
            return (
              <Card key={entry.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {entry.schoolName} &middot;{" "}
                      <Link
                        href={`/admin/players/${entry.playerSport.player.id}/edit`}
                        className="hover:underline"
                      >
                        {entry.playerSport.player.firstName} {entry.playerSport.player.lastName}
                      </Link>{" "}
                      ({entry.playerSport.sport.name})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {entry.submitter.name} ({entry.submitter.email}) &middot;{" "}
                      {formatPacificDateTime(entry.createdAt)}
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
