import { prisma } from "@/lib/prisma";
import { approveCoach, rejectCoach } from "@/actions/coaches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteCoachButton } from "@/components/admin/delete-coach-button";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default async function AdminCoachesPage() {
  const coaches = await prisma.coachProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Coach Verification</h1>

      {coaches.length === 0 ? (
        <p className="text-muted-foreground">No coach sign-ups yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {coaches.map((coach) => {
            const approve = approveCoach.bind(null, coach.id);
            const reject = rejectCoach.bind(null, coach.id, "");
            return (
              <Card key={coach.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{coach.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {coach.user.email} &middot; {coach.organization}
                      {coach.title ? ` · ${coach.title}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[coach.verificationStatus]}>
                      {coach.verificationStatus}
                    </Badge>
                    {coach.verificationStatus === "PENDING" && (
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
                    <DeleteCoachButton userId={coach.userId} coachName={coach.user.name} />
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
