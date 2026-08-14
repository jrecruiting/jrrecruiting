import type { Metadata } from "next";
import Link from "next/link";
import { PricingCategoryTabs } from "@/components/marketing/pricing-category-tabs";
import { Reveal } from "@/components/marketing/reveal";

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
          one-time purchase. No recurring renewals once you&apos;re
          paid off.
        </p>
      </div>

      <PricingCategoryTabs />

      <Reveal className="mx-auto mt-20 max-w-2xl">
        <div className="flex gap-5 rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <span className="w-[3px] shrink-0 rounded-full bg-gold" aria-hidden />
          <div className="flex flex-col gap-3">
            <blockquote className="text-balance font-heading text-lg font-medium leading-relaxed text-foreground">
              &ldquo;It was a great experience. He&apos;s really good with
              communication. He updates you when your tape is sent out and
              when coaches ask about you. Truthful guy who just wants to
              help. I am attending Liberty University.&rdquo;
            </blockquote>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              <span className="text-foreground">Kendrick Bradley</span> &middot; CA
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Read more stories on the{" "}
          <Link href="/testimonials" className="font-semibold text-gold hover:underline">
            testimonials page
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
