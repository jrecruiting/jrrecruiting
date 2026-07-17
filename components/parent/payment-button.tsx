"use client";

import { useActionState } from "react";
import { createListingCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { LISTING_FEE_LABEL } from "@/lib/stripe";

export function PaymentButton({ playerId }: { playerId: string }) {
  const boundAction = createListingCheckoutSession.bind(null, playerId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Button
        type="submit"
        disabled={isPending}
        className="bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Redirecting to checkout..." : `Pay ${LISTING_FEE_LABEL} & Publish`}
      </Button>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
