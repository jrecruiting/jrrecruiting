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
  const displayLocation = [isVerified ? player.city : null, player.state, player.country]
    .filter(Boolean)
    .join(", ");

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
              {displayLocation ? ` · ${displayLocation}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{playerTypeLabel(player.playerType)}</Badge>
              {player.sports.map((s) => (
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
            <p className="font-medium">{player.heightIn ? `${player.heightIn} in` : "—"}</p>
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
          {player.bio && (
            <Card className="border-border/60">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
                <p className="mt-1 text-sm">{player.bio}</p>
              </CardContent>
            </Card>
          )}

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
        (player.bio ||
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
