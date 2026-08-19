"use client";

import { useActionState } from "react";
import { createCoachAdmin, type CoachFormState } from "@/actions/coaches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CoachFormState = undefined;

export function AddCoachForm() {
  const [state, formAction, isPending] = useActionState(createCoachAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="organization">College / organization</Label>
        <Input id="organization" name="organization" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" name="title" placeholder="Recruiting Coordinator" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <p className="text-xs text-muted-foreground">
        This account is created pre-approved with full search access. We&apos;ll email them a
        link to set their own password.
      </p>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit bg-gold text-gold-foreground hover:bg-gold/90">
        {isPending ? "Creating account..." : "Create Coach Account"}
      </Button>
    </form>
  );
}
