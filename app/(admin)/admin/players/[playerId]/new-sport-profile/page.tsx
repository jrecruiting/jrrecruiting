import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { createSportProfileAdmin } from "@/actions/sport-profile";
import { PlayerForm } from "@/components/player/player-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewSportProfileAdminPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

  const [source, sports] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerId } }),
    getSports(),
  ]);

  if (!source) notFound();

  const siblingProfiles = await prisma.player.findMany({
    where: {
      firstName: source.firstName,
      lastName: source.lastName,
      parentId: source.parentId,
    },
    include: { sports: true },
  });
  const usedSportIds = new Set(siblingProfiles.flatMap((p) => p.sports.map((s) => s.sportId)));
  const availableSports = sports.filter((s) => !usedSportIds.has(s.id));

  if (availableSports.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create a Profile for Another Sport
        </h1>
        <Card className="border-border/60">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {source.firstName} already has a profile for every sport we support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const boundCreate = createSportProfileAdmin.bind(null, playerId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create a Profile for Another Sport
        </h1>
        <p className="text-sm text-muted-foreground">
          This creates a brand new, separate profile for {source.firstName}{" "}
          -- coaches searching for that sport will find it on its own. We&apos;ve pre-filled what
          carries over; just pick the new sport and position below.
        </p>
      </div>
      <PlayerForm
        sports={availableSports}
        showSportField
        action={boundCreate}
        submitLabel="Create Profile"
        defaultValues={{
          firstName: source.firstName,
          lastName: source.lastName,
          gender: source.gender,
          playerType: source.playerType,
          gradYear: source.gradYear,
          country: source.country,
          state: source.state,
          schoolName: source.schoolName,
          heightFeet: source.heightIn != null ? Math.floor(source.heightIn / 12) : null,
          heightInches: source.heightIn != null ? source.heightIn % 12 : null,
          weightLb: source.weightLb,
          gpa: source.gpa?.toString(),
          bio: source.bio,
          primaryPhotoUrl: source.primaryPhotoUrl,
          photoConsent: source.photoConsent,
          instagramHandle: source.instagramHandle,
          xHandle: source.xHandle,
          cellPhone: source.cellPhone,
        }}
      />
    </div>
  );
}
