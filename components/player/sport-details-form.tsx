"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SportFormState } from "@/actions/player-sports";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

type StatRow = { key: string; label?: string; value?: string };

let statRowCounter = 0;
function newStatRowKey() {
  statRowCounter += 1;
  return `stat-${statRowCounter}`;
}

export function SportDetailsForm({
  action,
  sportName,
  defaultValues,
}: {
  action: (state: SportFormState, formData: FormData) => Promise<SportFormState>;
  sportName: string;
  defaultValues?: {
    position?: string | null;
    bio?: string | null;
    stats?: { label: string; value: string }[];
  };
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [statRows, setStatRows] = useState<StatRow[]>(() =>
    (defaultValues?.stats ?? []).map((s) => ({ key: newStatRowKey(), label: s.label, value: s.value }))
  );

  function addStatRow() {
    setStatRows((rows) => [...rows, { key: newStatRowKey() }]);
  }

  function removeStatRow(key: string) {
    setStatRows((rows) => rows.filter((r) => r.key !== key));
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" defaultValue={defaultValues?.position ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio for {sportName}</Label>
        <Textarea id="bio" name="bio" rows={5} defaultValue={defaultValues?.bio ?? ""} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Stats</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStatRow}>
            <Plus className="h-3.5 w-3.5" weight="bold" aria-hidden />
            Add Stat
          </Button>
        </div>

        {statRows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-lg border border-border/60 p-3"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`statLabel-${row.key}`}>Stat name</Label>
              <Input
                id={`statLabel-${row.key}`}
                name="statLabel"
                placeholder="e.g. 40-Yard Dash"
                defaultValue={row.label ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`statValue-${row.key}`}>Value</Label>
              <Input
                id={`statValue-${row.key}`}
                name="statValue"
                placeholder="e.g. 4.6s"
                defaultValue={row.value ?? ""}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeStatRow(row.key)}
              aria-label="Remove stat"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ))}
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-fit bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Saving..." : "Save Details"}
      </Button>
    </form>
  );
}
