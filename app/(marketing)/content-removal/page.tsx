import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Content Removal",
  description: "How to request removal of an athlete profile, photo, or other content from J.R. Recruiting.",
};

export default function ContentRemovalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Support
        </span>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Content Removal
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          If you&apos;d like a profile, photo, video link, or other content
          taken down from J.R. Recruiting, here&apos;s how.
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/90">
        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Who can request removal</h2>
          <ul className="list-disc pl-5">
            <li>The parent or legal guardian of the athlete on a profile</li>
            <li>The athlete themselves, once they&apos;re 18 or older</li>
            <li>A verified college coach, for content submitted about their own program or organization</li>
            <li>Anyone who believes content violates their rights (e.g. a photo used without permission)</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">How to request it</h2>
          <p>
            The fastest way is to sign into your parent dashboard and edit or
            delete the profile, photo, or video link directly. If you can&apos;t
            access your account, or the content in question isn&apos;t
            something you can edit yourself, send us a removal request
            through the button below or by emailing{" "}
            <a href="mailto:j.r.recruiting13@gmail.com" className="text-gold hover:underline">
              j.r.recruiting13@gmail.com
            </a>
            .
          </p>
          <p>Please include:</p>
          <ul className="list-disc pl-5">
            <li>The athlete&apos;s name and, if known, the profile URL</li>
            <li>What you&apos;d like removed (the full profile, a specific photo, a video link, etc.)</li>
            <li>Your relationship to the athlete</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">What happens next</h2>
          <p>
            We review every request and typically remove valid requests
            within 2 business days. We may reach out if we need to verify
            your relationship to the athlete before removing content, to
            protect against bad-faith removal requests.
          </p>
        </section>

        <Button
          size="lg"
          className="mt-2 w-fit bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/contact">Request a Removal</Link>}
        />
      </div>
    </div>
  );
}
