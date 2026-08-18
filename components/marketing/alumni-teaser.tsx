import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";

const MAX_TEASED = 3;

// Prefers admin-flagged "featured" updates so the homepage can be curated
// deliberately rather than always just showing whatever was posted most
// recently; falls back to the newest updates when nothing is featured yet.
export async function AlumniTeaser() {
  const featured = await prisma.alumniUpdate.findMany({
    where: { featured: true },
    include: { sport: { select: { name: true } } },
    orderBy: { eventDate: "desc" },
    take: MAX_TEASED,
  });

  const updates =
    featured.length > 0
      ? featured
      : await prisma.alumniUpdate.findMany({
          include: { sport: { select: { name: true } } },
          orderBy: { eventDate: "desc" },
          take: MAX_TEASED,
        });

  if (updates.length === 0) return null;

  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Still on the field
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Where our athletes are now
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Recruiting doesn&apos;t end at signing day &mdash; here&apos;s how our athletes are
            doing in their college careers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {updates.map((update, i) => (
            <Reveal key={update.id} delay={i * 0.08}>
              <Card className="h-full border-border/60">
                <CardContent className="flex h-full flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {update.photoUrl && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={update.photoUrl}
                          alt={update.athleteName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold">{update.athleteName}</p>
                      <p className="text-xs font-medium text-gold">
                        {update.sport.name} &middot; {update.schoolName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90">{update.updateText}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="border-border/60"
            nativeButton={false}
            render={<Link href="/alumni">See All Alumni Updates</Link>}
          />
        </div>
      </div>
    </section>
  );
}
