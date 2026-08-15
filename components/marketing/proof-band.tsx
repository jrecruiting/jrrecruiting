"use client";

import { motion } from "motion/react";
import { SCHOOLS_SIGNED } from "@/lib/schools-signed";

// Years and athletes placed are manually-tracked facts (update here as they
// change); schools signed is computed live from the same list that powers
// the coach sign-up page, so it never needs separate upkeep.
const STATS = [
  { value: "18", label: "Years of hands-on recruiting, one relationship at a time" },
  { value: "100+", label: "Athletes placed in college programs across every division", accent: true },
  { value: String(SCHOOLS_SIGNED.length), label: "Schools our athletes have signed with, and counting" },
];

export function ProofBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-border/60 px-6 py-12 sm:px-10 sm:py-14"
        style={{
          background:
            "radial-gradient(70% 100% at 15% 0%, color-mix(in oklch, var(--gold), transparent 90%), transparent 60%), linear-gradient(160deg, var(--card) 0%, var(--secondary) 100%)",
        }}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          The track record
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`font-heading text-5xl font-extrabold tabular-nums tracking-tight sm:text-6xl ${
                  stat.accent ? "text-gold" : "text-foreground"
                }`}
              >
                {stat.value}
              </span>
              <p className="max-w-[14rem] text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
