import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { signOutAction } from "@/actions/auth";
import { MagnifyingGlass, Star, Bell, SignOut } from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { href: "/search", label: "Search", icon: MagnifyingGlass },
  { href: "/coach/dashboard/starred", label: "Starred", icon: Star },
  { href: "/coach/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function CoachNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/search" aria-label="J.R. Recruiting home">
          <Logo size="sm" />
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Sign Out"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <SignOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
