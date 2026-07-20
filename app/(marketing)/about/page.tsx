import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Users, ShieldCheck, Target } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About",
  description:
    "J.R. Recruiting was built to close the gap between talented student-athletes and the college coaches actively looking for them.",
};

const values = [
  {
    icon: Eye,
    title: "Visibility",
    description:
      "Every athlete deserves a real shot at being seen, not just the ones with the biggest highlight reel following.",
  },
  {
    icon: Target,
    title: "Precision",
    description:
      "Coaches waste hours sifting through irrelevant profiles. Our filters get them to a real fit fast.",
  },
  {
    icon: ShieldCheck,
    title: "Safety",
    description:
      "Every coach account is manually reviewed before they can search, keeping families' information protected.",
  },
  {
    icon: Users,
    title: "Family-first",
    description:
      "Parents manage every profile, stay in the loop on every view, and are never left guessing.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          About Us
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Built by people who know recruiting is more than a highlight reel
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Too many talented athletes get missed simply because the right
          coach never saw the right profile at the right time. We built J.R.
          Recruiting to close that gap &mdash; giving every athlete a
          verified, searchable presence in front of the coaches actively
          looking for them.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-6"
          >
            <value.icon className="h-7 w-7 text-gold" weight="duotone" aria-hidden />
            <h2 className="font-heading text-base font-semibold">{value.title}</h2>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Create a Free Profile</Link>}
        />
      </div>
    </div>
  );
}
