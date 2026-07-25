import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTeamCoachForm } from "@/components/admin/create-team-coach-form";
import { TeamCoachRow } from "@/components/admin/team-coach-row";

export default async function AdminTeamCoachesPage() {
  const teamCoaches = await prisma.user.findMany({
    where: { role: "TEAM_COACH" },
    orderBy: { createdAt: "desc" },
    include: {
      teamCoachAccess: {
        include: { player: { select: { id: true, firstName: true, lastName: true } } },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Team Coaches</h1>
        <p className="text-sm text-muted-foreground">
          Give a player&apos;s own coach read-only access to their profile -- they&apos;ll see
          updates and when a college coach reviews it, with no edit rights.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Add a Team Coach</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTeamCoachForm />
        </CardContent>
      </Card>

      {teamCoaches.length === 0 ? (
        <p className="text-muted-foreground">No team coach accounts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {teamCoaches.map((coach) => (
            <Card key={coach.id} className="border-border/60">
              <CardContent className="flex flex-col gap-3">
                <div>
                  <p className="font-medium">{coach.name}</p>
                  <p className="text-xs text-muted-foreground">{coach.email}</p>
                </div>
                <TeamCoachRow
                  teamCoachId={coach.id}
                  coachName={coach.name}
                  linkedPlayers={coach.teamCoachAccess.map((a) => a.player)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
