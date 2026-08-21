import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { resendEmail } from "@/actions/admin-email-log";
import { LocalDateTime } from "@/components/shared/local-date-time";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  SENT: "default",
  FAILED: "destructive",
};

export default async function AdminEmailLogPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  await requireRole("ADMIN");
  const { email } = await searchParams;

  const rows = await prisma.emailOutbox.findMany({
    where: email ? { toEmail: { contains: email, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Email Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every email the system has tried to send &mdash; whether it went out, and why it
          didn&apos;t if it failed. Showing the {rows.length} most recent
          {email ? ` matching "${email}"` : ""}.
        </p>
      </div>

      <form className="flex max-w-md gap-2">
        <Input
          name="email"
          type="search"
          placeholder="Search by email address"
          defaultValue={email ?? ""}
        />
        <Button type="submit" variant="outline" className="border-border/60">
          Search
        </Button>
      </form>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">No emails found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <Card key={row.id} className="border-border/60">
              <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.toEmail}</p>
                    <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.templateKey} &middot; created{" "}
                    <LocalDateTime iso={row.createdAt.toISOString()} />
                    {row.sentAt && (
                      <>
                        {" "}
                        &middot; sent <LocalDateTime iso={row.sentAt.toISOString()} />
                      </>
                    )}
                    {row.attempts > 0 && ` · ${row.attempts} attempt${row.attempts === 1 ? "" : "s"}`}
                  </p>
                  {row.lastError && (
                    <p className="text-xs text-destructive">{row.lastError}</p>
                  )}
                </div>
                <form action={resendEmail.bind(null, row.id)}>
                  <Button type="submit" size="sm" variant="outline" className="border-border/60">
                    Resend
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
