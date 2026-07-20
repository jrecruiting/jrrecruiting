import type { Metadata } from "next";
import { requireRole } from "@/lib/permissions";
import { CoachNav } from "@/components/coach/coach-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("COACH");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <CoachNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
