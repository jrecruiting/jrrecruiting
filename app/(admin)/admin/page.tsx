import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [
    playerCount,
    activeCoachCount,
    pendingCoachCount,
    pendingEditCount,
    pendingClaimCount,
    pendingOfferCount,
  ] = await Promise.all([
    prisma.player.count(),
    prisma.coachProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.coachProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.playerEditRequest.count({ where: { status: "PENDING" } }),
    prisma.claimRequest.count({ where: { status: "PENDING" } }),
    prisma.offer.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Total Players", value: playerCount },
    { label: "Verified Coaches", value: activeCoachCount },
    { label: "Pending Coach Reviews", value: pendingCoachCount },
    { label: "Pending Edit Requests", value: pendingEditCount },
    { label: "Pending Claims", value: pendingClaimCount, href: "/admin/claims" },
    { label: "Pending Offers", value: pendingOfferCount, href: "/admin/offers" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const needsAttention = Boolean(stat.href) && stat.value > 0;
          const card = (
            <Card
              className={
                needsAttention ? "border-gold/50 bg-gold/5" : "border-border/60"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
