"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "@phosphor-icons/react";

// Parent-approved athlete photos for the hero rotation. Add entries here as
// they're cleared for public marketing use; files live in public/marketing/hero/.
// With 0 photos the panel falls back to an abstract placeholder; with 2+ it
// crossfades between them every 6s.
const HERO_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "/marketing/hero/athlete-01.jpg",
    alt: "High school football player on the sideline at dusk",
  },
  {
    src: "/marketing/hero/athlete-02.jpg",
    alt: "High school football lineman seated on the bench",
  },
  {
    src: "/marketing/hero/athlete-03.jpg",
    alt: "High school football quarterback throwing on the field",
  },
  {
    src: "/marketing/hero/athlete-04.jpg",
    alt: "High school football player adjusting his helmet on the sideline",
  },
  {
    src: "/marketing/hero/athlete-05.jpg",
    alt: "High school football player in a team photo, number 15",
  },
  {
    src: "/marketing/hero/athlete-06.jpg",
    alt: "High school football player smiling while stretching before a game",
  },
  {
    src: "/marketing/hero/athlete-07.jpg",
    alt: "High school football player smiling on the field after a game",
  },
  {
    src: "/marketing/hero/athlete-08.jpg",
    alt: "High school football player with a teammate on the field",
  },
  {
    src: "/marketing/hero/athlete-09.jpg",
    alt: "High school football player standing on the field holding his helmet",
  },
  {
    src: "/marketing/hero/athlete-10.jpg",
    alt: "High school football player running onto the field",
  },
  {
    src: "/marketing/hero/athlete-11.jpg",
    alt: "High school football lineman in game action",
  },
  {
    src: "/marketing/hero/athlete-12.jpg",
    alt: "High school football player walking off the field holding his helmet",
  },
  {
    src: "/marketing/hero/athlete-13.jpg",
    alt: "High school football player looking downfield",
  },
  {
    src: "/marketing/hero/athlete-14.jpg",
    alt: "High school football player in a team photo with arms crossed",
  },
];

const ROTATION_INTERVAL_MS = 6000;

function HeroPhoto({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || HERO_PHOTOS.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_PHOTOS.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  if (HERO_PHOTOS.length === 0) {
    return (
      <>
        {/*
          Placeholder for a real athlete action photo (composition: subject
          weighted lower-right, panned-motion feel) — pending parent consent
          for public marketing use.
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 68% 62%, color-mix(in oklch, var(--gold), transparent 78%), transparent 68%), radial-gradient(ellipse 70% 40% at 20% 15%, color-mix(in oklch, var(--foreground), transparent 95%), transparent 60%), linear-gradient(200deg, color-mix(in oklch, var(--card), white 6%) 0%, var(--card) 55%, var(--background) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(100deg, transparent 0 18px, color-mix(in oklch, var(--foreground), transparent 97%) 18px 20px)",
            maskImage: "linear-gradient(200deg, black, transparent 70%)",
          }}
          aria-hidden
        />
      </>
    );
  }

  const photo = HERO_PHOTOS[index];

  return (
    <AnimatePresence>
      <motion.div
        key={photo.src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={index === 0}
          className="object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--gold), transparent 88%), transparent)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-7 text-left"
        >
          <motion.span
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
          >
            Recruiting shouldn&apos;t be a guessing game
          </motion.span>

          <motion.h1
            variants={item}
            className="text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Great athletes get overlooked all the time.{" "}
            <span className="text-gold">We are here to change that now.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-balance text-lg text-muted-foreground"
          >
            J.R. Recruiting puts verified, searchable player profiles directly in
            front of college coaches &mdash; by state, country, and sport &mdash;
            so the right coach finds the right athlete.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/sign-up">List Your Athlete</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5"
              nativeButton={false}
              render={<Link href="/sign-up?role=coach">I&apos;m a Coach</Link>}
            />
          </motion.div>

          <motion.div
            variants={item}
            className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span>Scroll to explore</span>
            <motion.span
              animate={reduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4" aria-hidden />
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: reduceMotion ? 0 : 0.15 }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border/60"
        >
          <HeroPhoto reduceMotion={reduceMotion} />
        </motion.div>
      </div>
    </section>
  );
}
