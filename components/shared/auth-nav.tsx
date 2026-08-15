"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { List, SignOut, type Icon } from "@phosphor-icons/react";

export type NavItem = { href: string; label: string; icon: Icon };

// Picks the most specific matching item (longest href) so a sub-route like
// /dashboard/players/123/edit still highlights "My Athletes" (/dashboard)
// without a shorter prefix ever shadowing a more specific sibling route.
function activeHrefFor(pathname: string, items: NavItem[]): string | null {
  let best: NavItem | null = null;
  for (const item of items) {
    const matches = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (matches && (!best || item.href.length > best.href.length)) best = item;
  }
  return best?.href ?? null;
}

export function AuthNav({ homeHref, navItems }: { homeHref: string; navItems: NavItem[] }) {
  const pathname = usePathname();
  const activeHref = activeHrefFor(pathname, navItems);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={homeHref} aria-label="J.R. Recruiting home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
                    : "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <SignOut className="h-4 w-4" aria-hidden />
              Sign Out
            </button>
          </form>
        </nav>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label="Open menu" className="sm:hidden" />}
          >
            <List className="h-5 w-5" aria-hidden />
          </SheetTrigger>
          <SheetContent side="right" className="w-64 gap-0 p-0">
            <SheetHeader className="border-b border-border/60">
              <SheetTitle>
                <Logo size="sm" />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-0.5 p-2">
              {navItems.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "flex items-center gap-3 rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-foreground"
                        : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    }
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <form action={signOutAction} className="mt-auto border-t border-border/60 p-2">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
              >
                <SignOut className="h-4 w-4" aria-hidden />
                Sign Out
              </button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
