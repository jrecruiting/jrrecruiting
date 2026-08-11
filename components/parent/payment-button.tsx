"use client";

import { useActionState } from "react";
import { createListingCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";

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
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <LockSimple className="h-3 w-3" aria-hidden />
        Secure checkout via Stripe &mdash; we never see or store your card details.
      </p>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
