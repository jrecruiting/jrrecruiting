import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminCoachMessagesPage() {
  const messages = await prisma.coachInquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      coach: { select: { name: true, email: true, coachProfile: { select: { organization: true } } } },
    },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Coach Messages</h1>
        <p className="text-sm text-muted-foreground">
          Questions and comments coaches have sent through "Contact J.R. Recruiting", most recent
          first.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-10 text-center text-muted-foreground">
            No coach messages yet.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <Card key={m.id} className="border-border/60">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">
                    {m.coach.name}{" "}
                    <span className="font-normal text-muted-foreground">({m.coach.email})</span>
                    {m.coach.coachProfile?.organization && (
                      <span className="text-muted-foreground"> &mdash; {m.coach.coachProfile.organization}</span>
                    )}
                  </p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {m.createdAt.toLocaleString()}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
