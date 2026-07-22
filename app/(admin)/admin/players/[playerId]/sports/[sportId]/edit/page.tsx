import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSportDetailsAdmin } from "@/actions/player-sports";
import { SportDetailsForm } from "@/components/player/sport-details-form";

export default async function EditSportDetailsPage({
  params,
}: {
  params: Promise<{ playerId: string; sportId: string }>;
}) {
  const { playerId, sportId } = await params;

  const playerSport = await prisma.playerSport.findUnique({
    where: { playerId_sportId: { playerId, sportId } },
    include: { sport: true, player: { select: { firstName: true, lastName: true } } },
  });

  if (!playerSport) notFound();

  const boundUpdate = updateSportDetailsAdmin.bind(null, playerId, sportId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {playerSport.sport.name} details for {playerSport.player.firstName}{" "}
          {playerSport.player.lastName}
        </h1>
        <Link
          href={`/admin/players/${playerId}/edit`}
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
          projection: playerSport.projection,
          bio: playerSport.bio,
          stats: Array.isArray(playerSport.stats)
            ? (playerSport.stats as { label: string; value: string }[])
            : [],
        }}
      />
    </div>
  );
}
