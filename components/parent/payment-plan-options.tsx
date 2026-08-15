"use client";

import { useActionState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { createPaymentPlanCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import {
  SUBSCRIPTION_PLANS,
  calculateInstallmentSchedule,
  formatCents,
  PROMO_PLAN_TOTAL_CENTS,
  type PackageTier,
  type SubscriptionPlan,
} from "@/lib/pricing";

function PlanOption({
  playerId,
  tier,
  plan,
  promoCode,
  index,
}: {
  playerId: string;
  tier: PackageTier;
  plan: SubscriptionPlan;
  promoCode?: string;
  index: number;
}) {
  const boundAction = createPaymentPlanCheckoutSession.bind(null, playerId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);
  const reduceMotion = useReducedMotion();
  const schedule = calculateInstallmentSchedule(
    tier,
    plan,
    promoCode ? PROMO_PLAN_TOTAL_CENTS : undefined
  );
  const closeEnough = Math.abs(schedule.finalInstallmentCents - schedule.monthlyCents) < 100;
  const monthCount = closeEnough ? schedule.totalInstallments : schedule.fullInstallments;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduceMotion ? 0 : index * 0.06, ease: "easeOut" }}
    >
      <Card className="h-full border-border/60">
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
            {promoCode && <input type="hidden" name="promoCode" value={promoCode} />}
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
    </motion.div>
  );
}

export function PaymentPlanOptions({
  playerId,
  tier,
  promoCode,
}: {
  playerId: string;
  tier: PackageTier;
  promoCode?: string;
}) {
  const plans = SUBSCRIPTION_PLANS[tier.id];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan, index) => (
          <PlanOption
            key={plan.upfrontPercent}
            playerId={playerId}
            tier={tier}
            plan={plan}
            promoCode={promoCode}
            index={index}
          />
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <LockSimple className="h-3 w-3 shrink-0" aria-hidden />
        Secure checkout via Stripe &mdash; we never see or store your card details.
      </p>
      <p className="text-xs text-muted-foreground">
        Payment plans pay the full listing rate over time and don&apos;t include the
        early-signup discount available when paying in full. Billing stops automatically
        once the balance is paid off. Your profile goes live as soon as the first payment
        succeeds.
      </p>
    </div>
  );
}
