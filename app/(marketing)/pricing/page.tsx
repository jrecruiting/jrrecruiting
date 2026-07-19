import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubscriptionPlans } from "@/components/marketing/subscription-plans";
import {
  PACKAGE_TIERS,
  priceForTier,
  formatCents,
  gradYearForTier,
} from "@/lib/pricing";

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

      <Tabs defaultValue="full" className="items-center">
        <TabsList>
          <TabsTrigger value="full">Pay in Full</TabsTrigger>
          <TabsTrigger value="monthly">Payment Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="full" className="w-full pt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGE_TIERS.map((tier) => {
              const { annualRateCents, totalCents } = priceForTier(tier);
              const gradYear = gradYearForTier(tier);
              const isBestValue = tier.id === "freshman";

              return (
                <Card
                  key={tier.id}
                  className={`relative flex flex-col border-border/60 ${isBestValue ? "border-gold/50" : ""}`}
                >
                  {isBestValue && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground">
                      Best Value
                    </Badge>
                  )}
                  <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {tier.gradeLabel} &middot; Class of {gradYear}
                      </span>
                      <h2 className="mt-1 font-heading text-xl font-bold">{tier.name}</h2>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-3xl font-bold">
                          {formatCents(totalCents)}
                        </span>
                        {tier.discountPercent > 0 ? (
                          <Badge variant="secondary">{tier.discountPercent}% off</Badge>
                        ) : (
                          <Badge variant="outline">Full price</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCents(annualRateCents)}/yr &middot; {tier.years}{" "}
                        year{tier.years === 1 ? "" : "s"} covered
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      One verified, searchable profile &mdash; covered through
                      graduation, no renewal needed.
                    </p>

                    <Button
                      className="mt-auto bg-gold text-gold-foreground hover:bg-gold/90"
                      nativeButton={false}
                      render={<Link href="/sign-up">Get Started</Link>}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Package is selected automatically based on your athlete&apos;s
            graduation year when you complete their profile.
          </p>
        </TabsContent>

        <TabsContent value="monthly" className="w-full pt-10">
          <SubscriptionPlans />
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Payment plans pay the full listing rate over time and don&apos;t
            include the early-signup discount available when paying in full.
            Billing stops automatically once the balance is paid off.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
