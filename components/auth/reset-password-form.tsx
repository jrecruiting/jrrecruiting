"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type ResetPasswordState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ResetPasswordState = { status: "idle" };

export function ResetPasswordForm({ token }: { token: string | null }) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-sm border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p role="alert" className="text-sm text-destructive">
              This reset link is missing its token. Please request a new one from
              the{" "}
              <Link href="/forgot-password" className="font-medium underline">
                reset password page
              </Link>
              .
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="token" value={token} />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              {state.status === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {state.message}
                </p>
              )}
              <Button type="submit" disabled={isPending} className="mt-2">
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
