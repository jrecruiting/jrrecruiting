import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  priceForTier,
  fullPriceForTier,
  formatCents,
  gradYearForTier,
  signUpHrefForTier,
  type PackageTier,
} from "@/lib/pricing";

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
      className={`grid gap-5 ${tiers.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4 lg:items-end" : "mx-auto max-w-sm"}`}
    >
      {tiers.map((tier) => {
        const { annualRateCents, totalCents } = priceForTier(tier);
        const fullCents = fullPriceForTier(tier);
        const savingsCents = fullCents - totalCents;
        const gradYear = gradYearForTier(tier);
        const isBestValue = tier.id === bestValueId;

        return (
          <div key={tier.id} className="relative">
            {isBestValue && (
              <Badge className="absolute -top-3 left-6 z-10 bg-gold text-gold-foreground">
                Best Value
              </Badge>
            )}
            <Card
              className={
                isBestValue
                  ? "flex h-full flex-col border-gold/35 bg-gradient-to-b from-card to-card/60 shadow-[0_18px_45px_-20px_rgba(249,173,38,0.45)] lg:-translate-y-2.5"
                  : "flex h-full flex-col border-border/60"
              }
            >
              <CardContent className={`flex flex-1 flex-col gap-4 ${isBestValue ? "pt-6" : "pt-4"}`}>
                <div>
                  {showGradYear && (
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {tier.gradeLabel} &middot; Class of {gradYear}
                    </span>
                  )}
                  <h2 className="mt-1 font-heading text-xl font-bold">{tier.name}</h2>
                </div>

                <div className="flex flex-col gap-1">
                  {savingsCents > 0 && (
                    <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                      {formatCents(fullCents)}
                    </span>
                  )}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`font-heading font-bold tracking-tight ${isBestValue ? "text-4xl" : "text-3xl"}`}
                    >
                      {formatCents(totalCents)}
                    </span>
                    {savingsCents > 0 && (
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold">
                        Save {formatCents(savingsCents)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCents(annualRateCents)}/yr &middot; {tier.years} year
                    {tier.years === 1 ? "" : "s"} covered
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  A verified, searchable profile with personal coach outreach
                  and professional film editing, covered through graduation.
                </p>

                <Button
                  variant={isBestValue ? "default" : "outline"}
                  className={isBestValue ? "mt-auto bg-gold text-gold-foreground hover:bg-gold/90" : "mt-auto border-border/60"}
                  nativeButton={false}
                  render={<Link href={signUpHrefForTier(tier)}>Get Started</Link>}
                />
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
