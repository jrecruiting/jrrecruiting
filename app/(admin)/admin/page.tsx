import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [playerCount, activeCoachCount, pendingCoachCount, pendingEditCount] = await Promise.all([
    prisma.player.count(),
    prisma.coachProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.coachProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.playerEditRequest.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Total Players", value: playerCount },
    { label: "Verified Coaches", value: activeCoachCount },
    { label: "Pending Coach Reviews", value: pendingCoachCount },
    { label: "Pending Edit Requests", value: pendingEditCount },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
