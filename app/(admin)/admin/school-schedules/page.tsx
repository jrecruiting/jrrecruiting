import { prisma } from "@/lib/prisma";
import { deleteSchoolSchedule } from "@/actions/school-schedules";
import { SchoolScheduleForm } from "@/components/admin/school-schedule-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminSchoolSchedulesPage() {
  const [schedules, players] = await Promise.all([
    prisma.schoolFootballSchedule.findMany({ orderBy: { schoolName: "asc" } }),
    prisma.player.findMany({
      where: { listingStatus: "ACTIVE", schoolName: { not: null } },
      select: { schoolName: true },
      distinct: ["schoolName"],
      orderBy: { schoolName: "asc" },
    }),
  ]);

  const schoolNames = players
    .map((p) => p.schoolName)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">School Football Schedules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a schedule link (e.g. MaxPreps) for a school, and every player with that exact
          school on file will show a &quot;View Schedule&quot; link on their coach-facing profile.
        </p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent>
          <SchoolScheduleForm schoolNames={schoolNames} />
        </CardContent>
      </Card>

      {schedules.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Current links
          </h2>
          <div className="flex max-w-2xl flex-col gap-3">
            {schedules.map((s) => (
              <Card key={s.id} className="border-border/60">
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading font-semibold">{s.schoolName}</p>
                    <a
                      href={s.scheduleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:underline"
                    >
                      {s.scheduleUrl}
                    </a>
                  </div>
                  <form action={deleteSchoolSchedule.bind(null, s.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
