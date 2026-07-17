import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import {
  Gauge,
  UsersThree,
  ShieldCheck,
  HandCoins,
  ArrowsClockwise,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/players", label: "Players", icon: UsersThree },
  { href: "/admin/coaches", label: "Coach Verification", icon: ShieldCheck },
  { href: "/admin/claims", label: "Claims", icon: ArrowsClockwise },
  { href: "/admin/payments", label: "Payments", icon: HandCoins },
];

export function AdminNav() {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border/60 bg-sidebar p-4">
      <span className="mb-2 px-2 font-heading text-sm font-semibold text-sidebar-foreground/70">
        Admin
      </span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <item.icon className="h-4 w-4" weight="bold" aria-hidden />
          {item.label}
        </Link>
      ))}
      <form action={signOutAction} className="mt-auto">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <SignOut className="h-4 w-4" weight="bold" aria-hidden />
          Sign Out
        </button>
      </form>
    </nav>
  );
}
