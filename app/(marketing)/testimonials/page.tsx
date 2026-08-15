import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { allTestimonials } from "@/lib/testimonials-data";
import { TestimonialsContent } from "@/components/marketing/testimonials-content";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from the parents, athletes, and coaches J.R. Recruiting has helped get in front of college programs.",
};

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
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

      <TestimonialsContent />

      <Reveal className="mx-auto mt-16 flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </Reveal>
    </div>
  );
}
