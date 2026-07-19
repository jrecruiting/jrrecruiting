"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "@phosphor-icons/react";

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
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 py-28 text-center sm:px-6 sm:py-36"
      >
        <motion.span
          variants={item}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          Recruiting shouldn&apos;t be a guessing game
        </motion.span>

        <motion.h1
          variants={item}
          className="text-balance font-heading text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Great athletes get
          <br />
          overlooked all the time. <span className="text-gold">We are here to change that now.</span>
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
          className="mt-10 flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
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
    </section>
  );
}
