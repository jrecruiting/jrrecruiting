"use client";

import { useActionState } from "react";
import { createListingCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";

export function PaymentButton({
  playerId,
  priceLabel,
  promoCode,
}: {
  playerId: string;
  priceLabel: string;
  promoCode?: string;
}) {
  const boundAction = createListingCheckoutSession.bind(null, playerId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {promoCode && <input type="hidden" name="promoCode" value={promoCode} />}
      <Button
        type="submit"
        disabled={isPending}
        className="bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Redirecting to checkout..." : `Pay ${priceLabel} & Publish`}
      </Button>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
