import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSportDetailsParent } from "@/actions/player-sports";
import { SportDetailsForm } from "@/components/player/sport-details-form";

export default async function EditSportDetailsParentPage({
  params,
}: {
  params: Promise<{ playerId: string; sportId: string }>;
}) {
  const { playerId, sportId } = await params;
  const session = await auth();

  const playerSport = await prisma.playerSport.findUnique({
    where: { playerId_sportId: { playerId, sportId } },
    include: { sport: true, player: { select: { firstName: true, lastName: true, parentId: true } } },
  });

  if (!playerSport || playerSport.player.parentId !== session!.user.id) notFound();

  const boundUpdate = updateSportDetailsParent.bind(null, playerId, sportId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {playerSport.sport.name} details for {playerSport.player.firstName}{" "}
          {playerSport.player.lastName}
        </h1>
        <Link
          href={`/dashboard/players/${playerId}/edit`}
          className="text-sm text-gold hover:underline"
        >
          Back to profile
        </Link>
      </div>
      <SportDetailsForm
        action={boundUpdate}
        sportName={playerSport.sport.name}
        defaultValues={{
          position: playerSport.position,
          // Player Projection is admin-only and never sent to this page.
          bio: playerSport.bio,
          stats: Array.isArray(playerSport.stats)
            ? (playerSport.stats as { label: string; value: string }[])
            : [],
        }}
      />
    </div>
  );
}
