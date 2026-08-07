import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UL, LI } from "@/components/marketing/blog-prose";
import type { Icon } from "@phosphor-icons/react";
import {
  UserPlus,
  ShieldCheck,
  MagnifyingGlass,
  Star,
  Globe,
  Handshake,
  ChatsCircle,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Javier builds your athlete's profile, distributes it directly to college coaches, and personally follows up until you get results — for football and every other sport we work with.",
};

type Step = {
  icon: Icon;
  title: string;
  description: string;
  bullets?: string[];
  closing?: string;
};

const recruitingSteps: Step[] = [
  {
    icon: UserPlus,
    title: "Building a Complete Player Profile",
    description:
      "The first step is building your athlete's recruiting profile, which is the tool college coaches actually use to evaluate them. This includes:",
    bullets: [
      "Game stats and season highlights",
      "Highlight and full-game film",
      "Academic record (GPA, test scores)",
      "Measurables (height, weight, and the key numbers for your sport — 40-yard dash, exit velocity, event times, and more)",
      "Contact information and references",
    ],
    closing: "This profile becomes the foundation for everything that follows.",
  },
  {
    icon: Globe,
    title: "National Distribution",
    description:
      "Once the profile is complete, it's put directly in front of coaches. For football, that means our established Prospect List — sent to coaches at over 700 college programs across FBS, FCS, D2, D3, and NAIA, with weekly updates so your athlete stays visible on an ongoing basis, not just after one initial send. For other sports, I build that same kind of direct distribution to the programs and coaches relevant to your athlete, using the same hands-on approach.",
  },
  {
    icon: Handshake,
    title: "Personal, One-on-One Coach Outreach",
    description:
      "This is where I spend most of my time, and it's what sets this service apart from a mass mailing list. Beyond the initial distribution, I reach out to coaches individually, walk them through your athlete's profile personally, and follow up directly for feedback after they evaluate it. That personal contact matters because it's the difference between a profile sitting in an inbox and a coach actually taking a close look.",
  },
  {
    icon: ChatsCircle,
    title: "Keeping You in the Loop",
    description:
      "Recruiting only works when everyone — you, me, and the coaches — is communicating. Every two weeks, I'll share whatever feedback I've gathered from coaches directly with you, so we're always on the same page about where things stand with each school and what the right next move is.",
  },
  {
    icon: MagnifyingGlass,
    title: "A Searchable Online Profile",
    description:
      "In addition to direct outreach, your athlete's profile and highlights are also posted on my website, where coaches can search for and review prospects on their own time, giving your athlete a presence that works even outside of active outreach.",
  },
];

const coachSteps: Step[] = [
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

function StepList({ steps }: { steps: Step[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.title} className="flex gap-4 sm:gap-5">
            <div className="flex flex-col items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold font-heading text-sm font-bold text-gold">
                {i + 1}
              </span>
              {!isLast && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
            </div>
            <div className={`flex flex-col gap-2.5 ${isLast ? "" : "pb-10"}`}>
              <div className="flex items-center gap-2">
                <step.icon className="h-5 w-5 text-gold" weight="duotone" aria-hidden />
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.bullets && (
                <UL>
                  {step.bullets.map((bullet) => (
                    <LI key={bullet}>{bullet}</LI>
                  ))}
                </UL>
              )}
              {step.closing && <p className="text-sm text-muted-foreground">{step.closing}</p>}
            </div>
          </div>
        );
      })}
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
          How I Help Your Athlete Get Recruited
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          With 18 years of experience that started in football recruiting, I&apos;ve
          helped over 100 athletes across football and other sports earn scholarship
          offers from programs across the country. Here&apos;s exactly how the process
          works, whatever sport your athlete plays.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <StepList steps={recruitingSteps} />

        <div className="mt-14 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            The Track Record
          </h2>
          <p className="text-muted-foreground">
            A lot of this work happens behind the scenes: the calls, the follow-ups, and
            the small conversations that move recruitment forward. I&apos;m proud of it, and
            I&apos;m honored to have helped so many families navigate this process,
            resulting in real offers from real programs.
          </p>

          <div className="flex gap-5">
            <span className="w-[3px] shrink-0 rounded-full bg-gold" aria-hidden />
            <div className="flex flex-col gap-3">
              <blockquote className="text-balance font-heading text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                &ldquo;We were skeptical of recruiting services, but Javier&apos;s
                transparency turned zero offers into twelve, and a scholarship to Rocky
                Mountain College.&rdquo;
              </blockquote>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Parent from 2025 Class
              </p>
            </div>
          </div>

          <p className="text-muted-foreground">
            You can read more stories like this from the families I&apos;ve worked with
            on the{" "}
            <Link href="/testimonials" className="font-semibold text-gold hover:underline">
              testimonials page
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            If you have any questions about the process or want to talk about your
            athlete specifically, I&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              For Coaches
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Recruiting through J.R. Recruiting
            </h2>
            <p className="mt-3 text-muted-foreground">
              Looking to fill out your roster? Here&apos;s how coaches use the platform.
            </p>
          </div>
          <StepList steps={coachSteps} />
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
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
