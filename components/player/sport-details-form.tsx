"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SportFormState } from "@/actions/player-sports";
import { PLAYER_PROJECTIONS } from "@/lib/player-projections";
import { SPORT_STAT_SUGGESTIONS, CUSTOM_STAT_VALUE } from "@/lib/player-stats";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

type StatRow = { key: string; label?: string; value?: string; custom: boolean };

let statRowCounter = 0;
function newStatRowKey() {
  statRowCounter += 1;
  return `stat-${statRowCounter}`;
}

export function SportDetailsForm({
  action,
  sportName,
  sportSlug,
  defaultValues,
  showProjection = false,
}: {
  action: (state: SportFormState, formData: FormData) => Promise<SportFormState>;
  sportName: string;
  sportSlug: string;
  defaultValues?: {
    position?: string | null;
    projections?: string[];
    bio?: string | null;
    stats?: { label: string; value: string }[];
  };
  // Player Projection is an internal admin-only label, never shown to parents.
  showProjection?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const suggestions = SPORT_STAT_SUGGESTIONS[sportSlug] ?? [];
  const [statRows, setStatRows] = useState<StatRow[]>(() =>
    (defaultValues?.stats ?? []).map((s) => ({
      key: newStatRowKey(),
      label: s.label,
      value: s.value,
      // Stats saved before this feature existed (or from a sport with no
      // curated list) won't match a suggestion -- fall back to the free
      // text field for those instead of hiding/losing the value.
      custom: !suggestions.includes(s.label),
    }))
  );

  function addStatRow() {
    setStatRows((rows) => [...rows, { key: newStatRowKey(), custom: false }]);
  }

  function removeStatRow(key: string) {
    setStatRows((rows) => rows.filter((r) => r.key !== key));
  }

  function setStatCustom(key: string, custom: boolean) {
    setStatRows((rows) =>
      rows.map((r) => (r.key === key ? { ...r, custom, label: custom ? "" : r.label } : r))
    );
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" defaultValue={defaultValues?.position ?? ""} />
      </div>

      {showProjection && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projections">Player Projection</Label>
          <Select name="projections" multiple defaultValue={defaultValues?.projections ?? []}>
            <SelectTrigger id="projections" className="w-full">
              <SelectValue placeholder="Select projection(s)">
                {(value: string[] | null) =>
                  value && value.length > 0
                    ? value
                        .map((v) => PLAYER_PROJECTIONS.find((p) => p.value === v)?.label ?? v)
                        .join(", ")
                    : "Select projection(s)"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PLAYER_PROJECTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select as many as apply -- e.g. a player can be both FCS and D2.
          </p>
        </div>
      )}

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
            className="flex flex-col gap-2 rounded-lg border border-border/60 p-3"
          >
            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`statLabel-${row.key}`}>Stat name</Label>
                {row.custom || suggestions.length === 0 ? (
                  <Input
                    id={`statLabel-${row.key}`}
                    name="statLabel"
                    placeholder="e.g. Agility Score"
                    defaultValue={row.label ?? ""}
                  />
                ) : (
                  <Select
                    name="statLabel"
                    defaultValue={row.label}
                    onValueChange={(value: string | null) => {
                      if (value === CUSTOM_STAT_VALUE) setStatCustom(row.key, true);
                    }}
                  >
                    <SelectTrigger id={`statLabel-${row.key}`} className="w-full">
                      <SelectValue placeholder="Select a stat" />
                    </SelectTrigger>
                    <SelectContent>
                      {suggestions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                      <SelectItem value={CUSTOM_STAT_VALUE}>Other (custom)&hellip;</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
            {row.custom && suggestions.length > 0 && (
              <button
                type="button"
                onClick={() => setStatCustom(row.key, false)}
                className="w-fit text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
              >
                Choose from list instead
              </button>
            )}
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
