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
import { ATHLETE_PHOTOS } from "@/lib/marketing-photos";

// With 0 photos the panel falls back to an abstract placeholder; with 2+ it
// crossfades between them every 6s.
const HERO_PHOTOS = ATHLETE_PHOTOS;

const ROTATION_INTERVAL_MS = 6000;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function HeroPhoto({ reduceMotion }: { reduceMotion: boolean | null }) {
  // Starts unshuffled so the first paint matches the server-rendered HTML
  // (avoids a hydration mismatch); everything after the first photo gets
  // shuffled client-side once mounted, then reshuffled at the end of each
  // full cycle so the order isn't the same every lap.
  const [order, setOrder] = useState(HERO_PHOTOS);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setOrder((current) => [current[0], ...shuffle(current.slice(1))]);
  }, []);

  useEffect(() => {
    if (reduceMotion || HERO_PHOTOS.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= HERO_PHOTOS.length) {
          setOrder(shuffle(HERO_PHOTOS));
          return 0;
        }
        return next;
      });
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

  const photo = order[index];

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
          style={{
            objectPosition: photo.focus ?? "center",
            filter: "grayscale(38%) saturate(0.82) contrast(1.1) brightness(0.86)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// Unifies photos of wildly varying quality (phone snapshots, different
// lighting, different seasons) into one visual signature: a gold/navy grade
// tying every photo to the brand palette, a vignette, fine grain to mask
// compression/phone-camera softness, and a bottom fade so the panel bleeds
// into the page instead of sitting in a hard-edged box.
function HeroPhotoTreatment() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 15%, color-mix(in oklch, var(--gold), transparent 84%), transparent 55%), linear-gradient(165deg, color-mix(in oklch, var(--gold), transparent 70%) 0%, color-mix(in oklch, var(--background), transparent 90%) 45%, color-mix(in oklch, var(--background), transparent 45%) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--gold), transparent 90%) 0%, transparent 30%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 6rem 1.5rem color-mix(in oklch, var(--background), transparent 15%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 100%)" }}
      />
    </div>
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
            J.R. Recruiting gets your athlete in front of college coaches through
            direct, personal outreach built on 18 years of real coach
            relationships, plus a verified, searchable profile coaches can
            find by state, country, and sport.
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
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
            <HeroPhoto reduceMotion={reduceMotion} />
            {HERO_PHOTOS.length > 0 && <HeroPhotoTreatment />}
          </div>
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            These are pictures of our current and past athletes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
