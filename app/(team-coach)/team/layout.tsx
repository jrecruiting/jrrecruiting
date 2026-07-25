import { requireRole } from "@/lib/permissions";
import { TeamCoachNav } from "@/components/team-coach/team-coach-nav";

export default async function TeamCoachDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("TEAM_COACH");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TeamCoachNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
