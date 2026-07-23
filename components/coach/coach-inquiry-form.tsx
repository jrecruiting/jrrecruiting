"use client";

import { useActionState } from "react";
import { submitCoachInquiry, type CoachInquiryFormState } from "@/actions/coach-inquiries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: CoachInquiryFormState = { status: "idle" };

export function CoachInquiryForm() {
  const [state, formAction, isPending] = useActionState(submitCoachInquiry, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl border border-border/60 bg-card/60 p-8 text-center">
        <h2 className="font-heading text-xl font-semibold">Message sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out &mdash; we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} minLength={10} required />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 w-fit bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
