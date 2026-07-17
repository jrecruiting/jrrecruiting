import { getSports } from "@/lib/data/sports";
import { createPlayerParent } from "@/actions/players";
import { PlayerForm } from "@/components/player/player-form";

export default async function NewAthletePage() {
  const sports = await getSports();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Add an Athlete</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your athlete&apos;s info. You&apos;ll complete the listing fee on the
          next step before the profile goes live for coaches.
        </p>
      </div>
      <PlayerForm sports={sports} action={createPlayerParent} submitLabel="Continue to Payment" />
    </div>
  );
}
