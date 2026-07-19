import Link from "next/link";
import { Info } from "@phosphor-icons/react/dist/ssr";

export function VerificationBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" weight="fill" aria-hidden />
      <p className="text-foreground/90">
        Your coach account is still under review, so you&apos;re seeing limited
        profile info (no full last names, exact locations, bios, or highlight
        videos). Full details unlock once you&apos;re verified.{" "}
        <Link href="/coach/dashboard/account/verification-pending" className="font-medium text-gold hover:underline">
          Learn more
        </Link>
      </p>
    </div>
  );
}
