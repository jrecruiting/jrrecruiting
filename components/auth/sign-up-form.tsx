"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SignUpForm({
  initialRole,
  lockRole = false,
}: {
  initialRole: "PARENT" | "COACH";
  lockRole?: boolean;
}) {
  const [role, setRole] = useState<"PARENT" | "COACH">(initialRole);
  const [error, formAction, isPending] = useActionState(signUp, undefined);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/20 px-4 py-12">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            {lockRole
              ? role === "COACH"
                ? "Create Your Coach Account"
                : "Create Your Parent Account"
              : "Create Your Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!lockRole && (
            <Tabs value={role} onValueChange={(v) => setRole(v as "PARENT" | "COACH")} className="mb-6">
              <TabsList className="w-full">
                <TabsTrigger value="PARENT" className="flex-1">
                  I&apos;m a Parent
                </TabsTrigger>
                <TabsTrigger value="COACH" className="flex-1">
                  I&apos;m a Coach
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="role" value={role} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
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

            {role === "COACH" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="organization">College / organization</Label>
                  <Input id="organization" name="organization" required={role === "COACH"} />
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
                  Coach accounts are manually reviewed before you can search player
                  profiles. We&apos;ll email you once you&apos;re approved.
                </p>
              </>
            )}

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="mt-2 bg-gold text-gold-foreground hover:bg-gold/90">
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
