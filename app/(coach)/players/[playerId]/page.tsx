import { notFound } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { recordProfileView } from "@/lib/notifications/profile-view";
import { maskLastName } from "@/lib/coach-visibility";
import { QuickStarButton } from "@/components/coach/quick-star-button";
import { PlayerPhotoGallery } from "@/components/player/player-photo-gallery";
import { PlayerProfileSections } from "@/components/coach/player-profile-sections";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { playerTypeLabel } from "@/lib/player-types";

export default async function CoachPlayerProfilePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const session = await requireRole("COACH");
  const isVerified = session.user.coachVerificationStatus === "APPROVED";
  const { playerId } = await params;

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      sports: {
        include: {
          sport: true,
          offers: { where: { status: "APPROVED" }, orderBy: { createdAt: "asc" } },
          schoolInterests: { where: { status: "APPROVED" }, orderBy: { createdAt: "asc" } },
        },
      },
      media: true,
    },
  });

  if (!player || player.listingStatus !== "ACTIVE") notFound();

  await recordProfileView(playerId, session.user.id);

  const [myStar, schoolSchedule] = await Promise.all([
    prisma.star.findUnique({
      where: { coachId_playerId: { coachId: session.user.id, playerId } },
    }),
    isVerified && player.schoolName
      ? prisma.schoolFootballSchedule.findUnique({ where: { schoolName: player.schoolName } })
      : null,
  ]);

  const videos = player.media
    .filter((m) => m.type === "VIDEO")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const extraPhotos = player.media
    .filter((m) => m.type === "PHOTO")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);
  const allPhotos = [player.primaryPhotoUrl, ...extraPhotos].filter(
    (v): v is string => Boolean(v)
  );
  const displayLastName = isVerified ? player.lastName : maskLastName(player.lastName);
  const displaySchool = isVerified ? player.schoolName : null;
  const displayLocation = [isVerified ? player.city : null, player.state, player.country]
    .filter(Boolean)
    .join(", ");
  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  // Each sport's own bio takes priority -- the general profile bio is only
  // shown as a fallback when no sport has its own bio, so a player who's
  // filled in both doesn't show two overlapping "Bio" sections for what's
  // effectively the same sport's profile.
  const sportsWithBio = sortedSports.filter((s) => s.bio);
  const showGeneralBio = Boolean(player.bio) && sportsWithBio.length === 0;
  const hasAnySportStats = sortedSports.some(
    (s) => Array.isArray(s.stats) && s.stats.length > 0
  );
  const sportsWithOffers = sortedSports.filter((s) => s.offers.length > 0);
  const sportsWithSchoolInterests = sortedSports.filter((s) => s.schoolInterests.length > 0);
  const hasAnyBio =
    showGeneralBio ||
    sportsWithBio.length > 0 ||
    hasAnySportStats ||
    sportsWithOffers.length > 0 ||
    sportsWithSchoolInterests.length > 0;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {!isVerified && <VerificationBanner />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <PlayerPhotoGallery
            photos={isVerified ? allPhotos : []}
            alt={`${player.firstName} ${displayLastName}`}
            size="lg"
          />
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {player.firstName} {displayLastName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {player.gender === "MALE" ? "Boy" : "Girl"}
              {player.gradYear != null ? ` · Class of ${player.gradYear}` : ""}
              {displaySchool ? ` · ${displaySchool}` : ""}
              {displayLocation ? ` · ${displayLocation}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{playerTypeLabel(player.playerType)}</Badge>
              {sortedSports.map((s) => (
                <Badge key={s.id} variant="secondary">
                  {s.sport.name}
                  {s.position ? ` · ${s.position}` : ""}
                  {s.projections.length > 0 ? ` · ${s.projections.join(", ")}` : ""}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <QuickStarButton playerId={player.id} initialStarred={Boolean(myStar)} />
      </div>

      {isVerified ? (
        <PlayerProfileSections
          heightIn={player.heightIn}
          weightLb={player.weightLb}
          gpa={player.gpa ? player.gpa.toString() : null}
          showGeneralBio={showGeneralBio}
          generalBio={player.bio}
          sportsWithBio={sportsWithBio}
          sportsWithOffers={sportsWithOffers}
          sportsWithSchoolInterests={sportsWithSchoolInterests}
          sortedSports={sortedSports}
          videos={videos}
          schoolSchedule={schoolSchedule}
          instagramHandle={player.instagramHandle}
          xHandle={player.xHandle}
          cellPhone={player.cellPhone}
        />
      ) : (
        (hasAnyBio ||
          videos.length > 0 ||
          player.instagramHandle ||
          player.xHandle ||
          player.cellPhone) && (
          <Card className="border-dashed border-border/60 bg-card/40">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bio, offers, highlight video, and contact info unlock once your coach account is
                verified.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
