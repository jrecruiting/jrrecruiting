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
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
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
      </section>
    </>
  );
}
