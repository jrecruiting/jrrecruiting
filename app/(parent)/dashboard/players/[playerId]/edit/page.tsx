import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { updatePlayerParent, deletePlayerParent } from "@/actions/players";
import { PlayerForm } from "@/components/player/player-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditAthletePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const session = await auth();

  const [player, sports, pendingEdit] = await Promise.all([
    prisma.player.findUnique({
      where: { id: playerId },
      include: { sports: true, media: true },
    }),
    getSports(),
    prisma.playerEditRequest.findFirst({
      where: { playerId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!player || player.parentId !== session!.user.id) notFound();

  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
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

      {pendingEdit && (
        <Card className="border-gold/50 bg-gold/5">
          <CardContent>
            <p className="text-sm">
              You have changes submitted on {pendingEdit.createdAt.toLocaleDateString()} that
              are waiting on admin review. The profile coaches see still reflects the current
              approved version until those changes are approved. Submitting the form below will
              update your pending request with the latest changes.
            </p>
          </CardContent>
        </Card>
      )}

      <PlayerForm
        sports={sports}
        action={boundUpdate}
        submitLabel="Save Changes"
        requireConsentDialog
        defaultValues={{
          firstName: player.firstName,
          lastName: player.lastName,
          gender: player.gender,
          playerType: player.playerType,
          gradYear: player.gradYear,
          country: player.country,
          state: player.state,
          schoolName: player.schoolName,
          heightFeet: player.heightIn != null ? Math.floor(player.heightIn / 12) : null,
          heightInches: player.heightIn != null ? player.heightIn % 12 : null,
          weightLb: player.weightLb,
          gpa: player.gpa?.toString(),
          bio: player.bio,
          primaryPhotoUrl: player.primaryPhotoUrl,
          photoConsent: player.photoConsent,
          sports: sortedSports.map((s) => ({ sportId: s.sportId, position: s.position })),
          videoUrl: primaryVideo?.url,
          instagramHandle: player.instagramHandle,
          xHandle: player.xHandle,
          cellPhone: player.cellPhone,
        }}
      />
    </div>
  );
}
