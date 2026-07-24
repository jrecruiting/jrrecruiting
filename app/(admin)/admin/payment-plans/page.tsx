import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";
import { formatPacificDate } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  PAST_DUE: "destructive",
  COMPLETED: "outline",
  CANCELED: "secondary",
};

export default async function AdminPaymentPlansPage() {
  const plans = await prisma.paymentPlanSubscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { player: true, parent: true },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Payment Plans</h1>
      <p className="text-sm text-muted-foreground">
        Monthly listing payment plans. Status <strong>Past Due</strong> means the most recent
        installment charge failed &mdash; Stripe retries automatically, but you may want to
        follow up if it stays past due.
      </p>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Upfront</TableHead>
              <TableHead>Monthly</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No payment plans yet.
                </TableCell>
              </TableRow>
            )}
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {plan.player.firstName} {plan.player.lastName}
                </TableCell>
                <TableCell>{plan.parent.email}</TableCell>
                <TableCell>{formatCents(plan.upfrontCents)}</TableCell>
                <TableCell>{formatCents(plan.monthlyCents)}/mo</TableCell>
                <TableCell>
                  {plan.installmentsPaid} / {plan.totalInstallments}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[plan.status] ?? "outline"}>
                    {plan.status.replace("_", " ")}
                  </Badge>
                  {plan.lastPaymentError && (
                    <p className="mt-1 text-xs text-destructive">{plan.lastPaymentError}</p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatPacificDate(plan.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
