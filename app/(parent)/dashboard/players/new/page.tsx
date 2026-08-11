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
          This becomes the profile coaches see &mdash; and once it&apos;s live, we
          start reaching out to coaches directly on your athlete&apos;s behalf.
          Fill in the details below, then complete the listing fee to publish it.
        </p>
      </div>
      <PlayerForm
        sports={sports}
        showSportField
        action={createPlayerParent}
        submitLabel="Continue to Payment"
        requireConsentDialog
      />
    </div>
  );
}
