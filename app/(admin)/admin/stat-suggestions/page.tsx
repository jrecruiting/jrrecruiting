import { prisma } from "@/lib/prisma";
import { updateSportStatSuggestions } from "@/actions/sports";
import { DEFAULT_SPORT_STAT_SUGGESTIONS } from "@/lib/player-stats";
import { SportStatSuggestionsForm } from "@/components/admin/sport-stat-suggestions-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminStatSuggestionsPage() {
  const sports = await prisma.sport.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Stat Suggestions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The stat-name dropdown parents and admins see when adding combine measurables to a
          player&apos;s sport details, per sport. Coaches and parents can still type a custom stat
          if it&apos;s not in this list.
        </p>
      </div>

      <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
        {sports.map((sport) => {
          const suggestions = Array.isArray(sport.statSuggestions)
            ? (sport.statSuggestions as string[])
            : [];
          const boundUpdate = updateSportStatSuggestions.bind(null, sport.id);

          return (
            <Card key={sport.id} className="border-border/60">
              <CardContent>
                <SportStatSuggestionsForm
                  sportId={sport.id}
                  sportName={sport.name}
                  suggestions={suggestions}
                  action={boundUpdate}
                  hasDefault={Boolean(DEFAULT_SPORT_STAT_SUGGESTIONS[sport.slug])}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
