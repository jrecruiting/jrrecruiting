import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";
import { AboutSection } from "@/components/marketing/about-section";
import { Faq } from "@/components/marketing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <AboutSection />
      <Faq />

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/60 px-6 py-12 text-center sm:px-12">
            <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to get your athlete in front of college coaches?
            </h2>
            <Button
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/sign-up">Get Started Now</Link>}
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "One-time fee, no subscription",
                "Manually reviewed coaches only",
                "Real-time profile-view alerts",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
