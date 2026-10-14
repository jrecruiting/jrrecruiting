import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { approveCoach, rejectCoach } from "@/actions/coaches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteCoachButton } from "@/components/admin/delete-coach-button";
import { BulkCoachControls } from "@/components/admin/bulk-coach-controls";
import { TestAccountToggle } from "@/components/admin/test-account-toggle";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default async function AdminCoachesPage() {
  // Coaches who signed up but haven't clicked their confirmation email yet
  // are kept out of the queue -- that's the whole point of confirming: a
  // fake sign-up never reaches this list. Anyone without an outstanding
  // confirmation (every coach from before this existed, plus admin-created
  // ones) shows as normal.
  const [coaches, unconfirmedCount] = await Promise.all([
    prisma.coachProfile.findMany({
      where: { user: { emailVerificationTokens: { none: { usedAt: null } } } },
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 100,
    }),
    prisma.coachProfile.count({
      where: { user: { emailVerificationTokens: { some: { usedAt: null } } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Coach Verification</h1>
        <Button nativeButton={false} render={<Link href="/admin/coaches/new" />}>
          <Plus className="h-4 w-4" weight="bold" aria-hidden />
          Add Coach
        </Button>
      </div>

      {unconfirmedCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {unconfirmedCount} sign-up{unconfirmedCount === 1 ? "" : "s"} waiting on email
          confirmation {unconfirmedCount === 1 ? "is" : "are"} hidden from this list.
          Unconfirmed sign-ups are removed automatically after 14 days.
        </p>
      )}

      <BulkCoachControls
        pendingCount={coaches.filter((c) => c.verificationStatus === "PENDING").length}
      />

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
                  <div className="flex items-start gap-3">
                    {coach.verificationStatus === "PENDING" && (
                      <input
                        type="checkbox"
                        name="bulk-coach"
                        value={coach.userId}
                        aria-label={`Select ${coach.user.name}`}
                        className="mt-1 h-4 w-4 cursor-pointer accent-[var(--gold)]"
                      />
                    )}
                    <div>
                      <p className="font-medium">{coach.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {coach.user.email} &middot; {coach.organization}
                        {coach.title ? ` · ${coach.title}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <TestAccountToggle
                      coachProfileId={coach.id}
                      isTestAccount={coach.isTestAccount}
                    />
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
