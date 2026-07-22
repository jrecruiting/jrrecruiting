import { prisma } from "@/lib/prisma";
import { resolveEditRequest } from "@/actions/player-edit-requests";
import { buildPlayerData } from "@/lib/player-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PlayerFormValues } from "@/lib/validations/player";

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  gender: "Gender",
  playerType: "Player type",
  gradYear: "Graduation year",
  country: "Country",
  state: "State",
  heightIn: "Height",
  weightLb: "Weight",
  gpa: "GPA",
  bio: "Bio",
  primaryPhotoUrl: "Photo",
  photoConsent: "Photo consent",
  instagramHandle: "Instagram",
  xHandle: "X (Twitter)",
  cellPhone: "Cell number",
};

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "heightIn") return `${value} in`;
  if (key === "photoConsent") return value ? "Yes" : "No";
  if (key === "gpa") return parseFloat(String(value)).toFixed(2);
  return String(value);
}

export default async function AdminEditRequestsPage() {
  const [requests, sports] = await Promise.all([
    prisma.playerEditRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        player: { include: { sports: { include: { sport: true } }, media: true } },
        submitter: true,
      },
      take: 100,
    }),
    prisma.sport.findMany(),
  ]);

  const sportName = (id: string) => sports.find((s) => s.id === id)?.name ?? id;

  const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Player Edit Requests</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">No edit requests yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((request) => {
            const proposed = request.proposedData as unknown as PlayerFormValues;
            // Requests submitted before multi-sport support stored a single
            // sportId/position pair instead of a sports array; normalize so
            // older, already-resolved requests still render in this history.
            const legacyProposed = request.proposedData as unknown as {
              sportId?: string;
              position?: string;
            };
            const proposedSports =
              proposed.sports ??
              (legacyProposed.sportId
                ? [{ sportId: legacyProposed.sportId, position: legacyProposed.position }]
                : []);
            const proposedRow = buildPlayerData(proposed) as unknown as Record<string, unknown>;
            const currentPlayer = request.player as unknown as Record<string, unknown>;
            const currentSports = request.player.sports
              .slice()
              .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
            const currentVideo = request.player.media.find((m) => m.type === "VIDEO");

            const rows: { label: string; before: string; after: string }[] = [];

            for (const key of Object.keys(FIELD_LABELS)) {
              const before = formatValue(key, currentPlayer[key]);
              const after = formatValue(key, proposedRow[key]);
              if (before !== after) rows.push({ label: FIELD_LABELS[key], before, after });
            }

            const beforeSport = currentSports.length
              ? currentSports
                  .map((s) => `${s.sport.name}${s.position ? ` · ${s.position}` : ""}`)
                  .join(", ")
              : "—";
            const afterSport = proposedSports.length
              ? proposedSports
                  .map((s) => `${sportName(s.sportId)}${s.position ? ` · ${s.position}` : ""}`)
                  .join(", ")
              : "—";
            if (beforeSport !== afterSport) {
              rows.push({ label: "Sports", before: beforeSport, after: afterSport });
            }

            const beforeVideo = currentVideo?.url ?? "—";
            const afterVideo = proposed.videoUrl || "—";
            if (beforeVideo !== afterVideo) {
              rows.push({ label: "Highlight video", before: beforeVideo, after: afterVideo });
            }

            const approve = resolveEditRequest.bind(null, request.id, true);
            const reject = resolveEditRequest.bind(null, request.id, false);

            return (
              <Card key={request.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {request.player.firstName} {request.player.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted by {request.submitter.name} ({request.submitter.email}) &middot;{" "}
                        {request.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                  </div>

                  {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No field changes detected.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-md border border-border/60">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2">Field</th>
                            <th className="px-3 py-2">Current</th>
                            <th className="px-3 py-2">Proposed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.label} className="border-t border-border/60">
                              <td className="px-3 py-2 font-medium">{row.label}</td>
                              <td className="px-3 py-2 text-muted-foreground">{row.before}</td>
                              <td className="px-3 py-2">{row.after}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {request.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <form action={approve}>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-gold text-gold-foreground hover:bg-gold/90"
                        >
                          Approve
                        </Button>
                      </form>
                      <form action={reject}>
                        <Button type="submit" size="sm" variant="destructive">
                          Reject
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
