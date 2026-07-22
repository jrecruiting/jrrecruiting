import { notFound } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { recordProfileView } from "@/lib/notifications/profile-view";
import { maskLastName } from "@/lib/coach-visibility";
import { QuickStarButton } from "@/components/coach/quick-star-button";
import { PlayerPhoto } from "@/components/player/player-photo";
import { VerificationBanner } from "@/components/coach/verification-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { playerTypeLabel } from "@/lib/player-types";
import { formatHeight } from "@/lib/player-data";

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
    include: { sports: { include: { sport: true } }, media: true },
  });

  if (!player || player.listingStatus !== "ACTIVE") notFound();

  await recordProfileView(playerId, session.user.id);

  const myStar = await prisma.star.findUnique({
    where: { coachId_playerId: { coachId: session.user.id, playerId } },
  });

  const video = player.media.find((m) => m.type === "VIDEO");
  const displayLastName = isVerified ? player.lastName : maskLastName(player.lastName);
  const displaySchool = isVerified ? player.schoolName : null;
  const displayLocation = [isVerified ? player.city : null, player.state, player.country]
    .filter(Boolean)
    .join(", ");
  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  // Only one Bio is ever shown to coaches -- the general profile bio if set,
  // otherwise the primary sport's bio as a fallback -- so a player with both
  // never shows duplicate "Bio" sections.
  const displayBio = player.bio || sortedSports[0]?.bio || null;
  const hasAnySportStats = sortedSports.some(
    (s) => Array.isArray(s.stats) && s.stats.length > 0
  );
  const hasAnyBio = Boolean(displayBio) || hasAnySportStats;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {!isVerified && <VerificationBanner />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <PlayerPhoto
            pathname={isVerified ? player.primaryPhotoUrl : null}
            alt={`${player.firstName} ${displayLastName}`}
            size="lg"
          />
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {player.firstName} {displayLastName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {player.gender === "MALE" ? "Boy" : "Girl"} &middot; Class of {player.gradYear}
              {displaySchool ? ` · ${displaySchool}` : ""}
              {displayLocation ? ` · ${displayLocation}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{playerTypeLabel(player.playerType)}</Badge>
              {sortedSports.map((s) => (
                <Badge key={s.id} variant="secondary">
                  {s.sport.name}
                  {s.position ? ` · ${s.position}` : ""}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <QuickStarButton playerId={player.id} initialStarred={Boolean(myStar)} />
      </div>

      <Card className="border-border/60">
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Height</p>
            <p className="font-medium">{player.heightIn ? formatHeight(player.heightIn) : "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Weight</p>
            <p className="font-medium">{player.weightLb ? `${player.weightLb} lb` : "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">GPA</p>
            <p className="font-medium">{player.gpa ? player.gpa.toString() : "—"}</p>
          </div>
        </CardContent>
      </Card>

      {isVerified ? (
        <>
          {displayBio && (
            <Card className="border-border/60">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
                <p className="mt-1 text-sm">{displayBio}</p>
              </CardContent>
            </Card>
          )}

          {sortedSports.map((s) => {
            const stats = Array.isArray(s.stats) ? (s.stats as { label: string; value: string }[]) : [];
            if (stats.length === 0) return null;
            return (
              <Card key={s.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.sport.name} stats
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {stats.map((stat, i) => (
                      <div key={i}>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="font-medium">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {video && (
            <Card className="border-border/60">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Highlight video
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-gold hover:underline"
                >
                  {video.url}
                </a>
              </CardContent>
            </Card>
          )}

          {(player.instagramHandle || player.xHandle || player.cellPhone) && (
            <Card className="border-border/60">
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {player.instagramHandle && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Instagram
                    </p>
                    <p className="font-medium">@{player.instagramHandle}</p>
                  </div>
                )}
                {player.xHandle && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      X (Twitter)
                    </p>
                    <p className="font-medium">@{player.xHandle}</p>
                  </div>
                )}
                {player.cellPhone && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Cell
                    </p>
                    <p className="font-medium">{player.cellPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        (hasAnyBio ||
          video ||
          player.instagramHandle ||
          player.xHandle ||
          player.cellPhone) && (
          <Card className="border-dashed border-border/60 bg-card/40">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bio, highlight video, and contact info unlock once your coach account is
                verified.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
