import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { priceForTier, formatCents, gradYearForTier, type PackageTier } from "@/lib/pricing";

export function OneTimePricingGrid({
  tiers,
  showGradYear = true,
  bestValueId,
}: {
  tiers: PackageTier[];
  showGradYear?: boolean;
  bestValueId?: string;
}) {
  return (
    <div
      className={`grid gap-5 ${tiers.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4" : "mx-auto max-w-sm"}`}
    >
      {tiers.map((tier) => {
        const { annualRateCents, totalCents } = priceForTier(tier);
        const gradYear = gradYearForTier(tier);
        const isBestValue = tier.id === bestValueId;

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
                {showGradYear && (
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {tier.gradeLabel} &middot; Class of {gradYear}
                  </span>
                )}
                <h2 className="mt-1 font-heading text-xl font-bold">{tier.name}</h2>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-bold">{formatCents(totalCents)}</span>
                  {tier.discountPercent > 0 ? (
                    <Badge variant="secondary">{tier.discountPercent}% off</Badge>
                  ) : (
                    <Badge variant="outline">Full price</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCents(annualRateCents)}/yr &middot; {tier.years} year
                  {tier.years === 1 ? "" : "s"} covered
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
  );
}
