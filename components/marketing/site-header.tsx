import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/marketing/logo";
import { List } from "@phosphor-icons/react/dist/ssr";

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
          <div className="hidden items-center gap-2 md:flex">
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

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden" />
              }
            >
              <List className="h-5 w-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 gap-0 p-0">
              <SheetTitle className="border-b border-border/60 px-4 py-4">
                <Logo size="sm" />
              </SheetTitle>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    }
                  />
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border/60 p-4">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Button
                      variant="outline"
                      nativeButton={false}
                      render={<Link href="/sign-in">Sign In</Link>}
                    />
                  }
                />
                <SheetClose
                  nativeButton={false}
                  render={
                    <Button
                      className="bg-gold text-gold-foreground hover:bg-gold/90"
                      nativeButton={false}
                      render={<Link href="/sign-up">Get Started</Link>}
                    />
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
