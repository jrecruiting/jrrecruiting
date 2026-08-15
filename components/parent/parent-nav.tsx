"use client";

import { AuthNav, type NavItem } from "@/components/shared/auth-nav";
import { UsersThree, Bell, MagnifyingGlass } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "My Athletes", icon: UsersThree },
  { href: "/dashboard/claim", label: "Claim Profile", icon: MagnifyingGlass },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function ParentNav() {
  return <AuthNav homeHref="/dashboard" navItems={navItems} />;
}
