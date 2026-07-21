import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { updatePlayerParent, deletePlayerParent } from "@/actions/players";
import { PlayerForm } from "@/components/player/player-form";
import { Button } from "@/components/ui/button";

export default async function EditAthletePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const session = await auth();

  const [player, sports] = await Promise.all([
    prisma.player.findUnique({
      where: { id: playerId },
      include: { sports: true, media: true },
    }),
    getSports(),
  ]);

  if (!player || player.parentId !== session!.user.id) notFound();

  const primarySport = player.sports.find((s) => s.isPrimary) ?? player.sports[0];
  const primaryVideo = player.media.find((m) => m.type === "VIDEO");

  const boundUpdate = updatePlayerParent.bind(null, playerId);
  const boundDelete = deletePlayerParent.bind(null, playerId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Edit {player.firstName} {player.lastName}
        </h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive" size="sm">
            Remove Athlete
          </Button>
        </form>
      </div>
      <PlayerForm
        sports={sports}
        action={boundUpdate}
        submitLabel="Save Changes"
        defaultValues={{
          firstName: player.firstName,
          lastName: player.lastName,
          gender: player.gender,
          playerType: player.playerType,
          gradYear: player.gradYear,
          country: player.country,
          state: player.state,
          heightFeet: player.heightIn != null ? Math.floor(player.heightIn / 12) : null,
          heightInches: player.heightIn != null ? player.heightIn % 12 : null,
          weightLb: player.weightLb,
          gpa: player.gpa?.toString(),
          bio: player.bio,
          primaryPhotoUrl: player.primaryPhotoUrl,
          photoConsent: player.photoConsent,
          sportId: primarySport?.sportId,
          position: primarySport?.position,
          videoUrl: primaryVideo?.url,
          instagramHandle: player.instagramHandle,
          xHandle: player.xHandle,
          cellPhone: player.cellPhone,
        }}
      />
    </div>
  );
}
