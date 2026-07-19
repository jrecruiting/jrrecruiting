"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OneTimePricingGrid } from "@/components/marketing/one-time-pricing-grid";
import { SubscriptionPlans } from "@/components/marketing/subscription-plans";
import type { PackageTier } from "@/lib/pricing";

export function PricingCategory({
  tiers,
  showGradYear,
  bestValueId,
}: {
  tiers: PackageTier[];
  showGradYear: boolean;
  bestValueId?: string;
}) {
  const [mode, setMode] = useState<"full" | "monthly">("full");

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="inline-flex w-fit items-center gap-[3px] rounded-lg bg-muted p-[3px]">
        <Button
          type="button"
          size="sm"
          variant={mode === "full" ? "default" : "ghost"}
          className={mode === "full" ? "" : "text-foreground/60 hover:text-foreground"}
          onClick={() => setMode("full")}
        >
          Pay in Full
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "monthly" ? "default" : "ghost"}
          className={mode === "monthly" ? "" : "text-foreground/60 hover:text-foreground"}
          onClick={() => setMode("monthly")}
        >
          Payment Plan
        </Button>
      </div>

      <div className="w-full">
        {mode === "full" ? (
          <>
            <OneTimePricingGrid tiers={tiers} showGradYear={showGradYear} bestValueId={bestValueId} />
            {showGradYear && (
              <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
                Package is selected automatically based on your athlete&apos;s
                graduation year when you complete their profile.
              </p>
            )}
          </>
        ) : (
          <>
            <SubscriptionPlans tiers={tiers} showGradYear={showGradYear} />
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
              Payment plans pay the full listing rate over time and don&apos;t
              include the early-signup discount available when paying in
              full. Billing stops automatically once the balance is paid
              off.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
