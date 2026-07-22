"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentButton } from "@/components/parent/payment-button";
import { PaymentPlanOptions } from "@/components/parent/payment-plan-options";
import { isValidPromoCode, formatCents, PROMO_ONE_TIME_CENTS, type PackageTier } from "@/lib/pricing";

export function PaymentOptions({
  playerId,
  tier,
  priceLabel,
}: {
  playerId: string;
  tier: PackageTier;
  priceLabel: string;
}) {
  const [mode, setMode] = useState<"full" | "monthly">("full");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  function handleApplyPromo() {
    if (isValidPromoCode(promoInput, tier)) {
      setAppliedPromo(promoInput.trim());
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("That code isn't valid for this athlete's package.");
    }
  }

  const displayPriceLabel = appliedPromo ? formatCents(PROMO_ONE_TIME_CENTS) : priceLabel;

  return (
    <div className="flex flex-col gap-4">
      {tier.id === "senior" && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-3">
          <label htmlFor="promoCode" className="text-sm font-medium">
            Have a promo code?
          </label>
          <div className="flex gap-2">
            <Input
              id="promoCode"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter code"
              className="max-w-[180px]"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo}>
              Apply
            </Button>
          </div>
          {appliedPromo && (
            <p className="text-sm text-gold">Promo applied &mdash; your price has been updated below.</p>
          )}
          {promoError && (
            <p role="alert" className="text-sm text-destructive">
              {promoError}
            </p>
          )}
        </div>
      )}

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

      {mode === "full" ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Listing fee &mdash; {tier.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">One-time athlete profile listing</span>
              <span className="font-heading text-2xl font-bold">{displayPriceLabel}</span>
            </div>
            <PaymentButton
              playerId={playerId}
              priceLabel={displayPriceLabel}
              promoCode={appliedPromo ?? undefined}
            />
          </CardContent>
        </Card>
      ) : (
        <PaymentPlanOptions playerId={playerId} tier={tier} promoCode={appliedPromo ?? undefined} />
      )}
    </div>
  );
}
