"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resendVerificationEmail, type ResendVerificationState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ResendVerificationState = { status: "idle" };

const COPY: Record<string, { title: string; body: string }> = {
  sent: {
    title: "Check your email",
    body: "We sent a confirmation link to your email address. Click it to finish creating your account. It can take a few minutes to arrive, and it may land in your spam or junk folder.",
  },
  pending: {
    title: "Confirm your email to sign in",
    body: "Your account is almost ready, but you haven't confirmed your email address yet. Use the link we emailed you, or request a new one below.",
  },
  confirmed: {
    title: "Email confirmed",
    body: "Thanks for confirming. Our team reviews every coach account before it unlocks full player profiles, and we'll email you once you're approved. You can sign in now.",
  },
  already: {
    title: "Already confirmed",
    body: "This email address has already been confirmed. You can sign in.",
  },
  expired: {
    title: "That link has expired",
    body: "Confirmation links are only good for 7 days. Enter your email below and we'll send you a fresh one.",
  },
  invalid: {
    title: "That link isn't valid",
    body: "The link may be incomplete, or a newer one may have replaced it. Enter your email below and we'll send you a fresh one.",
  },
};

export function VerifyEmailPanel({ status, email }: { status: string; email: string }) {
  const [state, formAction, isPending] = useActionState(resendVerificationEmail, initialState);
  const copy = COPY[status] ?? COPY.invalid;
  const done = status === "confirmed" || status === "already";

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-sm border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{copy.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{copy.body}</p>

          {done ? (
            <Button nativeButton={false} render={<Link href="/sign-in" />}>
              Sign In
            </Button>
          ) : state.status === "sent" ? (
            <p role="status" className="text-sm text-muted-foreground">
              {state.message}
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              {email ? (
                <>
                  <input type="hidden" name="email" value={email} />
                  <p className="text-sm">
                    Sent to <strong>{email}</strong>
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
              )}
              {state.status === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {state.message}
                </p>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending..." : email ? "Resend Email" : "Send New Link"}
              </Button>
            </form>
          )}

          {!done && (
            <p className="text-center text-sm text-muted-foreground">
              Already confirmed?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
