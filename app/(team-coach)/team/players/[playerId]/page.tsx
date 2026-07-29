import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlayerPhoto } from "@/components/player/player-photo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { playerTypeLabel } from "@/lib/player-types";
import { formatHeight } from "@/lib/player-data";

const offerStatusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
};

export default async function TeamCoachPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const session = await auth();
  const { playerId } = await params;

  const access = await prisma.teamCoachAccess.findUnique({
    where: { teamCoachId_playerId: { teamCoachId: session!.user.id, playerId } },
  });
  if (!access) notFound();

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      sports: {
        include: {
          sport: true,
          offers: { orderBy: { createdAt: "asc" } },
          schoolInterests: { orderBy: { createdAt: "asc" } },
        },
      },
      media: true,
    },
  });
  if (!player) notFound();

  const video = player.media.find((m) => m.type === "VIDEO");
  const displayLocation = [player.city, player.state, player.country].filter(Boolean).join(", ");
  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const sportsWithBio = sortedSports.filter((s) => s.bio);
  const showGeneralBio = Boolean(player.bio) && sportsWithBio.length === 0;
  const sportsWithOffers = sortedSports.filter((s) => s.offers.length > 0);
  const sportsWithSchoolInterests = sortedSports.filter((s) => s.schoolInterests.length > 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-start gap-4">
        <PlayerPhoto
          pathname={player.primaryPhotoUrl}
          alt={`${player.firstName} ${player.lastName}`}
          size="lg"
        />
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {player.firstName} {player.lastName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {player.gender === "MALE" ? "Boy" : "Girl"}
            {player.gradYear != null ? ` · Class of ${player.gradYear}` : ""}
            {player.schoolName ? ` · ${player.schoolName}` : ""}
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

      {showGeneralBio && (
        <Card className="border-border/60">
          <CardContent>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{player.bio}</p>
          </CardContent>
        </Card>
      )}

      {sportsWithBio.map((s) => (
        <Card key={s.id} className="border-border/60">
          <CardContent>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.sport.name} Bio
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{s.bio}</p>
          </CardContent>
        </Card>
      ))}

      {sportsWithOffers.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Offers</p>
            {sportsWithOffers.map((s) => (
              <div key={s.id} className="flex flex-col gap-1.5">
                {sportsWithOffers.length > 1 && (
                  <p className="text-xs font-medium text-muted-foreground">{s.sport.name}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {s.offers.map((offer) => (
                    <Badge key={offer.id} variant={offerStatusVariant[offer.status]}>
                      {offer.schoolName}
                      {offer.status !== "APPROVED" ? ` · ${offer.status.toLowerCase()}` : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {sportsWithSchoolInterests.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Schools Currently in Contact
            </p>
            {sportsWithSchoolInterests.map((s) => (
              <div key={s.id} className="flex flex-col gap-1.5">
                {sportsWithSchoolInterests.length > 1 && (
                  <p className="text-xs font-medium text-muted-foreground">{s.sport.name}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {s.schoolInterests.map((entry) => (
                    <Badge key={entry.id} variant={offerStatusVariant[entry.status]}>
                      {entry.schoolName}
                      {entry.status !== "APPROVED" ? ` · ${entry.status.toLowerCase()}` : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
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
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Instagram</p>
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
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cell</p>
                <p className="font-medium">{player.cellPhone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
