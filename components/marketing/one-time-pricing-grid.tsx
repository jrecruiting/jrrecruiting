import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  // Meter widths are relative to the biggest saver in this set (not a
  // global constant), so the "start earlier, save more" argument still
  // reads correctly if tiers/discounts ever change.
  const savingsByTier = tiers.map((tier) => fullPriceForTier(tier) - priceForTier(tier).totalCents);
  const maxSavings = Math.max(0, ...savingsByTier);

  return (
    <div className={`grid gap-5 ${tiers.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4" : "mx-auto max-w-sm"}`}>
      {tiers.map((tier, i) => {
        const { annualRateCents, totalCents } = priceForTier(tier);
        const fullCents = fullPriceForTier(tier);
        const savingsCents = savingsByTier[i];
        const gradYear = gradYearForTier(tier);
        const isBestValue = tier.id === bestValueId;
        const meterPercent = maxSavings > 0 ? Math.round((savingsCents / maxSavings) * 100) : 0;

        return (
          <Card key={tier.id} className="relative flex h-full flex-col overflow-hidden border-border/60">
            <div
              className={`absolute inset-x-0 top-0 h-[3px] ${isBestValue ? "bg-gold" : "bg-transparent"}`}
              aria-hidden
            />
            <CardContent className="flex flex-1 flex-col gap-4 pt-5">
              <div>
                {showGradYear && (
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {tier.gradeLabel} &middot; Class of {gradYear}
                  </span>
                )}
                <h2 className="mt-1 font-heading text-xl font-bold">{tier.name}</h2>
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`font-heading font-bold tabular-nums tracking-tight ${
                    isBestValue ? "text-4xl text-gold" : "text-3xl"
                  }`}
                >
                  {formatCents(totalCents)}
                </span>
                <p className="text-xs text-muted-foreground">
                  {formatCents(annualRateCents)}/yr &middot; {tier.years} year
                  {tier.years === 1 ? "" : "s"} covered
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${meterPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {savingsCents > 0 ? `vs. ${formatCents(fullCents)} full rate` : "Full rate"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {savingsCents > 0 ? `Save ${formatCents(savingsCents)}` : "—"}
                  </span>
                </div>
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
        );
      })}
    </div>
  );
}
