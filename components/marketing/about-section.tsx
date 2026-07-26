"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-5 sm:grid sm:grid-cols-[3px_1fr] sm:gap-8"
      >
        <span className="h-1 w-10 rounded-full bg-gold sm:h-auto sm:w-[3px]" aria-hidden />
        <div className="flex flex-col items-start gap-5 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Why J.R. Recruiting
          </span>
          <h2 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Built by people who know recruiting is more than a highlight reel.
          </h2>
          <p className="max-w-xl text-balance text-muted-foreground">
            Too many talented athletes get missed simply because the right
            coach never saw the right profile at the right time. We built J.R.
            Recruiting to close that gap &mdash; giving every athlete a
            verified, searchable presence in front of the coaches actively
            looking for them.
          </p>
          <Button
            variant="outline"
            className="mt-2 border-foreground/20 bg-transparent hover:bg-foreground/5"
            nativeButton={false}
            render={<Link href="/about">Learn more about us</Link>}
          />
        </div>
      </motion.div>
    </section>
  );
}
