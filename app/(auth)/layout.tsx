import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-16 items-center border-b border-border/60 px-4 sm:px-6">
        <Link href="/" aria-label="J.R. Recruiting home">
          <Logo size="sm" />
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
