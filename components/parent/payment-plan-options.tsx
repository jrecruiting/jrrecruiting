"use client";

import { useActionState } from "react";
import { createPaymentPlanCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SUBSCRIPTION_PLANS,
  calculateInstallmentSchedule,
  formatCents,
  type PackageTier,
  type SubscriptionPlan,
} from "@/lib/pricing";

function PlanOption({ playerId, tier, plan }: { playerId: string; tier: PackageTier; plan: SubscriptionPlan }) {
  const boundAction = createPaymentPlanCheckoutSession.bind(null, playerId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);
  const schedule = calculateInstallmentSchedule(tier, plan);
  const closeEnough = Math.abs(schedule.finalInstallmentCents - schedule.monthlyCents) < 100;
  const monthCount = closeEnough ? schedule.totalInstallments : schedule.fullInstallments;

  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
          {plan.upfrontPercent}% down
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl font-bold">{formatCents(schedule.upfrontCents)}</span>
          <span className="text-sm text-muted-foreground">up front</span>
        </div>
        <p className="text-sm text-muted-foreground">
          then, starting one month from today, {formatCents(schedule.monthlyCents)}/mo for {monthCount}{" "}
          month{monthCount === 1 ? "" : "s"}
          {!closeEnough && (
            <>, plus a final payment of {formatCents(schedule.finalInstallmentCents)}</>
          )}
        </p>
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="upfrontPercent" value={plan.upfrontPercent} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            {isPending ? "Redirecting to checkout..." : "Choose This Plan"}
          </Button>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export function PaymentPlanOptions({ playerId, tier }: { playerId: string; tier: PackageTier }) {
  const plans = SUBSCRIPTION_PLANS[tier.id];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <PlanOption key={plan.upfrontPercent} playerId={playerId} tier={tier} plan={plan} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Payment plans pay the full listing rate over time and don&apos;t include the
        early-signup discount available when paying in full. Billing stops automatically
        once the balance is paid off. Your profile goes live as soon as the first payment
        succeeds.
      </p>
    </div>
  );
}
