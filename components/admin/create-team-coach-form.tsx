"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createTeamCoach, searchPlayersByName, type TeamCoachFormState } from "@/actions/team-coaches";
import { PlayerSearchPicker } from "@/components/admin/player-search-picker";

type SelectedPlayer = { id: string; firstName: string; lastName: string };

const initialState: TeamCoachFormState = undefined;

export function CreateTeamCoachForm() {
  const [state, formAction, isPending] = useActionState(createTeamCoach, initialState);
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tc-name">Coach name</Label>
          <Input id="tc-name" name="name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tc-email">Coach email</Label>
          <Input id="tc-email" name="email" type="email" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Athlete to link</Label>
        {selected ? (
          <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2.5 py-1.5 text-sm">
            <span>
              {selected.firstName} {selected.lastName}
            </span>
            <Button type="button" size="sm" variant="ghost" onClick={() => setSelected(null)}>
              Change
            </Button>
          </div>
        ) : (
          <PlayerSearchPicker searchAction={searchPlayersByName} onSelect={setSelected} />
        )}
        <input type="hidden" name="playerId" value={selected?.id ?? ""} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || !selected}
        className="w-fit bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Sending invite..." : "Create Account & Send Invite"}
      </Button>
    </form>
  );
}
