import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  ShieldCheck,
  MagnifyingGlass,
  Star,
  Bell,
  CreditCard,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how J.R. Recruiting connects parents and coaches: build a verified player profile, get discovered through searchable filters, and stay notified every step of the way.",
};

const parentSteps = [
  {
    icon: UserPlus,
    title: "Create a profile",
    description:
      "Add your athlete's stats, measurables, bio, and highlight video. Manage multiple kids from one account.",
  },
  {
    icon: CreditCard,
    title: "Publish your listing",
    description:
      "Choose a package that fits your grad year and budget, pay the one-time listing fee, and your profile goes live.",
  },
  {
    icon: Bell,
    title: "Get notified",
    description:
      "See exactly when a verified coach views your athlete's profile, right from your dashboard.",
  },
];

const coachSteps = [
  {
    icon: ShieldCheck,
    title: "Get verified",
    description:
      "Sign up and our team reviews your account. You can browse right away with limited info while verification is pending.",
  },
  {
    icon: MagnifyingGlass,
    title: "Search & filter",
    description:
      "Filter by sport, position, gender, grad year, player type, country, and state to find the athletes you need.",
  },
  {
    icon: Star,
    title: "Star & follow",
    description:
      "Star players you're interested in and opt into email alerts so you never miss a profile update.",
  },
];

function StepList({
  title,
  steps,
}: {
  title: string;
  steps: typeof parentSteps;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <Card key={step.title} className="border-border/60 bg-card/60">
            <CardContent className="flex items-start gap-4 pt-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 font-heading text-sm font-bold text-gold">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-gold" weight="duotone" aria-hidden />
                  <h3 className="font-heading text-base font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          How It Works
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Built for both sides of recruiting
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Whether you&apos;re a parent building a profile or a coach
          searching for talent, here&apos;s exactly how J.R. Recruiting
          works.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <StepList title="For Parents" steps={parentSteps} />
        <StepList title="For Coaches" steps={coachSteps} />
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get started?
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            nativeButton={false}
            render={<Link href="/sign-up">List Your Athlete</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 bg-transparent hover:bg-foreground/5"
            nativeButton={false}
            render={<Link href="/sign-up?role=coach">I&apos;m a Coach</Link>}
          />
        </div>
      </div>
    </div>
  );
}
