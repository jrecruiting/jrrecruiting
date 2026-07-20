import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using J.R. Recruiting.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Legal
        </span>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/90">
        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">1. Acceptance of terms</h2>
          <p>
            By creating an account or using J.R. Recruiting (the &quot;Service&quot;),
            you agree to these Terms of Service. If you do not agree, please
            do not use the Service.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">2. Description of the Service</h2>
          <p>
            J.R. Recruiting is a platform that lets parents and administrators
            create searchable athlete recruiting profiles, and lets verified
            college coaches search and view those profiles. We do not
            guarantee that any profile will result in recruitment, a
            scholarship offer, or contact from a coach.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">3. Accounts and eligibility</h2>
          <p>
            Parent and admin accounts create and manage athlete profiles on
            behalf of the athlete. By submitting a profile for a minor, you
            confirm that you are that athlete&apos;s parent or legal guardian,
            or are otherwise authorized to act on their behalf, and that the
            information and media you submit is accurate and that you have
            the right to publish it.
          </p>
          <p>
            Coach accounts are subject to manual verification before full
            profile details are unlocked. We may reject or revoke coach
            access at our discretion.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">4. Payment and listing fees</h2>
          <p>
            Listing an athlete profile requires payment of the applicable
            one-time fee or payment plan shown at checkout. Payments are
            processed securely by Stripe; we do not store your full card
            details. Fees are generally non-refundable once a profile is
            published, except where required by law or at our discretion. If
            you believe there is a mistake on the fee that was charged,
            please let us know and we will look into it to determine the
            possibility of a refund.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">5. Your content</h2>
          <p>
            You retain ownership of the photos, video links, stats, and other
            content you submit (&quot;Your Content&quot;). By submitting Your
            Content, you grant us a license to display it on the Service to
            verified coaches for the purpose of recruiting. You&apos;re
            responsible for making sure Your Content doesn&apos;t violate
            anyone else&apos;s rights. See our Content Removal page if you
            need something taken down.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">6. Prohibited conduct</h2>
          <ul className="list-disc pl-5">
            <li>Submitting false or misleading athlete information</li>
            <li>Impersonating another person or organization</li>
            <li>Attempting to access profiles or accounts you&apos;re not authorized to view</li>
            <li>Using the Service to harass, contact, or solicit minors outside its intended recruiting purpose</li>
            <li>Scraping, reselling, or redistributing profile data</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">7. Termination</h2>
          <p>
            We may suspend or terminate access to the Service for any account
            that violates these terms. You may stop using the Service at any
            time.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">8. Disclaimer and limitation of liability</h2>
          <p>
            The Service is provided &quot;as is.&quot; We make no guarantees
            about recruiting outcomes, coach responses, or scholarship
            opportunities. To the fullest extent permitted by law, J.R.
            Recruiting is not liable for indirect or consequential damages
            arising from use of the Service.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">9. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            Service after changes take effect means you accept the updated
            terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">10. Contact</h2>
          <p>
            Questions about these terms? Reach us at{" "}
            <a href="mailto:j.r.recruiting13@gmail.com" className="text-gold hover:underline">
              j.r.recruiting13@gmail.com
            </a>{" "}
            or through our{" "}
            <a href="/contact" className="text-gold hover:underline">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
