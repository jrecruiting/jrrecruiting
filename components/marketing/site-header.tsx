import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="J.R. Recruiting home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/sign-in">Sign In</Link>}
          />
          <Button
            size="sm"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            nativeButton={false}
            render={<Link href="/sign-up">Get Started</Link>}
          />
        </div>
      </div>
    </header>
  );
}
