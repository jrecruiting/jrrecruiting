"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// A simple mount-triggered fade/slide-up, distinct from the marketing
// site's Reveal (which uses whileInView for scroll-triggered sections) --
// this page is short and mostly above the fold, so entrance should happen
// on mount, matching how the coach home dashboard's announcement card and
// activity feed already animate in.
export function MountReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
