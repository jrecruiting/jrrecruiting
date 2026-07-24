"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { OfferFormState } from "@/actions/offers";
import { X } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

type OfferItem = {
  id: string;
  schoolName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
};

function RemoveOfferButton({
  offerId,
  schoolName,
  removeAction,
}: {
  offerId: string;
  schoolName: string;
  removeAction: (offerId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await removeAction(offerId);
      toast.success(`${schoolName} offer removed.`);
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleRemove}
      aria-label={`Remove offer from ${schoolName}`}
    >
      <X className="h-4 w-4" aria-hidden />
    </Button>
  );
}

export function OffersManager({
  offers,
  addAction,
  removeAction,
  showStatus = false,
}: {
  offers: OfferItem[];
  addAction: (state: OfferFormState, formData: FormData) => Promise<OfferFormState>;
  removeAction: (offerId: string) => Promise<void>;
  // Admin sees PENDING/REJECTED offers too (needs to review them); parents
  // only ever see offers they submitted, so the status still matters to
  // them (e.g. "pending review"), just shown the same way either side.
  showStatus?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(addAction, undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label>Offers</Label>

      {offers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{offer.schoolName}</span>
                {showStatus && (
                  <Badge variant={statusVariant[offer.status]}>{offer.status}</Badge>
                )}
              </div>
              <RemoveOfferButton
                offerId={offer.id}
                schoolName={offer.schoolName}
                removeAction={removeAction}
              />
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="schoolName" className="sr-only">
            School name
          </Label>
          <Input
            id="schoolName"
            name="schoolName"
            placeholder="e.g. University of Michigan"
            required
          />
        </div>
        <Button type="submit" disabled={isPending} variant="outline" className="border-border/60">
          {isPending ? "Adding..." : "Add Offer"}
        </Button>
      </form>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </div>
  );
}
