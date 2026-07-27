"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { signUp } from "@/actions/auth";
import { trackEvent } from "@/lib/analytics";
import { ATHLETE_PHOTOS, type MarketingPhoto } from "@/lib/marketing-photos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function pickRandomPhoto(): MarketingPhoto {
  return ATHLETE_PHOTOS[Math.floor(Math.random() * ATHLETE_PHOTOS.length)];
}

// Picks a new random photo on every mount (fresh page load, or navigating
// back to this page) — starts as null so the server-rendered placeholder
// matches the client's first render, then swaps in a real photo once
// mounted, avoiding a hydration mismatch on the random pick.
function SignUpPanelPhoto() {
  const [photo, setPhoto] = useState<MarketingPhoto | null>(null);

  useEffect(() => {
    setPhoto(pickRandomPhoto());
  }, []);

  if (!photo) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 68% 30%, color-mix(in oklch, var(--gold), transparent 80%), transparent 68%), linear-gradient(200deg, color-mix(in oklch, var(--card), white 6%) 0%, var(--card) 55%, var(--background) 100%)",
        }}
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      className="object-cover"
      style={{ objectPosition: photo.focus ?? "center" }}
      priority
    />
  );
}

const PANEL_COPY = {
  COACH: {
    eyebrow: "For Coaches",
    headline:
      "Search verified, up-to-date player profiles — filtered by sport, state, and grad year.",
    trust: ["Manually reviewed accounts", "Free to browse", "Star & get notified"],
  },
  PARENT: {
    eyebrow: "For Parents",
    headline:
      "Get your athlete a verified, searchable profile in front of the coaches looking for them.",
    trust: [
      "One-time fee, no subscription",
      "Manually reviewed coaches only",
      "Real-time profile-view alerts",
    ],
  },
} as const;

export function SignUpForm({
  initialRole,
  playerAudience = false,
}: {
  initialRole: "PARENT" | "COACH";
  playerAudience?: boolean;
}) {
  const [error, formAction, isPending] = useActionState(signUp, undefined);
  const hasStarted = useRef(false);
  const reduceMotion = useReducedMotion();
  const panel = PANEL_COPY[initialRole];

  function handleFirstInteraction() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent("sign_up_form_started", { role: initialRole });
  }

  function handleSubmit() {
    trackEvent("sign_up_form_submitted", { role: initialRole });
  }

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden border-r border-border/60 lg:flex lg:flex-col lg:justify-end lg:p-12">
        <SignUpPanelPhoto />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex max-w-md flex-col gap-4"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {panel.eyebrow}
          </span>
          <h1 className="text-balance font-heading text-2xl font-bold leading-tight sm:text-3xl">
            {panel.headline}
          </h1>
          <div className="flex flex-wrap gap-2">
            {panel.trust.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium text-foreground/90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center bg-secondary/20 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                {initialRole === "COACH"
                  ? "Create Your Coach Account"
                  : playerAudience
                    ? "Create Your Parent/Player Account"
                    : "Create Your Parent Account"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={formAction}
                onSubmit={handleSubmit}
                onFocus={handleFirstInteraction}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="role" value={initialRole} />

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

                {initialRole === "COACH" && (
                  <>
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
        </motion.div>
      </div>
    </div>
  );
}
