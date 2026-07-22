import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RemoveSportButton } from "@/components/player/remove-sport-button";

type SportItem = {
  sportId: string;
  sportName: string;
  position: string | null;
  bio: string | null;
  isPrimary: boolean;
};

export function PlayerSportsList({
  playerId,
  editBasePath,
  sports,
  removeAction,
}: {
  playerId: string;
  editBasePath: string;
  sports: SportItem[];
  removeAction: (playerId: string, sportId: string) => Promise<void>;
}) {
  const canRemove = sports.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {sports.map((s) => (
        <Card key={s.sportId} className="border-border/60">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{s.sportName}</p>
                {s.isPrimary && <Badge variant="secondary">Primary</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">
                {s.position || "No position set"}
                {s.bio ? " · Bio added" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`${editBasePath}/${playerId}/sports/${s.sportId}/edit`}
                className="text-sm text-gold hover:underline"
              >
                Edit Details
              </Link>
              {canRemove && (
                <RemoveSportButton
                  playerId={playerId}
                  sportId={s.sportId}
                  sportName={s.sportName}
                  removeAction={removeAction}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
