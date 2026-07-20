import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

const columns = [
  {
    title: "Website",
    links: [
      { href: "/", label: "Home" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-up", label: "List Your Athlete" },
      { href: "/sign-up?role=coach", label: "Coach Sign Up" },
      { href: "/sign-in", label: "Sign In" },
    ],
  },
  {
    title: "Legal & Support",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/content-removal", label: "Content Removal" },
      { href: "https://support.stripe.com/", label: "Stripe Billing Support", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo size="md" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Connecting student-athletes with college coaches through verified,
            searchable profiles.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {col.title}
            </span>
            {col.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} J.R. Recruiting. All rights reserved.</p>
          <a href="mailto:j.r.recruiting13@gmail.com" className="hover:text-gold">
            j.r.recruiting13@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
