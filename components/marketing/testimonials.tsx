"use client";

import { motion } from "motion/react";
import { Quotes } from "@phosphor-icons/react";

// Placeholder quotes — swap in real parent/coach testimonials before launch.
const testimonials = [
  {
    quote:
      "We had no idea how to get in front of college coaches until we built a profile here. Within weeks she had real interest.",
    attribution: "Parent of a 2027 Softball Recruit",
  },
  {
    quote:
      "Being able to filter by state, position, and grad year saves me hours every week during the recruiting season.",
    attribution: "NCAA D2 Baseball Coach",
  },
  {
    quote:
      "The update notifications are what sold me — I star a player and I actually hear about it when something changes.",
    attribution: "NAIA Soccer Coach",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            See for yourself
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            What parents and coaches are saying
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.attribution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/60 p-6"
            >
              <Quotes className="h-6 w-6 text-gold" weight="fill" aria-hidden />
              <blockquote className="text-balance text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.attribution}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
