"use client";

import { useEffect, useState } from "react";

// Server Components have no notion of the viewer's timezone, so formatting
// a moment-in-time date server-side (e.g. toLocaleString()) renders it in
// the server's timezone (UTC on Vercel), not the viewer's -- which can even
// show the wrong calendar day near midnight UTC. Starts as null so the
// server-rendered placeholder matches the client's first render, then
// fills in the real local value post-mount, avoiding a hydration mismatch.
//
// Only for moments in time (submitted-at, sent-at, etc.). A deliberately
// UTC-pinned calendar date (e.g. an admin-chosen "event date" with no time
// component) should keep using timeZone: "UTC" server-side instead --
// that's a different, correct choice, not this same bug.
export function LocalDateTime({
  iso,
  dateOnly = false,
}: {
  iso: string;
  dateOnly?: boolean;
}) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date(iso);
    setFormatted(
      dateOnly
        ? date.toLocaleDateString("en-US", { dateStyle: "medium" })
        : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    );
  }, [iso, dateOnly]);

  return <>{formatted ?? "—"}</>;
}
