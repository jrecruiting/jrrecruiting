import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { updateAlumniUpdate } from "@/actions/alumni-updates";
import { AlumniUpdateForm } from "@/components/admin/alumni-update-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditAlumniUpdatePage({
  params,
}: {
  params: Promise<{ updateId: string }>;
}) {
  await requireRole("ADMIN");
  const { updateId } = await params;

  const [update, sports] = await Promise.all([
    prisma.alumniUpdate.findUnique({ where: { id: updateId } }),
    prisma.sport.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!update) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Edit Update &mdash; {update.athleteName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Changes save immediately.</p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent>
          <AlumniUpdateForm
            sports={sports}
            action={updateAlumniUpdate.bind(null, update.id)}
            submitLabel="Save Changes"
            defaultValues={{
              athleteName: update.athleteName,
              sportId: update.sportId,
              schoolName: update.schoolName,
              eventDate: update.eventDate.toISOString().slice(0, 10),
              updateText: update.updateText,
              linkUrl: update.linkUrl,
              photoUrl: update.photoUrl,
              featured: update.featured,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
