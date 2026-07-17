"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Why J.R. Recruiting
        </span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Built by people who know recruiting is more than a highlight reel
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
      </motion.div>
    </section>
  );
}
