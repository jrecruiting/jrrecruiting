"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentButton } from "@/components/parent/payment-button";
import { PaymentPlanOptions } from "@/components/parent/payment-plan-options";
import type { PackageTier } from "@/lib/pricing";

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

  return (
    <div className="flex flex-col gap-4">
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
              <span className="font-heading text-2xl font-bold">{priceLabel}</span>
            </div>
            <PaymentButton playerId={playerId} priceLabel={priceLabel} />
          </CardContent>
        </Card>
      ) : (
        <PaymentPlanOptions playerId={playerId} tier={tier} />
      )}
    </div>
  );
}
