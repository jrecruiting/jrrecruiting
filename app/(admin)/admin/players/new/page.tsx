import { getSports } from "@/lib/data/sports";
import { createPlayerAdmin } from "@/actions/players";
import { PlayerForm } from "@/components/player/player-form";

export default async function NewPlayerPage() {
  const sports = await getSports();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Add Player</h1>
      <PlayerForm
        sports={sports}
        showSportField
        action={createPlayerAdmin}
        submitLabel="Create Player"
      />
    </div>
  );
}
