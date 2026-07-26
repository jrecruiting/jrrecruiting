"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Javier gave me the chance to showcase my talent nationwide. I'll always be grateful—he helped land me at Penn State University.",
    attribution: "2019 Transfer Player",
  },
  {
    quote:
      "One of my players was told he'd never play college ball. J.R. Recruiting found him a Division 1 school that wanted him.",
    attribution: "High School Football Coach",
  },
  {
    quote:
      "We were skeptical of recruiting services, but Javier's transparency turned zero offers into twelve—and a scholarship to Rocky Mountain College.",
    attribution: "Parent from 2025 Class",
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
              <div className="flex items-center gap-3">
                {/* Placeholder avatar — swap for a real, cleared photo per testimonial */}
                <div
                  aria-hidden
                  className="h-11 w-11 shrink-0 rounded-full border border-border/60"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--gold), transparent 45%), transparent 60%), linear-gradient(160deg, color-mix(in oklch, var(--card), white 6%), var(--card))",
                  }}
                />
                <span className="h-0.5 w-6 bg-gold" aria-hidden />
              </div>
              <blockquote className="text-balance text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.attribution}
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="border-foreground/20 bg-transparent hover:bg-foreground/5"
            nativeButton={false}
            render={<Link href="/testimonials">Read More Testimonials</Link>}
          />
        </div>
      </div>
    </section>
  );
}
