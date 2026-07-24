import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import {
  Gauge,
  UsersThree,
  ShieldCheck,
  HandCoins,
  ArrowsClockwise,
  PencilSimple,
  CalendarCheck,
  Eye,
  UserCircle,
  Envelope,
  Trophy,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/players", label: "Players", icon: UsersThree },
  { href: "/admin/profile-views", label: "Profile Views", icon: Eye },
  { href: "/admin/parent-views", label: "Parent Visits", icon: UserCircle },
  { href: "/admin/coach-messages", label: "Coach Messages", icon: Envelope },
  { href: "/admin/offers", label: "Offers", icon: Trophy },
  { href: "/admin/edit-requests", label: "Edit Requests", icon: PencilSimple },
  { href: "/admin/coaches", label: "Coach Verification", icon: ShieldCheck },
  { href: "/admin/claims", label: "Claims", icon: ArrowsClockwise },
  { href: "/admin/payments", label: "Payments", icon: HandCoins },
  { href: "/admin/payment-plans", label: "Payment Plans", icon: CalendarCheck },
];

export function AdminNav() {
  return (
    <nav className="flex w-full shrink-0 items-center gap-1 overflow-x-auto border-b border-border/60 bg-sidebar p-2 sm:w-56 sm:flex-col sm:items-stretch sm:gap-1 sm:overflow-visible sm:border-b-0 sm:border-r sm:p-4">
      <span className="hidden px-2 font-heading text-sm font-semibold text-sidebar-foreground/70 sm:mb-2 sm:block">
        Admin
      </span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className="flex shrink-0 items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <item.icon className="h-4 w-4" weight="bold" aria-hidden />
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}
      <form action={signOutAction} className="shrink-0 sm:mt-auto">
        <button
          type="submit"
          aria-label="Sign Out"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:w-full"
        >
          <SignOut className="h-4 w-4" weight="bold" aria-hidden />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </form>
    </nav>
  );
}
