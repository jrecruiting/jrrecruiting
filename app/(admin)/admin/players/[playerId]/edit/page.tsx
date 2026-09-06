import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSports } from "@/lib/data/sports";
import { updatePlayerAdmin, deletePlayerAdmin } from "@/actions/players";
import { addPlayerSportAdmin, removePlayerSportAdmin } from "@/actions/player-sports";
import { PlayerForm } from "@/components/player/player-form";
import { PlayerSportsList } from "@/components/player/player-sports-list";
import { AddSportForm } from "@/components/player/add-sport-form";
import { formatPacificDate, formatPacificDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Forces this page's HTTP response to carry Next's full dynamic-route
// Cache-Control ("private, no-cache, no-store, max-age=0, must-revalidate"
// in production -- see node_modules/next/dist/docs/01-app/02-guides/
// cdn-caching.md), which also makes it ineligible for the browser's
// back/forward cache (bfcache requires the absence of no-store). This is a
// belt-and-suspenders layer on top of updatePlayerAdmin's protectSince/
// dataFetchedAt conflict checks: those already stop a stale save from
// losing or overwriting data no matter what the browser shows, but this
// keeps the browser from ever displaying a stale copy of this page in the
// first place (e.g. via the Back button after leaving it), which is
// confusing even when nothing actually gets lost.
export const dynamic = "force-dynamic";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

  const [player, sports, pendingEdit, parentViews] = await Promise.all([
    prisma.player.findUnique({
      where: { id: playerId },
      include: { sports: { include: { sport: true } }, media: true },
    }),
    getSports(),
    prisma.playerEditRequest.findFirst({
      where: { playerId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.parentViewEvent.findMany({
      where: { playerId },
      include: { parent: { select: { name: true, email: true } } },
      orderBy: { viewedAt: "desc" },
      take: 10,
    }),
  ]);

  // Baked into this render's HTML as a hidden field (see PlayerForm's
  // dataFetchedAt), not read from the client's clock -- if this exact
  // render gets served again later from a cache (the browser's
  // back/forward cache, or Next re-mounting the client form from a cached
  // router payload), the stamp still correctly reflects when the data
  // below was actually queried, not whenever that replay happens to occur.
  const dataFetchedAt = Date.now();

  if (!player) notFound();

  const sortedSports = player.sports
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const videos = player.media
    .filter((m) => m.type === "VIDEO")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => ({ url: m.url, title: m.title, notes: m.notes }));
  const extraPhotos = player.media
    .filter((m) => m.type === "PHOTO")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);
  const addedSportIds = new Set(player.sports.map((s) => s.sportId));
  const availableSports = sports.filter((s) => !addedSportIds.has(s.id));

  const boundUpdate = updatePlayerAdmin.bind(null, playerId);
  const boundDelete = deletePlayerAdmin.bind(null, playerId);
  const boundAddSport = addPlayerSportAdmin.bind(null, playerId);

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
              The parent submitted changes on {formatPacificDate(pendingEdit.createdAt)} that
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
        action={boundUpdate}
        submitLabel="Save Changes"
        promptAnnounceOnSave
        showVideoNotesField
        dataFetchedAt={dataFetchedAt}
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
          extraPhotos,
          photoConsent: player.photoConsent,
          videos,
          instagramHandle: player.instagramHandle,
          xHandle: player.xHandle,
          cellPhone: player.cellPhone,
        }}
      />

      <div className="flex max-w-2xl flex-col gap-4 border-t border-border/60 pt-6">
        <h2 className="font-heading text-lg font-semibold">Sports</h2>
        <p className="text-sm text-muted-foreground">
          Each sport has its own position, bio, and stats, since coaches look at those
          differently by sport.
        </p>
        <PlayerSportsList
          playerId={playerId}
          editBasePath="/admin/players"
          sports={sortedSports.map((s) => ({
            sportId: s.sportId,
            sportName: s.sport.name,
            position: s.position,
            projections: s.projections,
            bio: s.bio,
            isPrimary: s.isPrimary,
          }))}
          removeAction={removePlayerSportAdmin}
          showProjection
        />
        <AddSportForm action={boundAddSport} availableSports={availableSports} />
      </div>

      <div className="flex max-w-2xl flex-col gap-3 border-t border-border/60 pt-6">
        <h2 className="font-heading text-lg font-semibold">Play a Different Sport?</h2>
        <p className="text-sm text-muted-foreground">
          If {player.firstName}{" "}
          plays a sport that deserves its own listing -- separate from this one, so coaches
          searching that sport find it directly -- create a new profile for it, pre-filled with{" "}
          {player.firstName}&apos;s info.
        </p>
        <Button
          variant="outline"
          className="w-fit border-border/60"
          nativeButton={false}
          render={<Link href={`/admin/players/${playerId}/new-sport-profile`}>Create Profile for Another Sport</Link>}
        />
      </div>

      <div className="flex max-w-2xl flex-col gap-3 border-t border-border/60 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Parent Activity</h2>
          <Link
            href={`/admin/parent-views?playerId=${playerId}`}
            className="text-sm text-gold hover:underline"
          >
            View full history
          </Link>
        </div>
        {parentViews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The parent hasn&apos;t visited this athlete&apos;s profile yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-sm">
            {parentViews.map((v) => (
              <li key={v.id} className="text-muted-foreground">
                {v.parent.name} ({v.parent.email}) &mdash; {formatPacificDateTime(v.viewedAt)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
