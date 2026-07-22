import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { createSportProfileParent } from "@/actions/sport-profile";
import { PlayerForm } from "@/components/player/player-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewSportProfilePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const session = await auth();

  const [source, sports] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerId } }),
    getSports(),
  ]);

  if (!source || source.parentId !== session!.user.id) notFound();

  if (source.listingStatus !== "ACTIVE") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create a Profile for Another Sport
        </h1>
        <Card className="border-border/60">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {source.firstName}&apos;s current profile needs to be paid and active before you
              can add a free profile for another sport.{" "}
              <Link href={`/dashboard/players/${playerId}/payment`} className="text-gold hover:underline">
                Complete payment
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const siblingProfiles = await prisma.player.findMany({
    where: { parentId: session!.user.id, firstName: source.firstName, lastName: source.lastName },
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

  const boundCreate = createSportProfileParent.bind(null, playerId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create a Profile for Another Sport
        </h1>
        <p className="text-sm text-muted-foreground">
          This creates a brand new, separate profile for {source.firstName}{" "}
          -- coaches searching for that sport will find it on its own, distinct from the profile
          you already have. It&apos;s free since you&apos;ve already paid to list{" "}
          {source.firstName}. We&apos;ve pre-filled what carries over; just pick the new sport
          and position below.
        </p>
      </div>
      <PlayerForm
        sports={availableSports}
        showSportField
        action={boundCreate}
        submitLabel="Create Profile"
        requireConsentDialog
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
