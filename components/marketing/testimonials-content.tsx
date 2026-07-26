"use client";

import { motion } from "motion/react";
import { allTestimonials } from "@/lib/testimonials-data";

export function TestimonialsContent() {
  const featured = allTestimonials.filter((t) => t.featured);
  const rest = allTestimonials.filter((t) => !t.featured);

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:gap-14">
        {featured.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="flex gap-5"
          >
            <span className="w-[3px] shrink-0 rounded-full bg-gold" aria-hidden />
            <div className="flex flex-col gap-4">
              <blockquote className="text-balance font-heading text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-xs font-semibold tracking-wide text-muted-foreground">
                <span className="text-foreground">{t.name}</span>
                {t.detail ? ` · ${t.detail}` : ""}
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-5xl text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        More stories
      </div>

      <div className="mx-auto mt-6 max-w-5xl columns-1 gap-4 sm:columns-2 lg:columns-3">
        {rest.map((t, i) => (
          <motion.figure
            key={`${t.name}-${t.detail ?? ""}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05, ease: "easeOut" }}
            className="mb-4 flex break-inside-avoid flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-5"
          >
            <blockquote className="line-clamp-6 text-sm leading-relaxed text-foreground/90">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.name}
              {t.detail ? ` · ${t.detail}` : ""}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </>
  );
}
