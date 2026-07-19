import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SUBSCRIPTION_PLANS,
  fullPriceForTier,
  calculateInstallmentSchedule,
  formatCents,
  gradYearForTier,
  type PackageTier,
} from "@/lib/pricing";

export function SubscriptionPlans({
  tiers,
  showGradYear = true,
}: {
  tiers: PackageTier[];
  showGradYear?: boolean;
}) {
  return (
    <div className="flex flex-col gap-12">
      {tiers.map((tier) => {
        const totalCents = fullPriceForTier(tier);
        const gradYear = gradYearForTier(tier);
        const plans = SUBSCRIPTION_PLANS[tier.id];

        return (
          <div key={tier.id} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                {showGradYear && (
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {tier.gradeLabel} &middot; Class of {gradYear}
                  </span>
                )}
                <h3 className="font-heading text-lg font-bold">{tier.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full price: <span className="font-semibold text-foreground">{formatCents(totalCents)}</span>{" "}
                (no early-signup discount on payment plans)
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => {
                const schedule = calculateInstallmentSchedule(tier, plan);
                const closeEnough =
                  Math.abs(schedule.finalInstallmentCents - schedule.monthlyCents) < 100;

                return (
                  <Card key={plan.upfrontPercent} className="border-border/60">
                    <CardContent className="flex flex-col gap-3">
                      <span className="w-fit rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                        {plan.upfrontPercent}% down
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-2xl font-bold">
                          {formatCents(schedule.upfrontCents)}
                        </span>
                        <span className="text-sm text-muted-foreground">up front</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        then {formatCents(schedule.monthlyCents)}/mo for{" "}
                        {closeEnough ? schedule.totalInstallments : schedule.fullInstallments} month
                        {(closeEnough ? schedule.totalInstallments : schedule.fullInstallments) === 1
                          ? ""
                          : "s"}
                        {!closeEnough && (
                          <>, plus a final payment of {formatCents(schedule.finalInstallmentCents)}</>
                        )}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-1 border-border/60"
                        nativeButton={false}
                        render={<Link href="/sign-up">Choose This Plan</Link>}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
