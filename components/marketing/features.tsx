"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Built for recruiting
        </span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything recruiting needs, in one place
        </h2>
        <p className="mt-3 text-muted-foreground">
          From searchable profiles to real-time notifications, J.R. Recruiting
          keeps parents, players, and coaches connected.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
          >
            <Card className="h-full border-border/60 bg-card/60">
              <CardContent className="flex h-full flex-col gap-3 pt-2">
                <feature.icon
                  className="h-8 w-8 text-gold"
                  weight="duotone"
                  aria-hidden
                />
                <h3 className="font-heading text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
