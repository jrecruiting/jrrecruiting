import { prisma } from "@/lib/prisma";
import { createAnnouncement, deleteAnnouncement } from "@/actions/announcements";
import { formatPacificDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const [mostRecent, ...older] = announcements;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The most recent announcement is pinned to the top of every coach&apos;s home page.
          Older ones stay listed here but aren&apos;t shown to coaches.
        </p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent>
          <form action={createAnnouncement} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Big weekend for our 2027 QBs"
                maxLength={120}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" name="body" rows={4} maxLength={2000} required />
            </div>
            <Button type="submit" className="w-fit bg-gold text-gold-foreground hover:bg-gold/90">
              Post Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      {mostRecent && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Currently pinned
          </h2>
          <Card className="max-w-2xl border-gold/40 bg-gold/5">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-heading font-semibold">{mostRecent.title}</p>
                <form action={deleteAnnouncement.bind(null, mostRecent.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{mostRecent.body}</p>
              <p className="text-xs text-muted-foreground">
                Posted by {mostRecent.author.name} &middot; {formatPacificDateTime(mostRecent.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {older.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Past announcements
          </h2>
          <div className="flex max-w-2xl flex-col gap-3">
            {older.map((a) => (
              <Card key={a.id} className="border-border/60">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-heading font-semibold">{a.title}</p>
                    <form action={deleteAnnouncement.bind(null, a.id)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{a.body}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted by {a.author.name} &middot; {formatPacificDateTime(a.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
