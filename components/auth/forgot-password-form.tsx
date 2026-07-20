"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type ForgotPasswordState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ForgotPasswordState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-sm border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {state.status === "success" ? (
            <p role="status" className="text-sm text-muted-foreground">
              {state.message}
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Enter the email on your account and we&apos;ll send you a link to
                reset your password.
              </p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              {state.status === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {state.message}
                </p>
              )}
              <Button type="submit" disabled={isPending} className="mt-2">
                {isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
