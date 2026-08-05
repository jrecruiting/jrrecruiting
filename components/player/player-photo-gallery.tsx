"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { UserCircle } from "@phosphor-icons/react";

const SIZES = {
  sm: { box: "h-14 w-14", icon: "h-6 w-6" },
  md: { box: "h-20 w-20", icon: "h-8 w-8" },
  lg: { box: "h-32 w-32 sm:h-40 sm:w-40", icon: "h-12 w-12" },
} as const;

const ROTATION_INTERVAL_MS = 5000;

// Same box size/shape as the static PlayerPhoto -- used wherever a coach
// views a player's full profile, so multiple uploaded photos crossfade
// through instead of only ever showing the primary one. Everywhere else
// (search grid, feeds, admin lists) keeps the static single-photo version.
export function PlayerPhotoGallery({
  photos,
  alt,
  size = "lg",
  className,
}: {
  photos: string[];
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const s = SIZES[size];

  useEffect(() => {
    if (reduceMotion || photos.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion, photos.length]);

  // Clamp in case the photo list shrinks (e.g. after an edit) while an
  // index further along was already showing.
  const current = photos[index % Math.max(photos.length, 1)];

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-muted ${s.box} ${className ?? ""}`}
    >
      {current ? (
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={`/api/blob/photo?pathname=${encodeURIComponent(current)}`}
              alt={alt}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <UserCircle className={s.icon} weight="light" aria-hidden />
        </div>
      )}
    </div>
  );
}
