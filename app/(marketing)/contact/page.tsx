import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { EnvelopeSimple, Clock } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with J.R. Recruiting for questions about listing an athlete, coach access, or anything else.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Contact
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Questions about listing your athlete, coach access, or anything
          else &mdash; send us a message and we&apos;ll get back to you.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <EnvelopeSimple className="mt-0.5 h-5 w-5 shrink-0 text-gold" weight="duotone" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <a
                href="mailto:j.r.recruiting13@gmail.com"
                className="text-sm text-muted-foreground hover:text-gold"
              >
                j.r.recruiting13@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" weight="duotone" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Response time</p>
              <p className="text-sm text-muted-foreground">
                We typically reply within 1&ndash;2 business days.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
