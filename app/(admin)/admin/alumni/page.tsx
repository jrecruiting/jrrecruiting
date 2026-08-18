import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteAlumniUpdate } from "@/actions/alumni-updates";
import { AlumniUpdateForm } from "@/components/admin/alumni-update-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminAlumniPage() {
  const [updates, sports] = await Promise.all([
    prisma.alumniUpdate.findMany({
      include: { sport: { select: { name: true } } },
      orderBy: { eventDate: "desc" },
    }),
    prisma.sport.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Alumni Updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Posted updates show up on the public{" "}
          <a href="/alumni" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            /alumni
          </a>{" "}
          page, newest first. Featured updates also appear on the homepage.
        </p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent>
          <AlumniUpdateForm sports={sports} />
        </CardContent>
      </Card>

      {updates.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Posted updates
          </h2>
          <div className="flex max-w-2xl flex-col gap-3">
            {updates.map((update) => (
              <Card key={update.id} className="border-border/60">
                <CardContent className="flex items-start gap-4">
                  {update.photoUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading font-semibold">{update.athleteName}</p>
                      {update.featured && (
                        <Badge className="border-gold/40 bg-gold/10 font-semibold text-gold">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {update.sport.name} &middot; {update.schoolName} &middot;{" "}
                      {update.eventDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                    <p className="mt-1 text-sm">{update.updateText}</p>
                  </div>
                  <form action={deleteAlumniUpdate.bind(null, update.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
