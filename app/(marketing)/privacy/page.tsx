import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How J.R. Recruiting collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Legal
        </span>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/90">
        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">1. Information we collect</h2>
          <p>We collect information you and your family provide directly:</p>
          <ul className="list-disc pl-5">
            <li>Parent/guardian account info: name, email, password (stored as a secure hash, never in plain text)</li>
            <li>Athlete profile info: name, date of birth, gender, location, grad year, sport, position, stats, GPA, photos, and highlight video links</li>
            <li>Coach account info: name, email, organization, title, phone number</li>
            <li>Payment information, processed directly by Stripe &mdash; we never see or store your full card number</li>
          </ul>
          <p>We also automatically collect basic usage data, like when a coach views a profile, to power in-app notifications.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">2. How we use it</h2>
          <ul className="list-disc pl-5">
            <li>To display athlete profiles to verified college coaches through search and filtering</li>
            <li>To notify parents when a coach views or stars their athlete&apos;s profile</li>
            <li>To notify coaches when a starred athlete&apos;s profile updates, if they&apos;ve opted in</li>
            <li>To process payments and send receipts</li>
            <li>To operate account sign-in, password resets, and customer support</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">3. Who can see athlete profiles</h2>
          <p>
            Full athlete profile details are only visible to coach accounts
            that have been manually reviewed and approved by our team.
            Unverified coach accounts see limited, non-identifying
            information only. We do not publish athlete profiles publicly on
            the open internet, and we do not sell athlete or family data to
            third parties.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">4. Children&apos;s information</h2>
          <p>
            J.R. Recruiting is intended for use by parents/guardians and
            college coaches &mdash; athletes do not create their own accounts
            or submit their own data. All athlete information is entered by
            a parent, guardian, or our admin team on the family&apos;s
            behalf. If you believe a minor&apos;s information was submitted
            without appropriate parental consent, contact us immediately
            using the details below and we will investigate and remove it.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">5. Third-party services we use</h2>
          <ul className="list-disc pl-5">
            <li><strong className="text-foreground">Stripe</strong> &mdash; payment processing</li>
            <li><strong className="text-foreground">Resend</strong> &mdash; transactional email delivery</li>
            <li><strong className="text-foreground">Vercel</strong> &mdash; application hosting</li>
          </ul>
          <p>Each of these providers only receives the information necessary to perform their function.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">6. Data retention and deletion</h2>
          <p>
            We retain account and profile data for as long as your account is
            active. You can request deletion of an athlete profile, a photo,
            or an entire account at any time &mdash; see our{" "}
            <a href="/content-removal" className="text-gold hover:underline">
              Content Removal
            </a>{" "}
            page for how.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">7. Your rights</h2>
          <p>
            You can access, correct, or request deletion of your family&apos;s
            information at any time by signing into your dashboard or
            contacting us directly.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We&apos;ll update the
            &quot;Last updated&quot; date above when we do.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">9. Contact</h2>
          <p>
            Questions about this policy or your data? Reach us at{" "}
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
