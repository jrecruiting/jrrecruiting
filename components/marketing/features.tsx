"use client";

import { motion } from "motion/react";
import {
  MagnifyingGlass,
  Star,
  ShieldCheck,
  Bell,
} from "@phosphor-icons/react";

const features = [
  {
    icon: MagnifyingGlass,
    title: "Powerful search",
    description:
      "Coaches filter by state, country, sport, gender, position, and grad year to find the right fit fast.",
  },
  {
    icon: Star,
    title: "Star & follow",
    description:
      "Coaches star players they're interested in and get notified the moment a profile updates.",
  },
  {
    icon: ShieldCheck,
    title: "Verified coaches",
    description:
      "Every coach account is reviewed before they can search, keeping player profiles safe.",
  },
  {
    icon: Bell,
    title: "Stay in the loop",
    description:
      "Parents see exactly when a college coach views their child's profile, in real time.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto mb-14 flex max-w-xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Built for recruiting
        </span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything recruiting needs, in one place
        </h2>
        <p className="text-muted-foreground">
          From searchable profiles to real-time notifications, J.R. Recruiting
          keeps parents, players, and coaches connected.
        </p>
      </div>
      <div className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
            className="flex flex-col items-start gap-3 py-6 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
          >
            <feature.icon
              className="h-6 w-6 text-gold"
              weight="duotone"
              aria-hidden
            />
            <h3 className="font-heading text-base font-semibold">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
