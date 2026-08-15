"use client";

import { AuthNav, type NavItem } from "@/components/shared/auth-nav";
import { House, MagnifyingGlass, Star, Bell, Envelope } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/search", label: "Search", icon: MagnifyingGlass },
  { href: "/coach/dashboard/starred", label: "Starred", icon: Star },
  { href: "/coach/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/coach/dashboard/contact", label: "Contact Us", icon: Envelope },
];

export function CoachNav() {
  return <AuthNav homeHref="/home" navItems={navItems} />;
}
