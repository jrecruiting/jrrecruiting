import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { updatePlayerAdmin, deletePlayerAdmin } from "@/actions/players";
import { PlayerForm } from "@/components/player/player-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

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

  if (!player) notFound();

  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const primaryVideo = player.media.find((m) => m.type === "VIDEO");

  const boundUpdate = updatePlayerAdmin.bind(null, playerId);
  const boundDelete = deletePlayerAdmin.bind(null, playerId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Edit {player.firstName} {player.lastName}
        </h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive" size="sm">
            Delete Player
          </Button>
        </form>
      </div>

      {pendingEdit && (
        <Card className="border-gold/50 bg-gold/5">
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm">
              The parent submitted changes on {pendingEdit.createdAt.toLocaleDateString()} that
              are waiting on your review. Editing here directly still applies immediately.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-border/60"
              nativeButton={false}
              render={<Link href="/admin/edit-requests">Review</Link>}
            />
          </CardContent>
        </Card>
      )}

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
