import type { Metadata } from "next";
import { PricingCategoryTabs } from "@/components/marketing/pricing-category-tabs";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One-time listing packages for High School, JUCO, and Transfer athletes, with early-signup discounts and monthly payment plan options.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Pricing
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Start earlier, save more
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Pay in full and lock in a discount for signing up early, or spread
          the cost out with a monthly payment plan. Either way, it&apos;s a
          one-time purchase &mdash; no recurring renewals once you&apos;re
          paid off.
        </p>
      </div>

      <PricingCategoryTabs />
    </div>
  );
}
