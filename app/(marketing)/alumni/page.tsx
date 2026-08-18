import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Alumni",
  description:
    "See how the athletes J.R. Recruiting helped get recruited are doing in their college careers.",
};

// Reads live from the database (admin-posted updates), so this can't be
// statically prerendered at build time -- render per-request instead.
export const dynamic = "force-dynamic";

export default async function AlumniPage() {
  const updates = await prisma.alumniUpdate.findMany({
    include: { sport: { select: { name: true } } },
    orderBy: { eventDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Alumni
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Where they&apos;re playing now
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Recruiting doesn&apos;t end at signing day. Here&apos;s how the athletes we helped
          get recruited are doing in their college careers.
        </p>
      </div>

      {updates.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Check back soon &mdash; we&apos;ll be posting updates on our athletes as their
          college seasons unfold.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {updates.map((update, i) => (
            <Reveal key={update.id} delay={Math.min(i, 6) * 0.05}>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 sm:gap-5">
                  {update.photoUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted sm:h-20 sm:w-20">
                      <Image
                        src={update.photoUrl}
                        alt={update.athleteName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="font-heading text-lg font-bold">{update.athleteName}</p>
                      <p className="text-xs text-muted-foreground">
                        {update.eventDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gold">
                      {update.sport.name} &middot; {update.schoolName}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                      {update.updateText}
                    </p>
                    {update.linkUrl && (
                      <a
                        href={update.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm text-gold hover:underline"
                      >
                        See more
                        <ArrowSquareOut className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </Reveal>
    </div>
  );
}
