import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { PHOTO_GRADE_FILTER, PhotoTreatmentOverlay } from "@/components/marketing/photo-treatment";
import { Eye, Users, ShieldCheck, Target } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About",
  description:
    "J.R. Recruiting was built to close the gap between talented student-athletes and the college coaches actively looking for them.",
};

const FOUNDER_PHOTO: { src: string; alt: string } | null = {
  src: "/marketing/hero/IMG_20240815_061657_164.jpg",
  alt: "Javier Rodriguez, founder of J.R. Recruiting",
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
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          About Us
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Built by people who know recruiting is more than a highlight reel
        </h1>
      </div>

      <Reveal className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
          {FOUNDER_PHOTO ? (
            <>
              <Image
                src={FOUNDER_PHOTO.src}
                alt={FOUNDER_PHOTO.alt}
                fill
                className="object-cover"
                style={{ filter: PHOTO_GRADE_FILTER }}
              />
              <PhotoTreatmentOverlay />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 55% 55% at 50% 30%, color-mix(in oklch, var(--gold), transparent 80%), transparent 68%), linear-gradient(175deg, color-mix(in oklch, var(--card), white 6%) 0%, var(--card) 55%, var(--background) 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  background:
                    "repeating-linear-gradient(100deg, transparent 0 18px, color-mix(in oklch, var(--foreground), transparent 97%) 18px 20px)",
                }}
                aria-hidden
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-5">
            <span className="w-[3px] shrink-0 rounded-full bg-gold" aria-hidden />
            <div className="flex flex-col gap-3">
              <blockquote className="text-balance font-heading text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                &ldquo;I was a high school coach for many years and saw first
                hand many talented athletes not having the opportunity to
                play football at a college level. I took it upon myself to
                help them with their recruiting and it turned out that it
                became a passion of mine. I took great pride and have joy
                for the opportunity to help players.&rdquo;
              </blockquote>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                <span className="text-foreground">Javier Rodriguez</span>{" "}
                &middot; Founder, J.R. Recruiting
              </p>
            </div>
          </div>
          <p className="max-w-lg pl-[calc(3px+1.25rem)] text-balance text-muted-foreground">
            What started with football has grown into a platform for
            athletes across every sport, built on that same direct,
            personal approach. Too many talented athletes get missed
            simply because the right coach never saw the right profile at
            the right time. We built J.R. Recruiting to close that gap.
            Every athlete gets a verified, searchable presence
            in front of the coaches actively looking for them.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mb-8 mt-20 flex max-w-2xl flex-col gap-2 sm:mt-24">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          What we stand for
        </span>
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          The values behind every profile we build
        </h2>
      </div>

      <Reveal className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col items-start gap-3 py-6 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
          >
            <value.icon className="h-6 w-6 text-gold" weight="duotone" aria-hidden />
            <h3 className="font-heading text-base font-semibold">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-20 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center sm:mt-24">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </Reveal>
    </div>
  );
}
