import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { allTestimonials } from "@/lib/testimonials-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from the parents, athletes, and coaches J.R. Recruiting has helped get in front of college programs.",
};

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Testimonials
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          What families and coaches are saying
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          {allTestimonials.length} real stories from parents, athletes, and
          coaches J.R. Recruiting has worked with over the years.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {allTestimonials.map((t) => (
          <figure
            key={`${t.name}-${t.detail ?? ""}`}
            className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/60 p-6"
          >
            <Quotes className="h-6 w-6 shrink-0 text-gold" weight="fill" aria-hidden />
            <blockquote className="text-balance text-sm leading-relaxed text-foreground/90">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.name}
              {t.detail ? ` · ${t.detail}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </div>
    </div>
  );
}
