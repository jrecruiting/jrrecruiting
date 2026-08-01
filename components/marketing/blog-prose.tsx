import type { ReactNode } from "react";

// Hand-styled building blocks for long-form blog content, kept consistent
// with the rest of the marketing site's typography instead of pulling in
// @tailwindcss/typography for a handful of articles.

export function P({ children }: { children: ReactNode }) {
  return <p className="text-balance leading-relaxed text-foreground/90">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 font-heading text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-2 pl-1 text-foreground/90">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gold/30 bg-gold/5 px-5 py-4 text-foreground/90">
      {children}
    </div>
  );
}
