import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSportDetailsParent } from "@/actions/player-sports";
import { addOfferParent, removeOfferParent } from "@/actions/offers";
import { addSchoolInterestParent, removeSchoolInterestParent } from "@/actions/school-interest";
import { SportDetailsForm } from "@/components/player/sport-details-form";
import { OffersManager } from "@/components/player/offers-manager";
import { SchoolInterestManager } from "@/components/player/school-interest-manager";

export default async function EditSportDetailsParentPage({
  params,
}: {
  params: Promise<{ playerId: string; sportId: string }>;
}) {
  const { playerId, sportId } = await params;
  const session = await auth();

  const playerSport = await prisma.playerSport.findUnique({
    where: { playerId_sportId: { playerId, sportId } },
    include: {
      sport: true,
      player: { select: { firstName: true, lastName: true, parentId: true } },
      offers: { orderBy: { createdAt: "desc" } },
      schoolInterests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!playerSport || playerSport.player.parentId !== session!.user.id) notFound();

  const boundUpdate = updateSportDetailsParent.bind(null, playerId, sportId);
  const boundAddOffer = addOfferParent.bind(null, playerId, sportId);
  const boundAddSchoolInterest = addSchoolInterestParent.bind(null, playerId, sportId);

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
        sportSlug={playerSport.sport.slug}
        defaultValues={{
          position: playerSport.position,
          // Player Projection is admin-only and never sent to this page.
          bio: playerSport.bio,
          stats: Array.isArray(playerSport.stats)
            ? (playerSport.stats as { label: string; value: string }[])
            : [],
        }}
      />
      <div className="max-w-2xl border-t border-border/60 pt-6">
        <OffersManager
          offers={playerSport.offers}
          addAction={boundAddOffer}
          removeAction={removeOfferParent}
          showStatus
        />
        <p className="mt-2 text-xs text-muted-foreground">
          New offers are reviewed by our team before they show on {playerSport.player.firstName}
          &apos;s profile.
        </p>
      </div>
      <div className="max-w-2xl border-t border-border/60 pt-6">
        <SchoolInterestManager
          schoolInterests={playerSport.schoolInterests}
          addAction={boundAddSchoolInterest}
          removeAction={removeSchoolInterestParent}
          showStatus
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Schools that have reached out and started a conversation &mdash; new entries are
          reviewed by our team before they show on {playerSport.player.firstName}&apos;s
          profile.
        </p>
      </div>
    </div>
  );
}
