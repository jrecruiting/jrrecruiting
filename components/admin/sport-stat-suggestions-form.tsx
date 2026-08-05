"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SportStatSuggestionsFormState } from "@/actions/sports";
import { resetSportStatSuggestionsToDefault } from "@/actions/sports";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

type Row = { key: string; value: string };

let rowCounter = 0;
function newRowKey() {
  rowCounter += 1;
  return `row-${rowCounter}`;
}

export function SportStatSuggestionsForm({
  sportId,
  sportName,
  suggestions,
  action,
  hasDefault,
}: {
  sportId: string;
  sportName: string;
  suggestions: string[];
  action: (
    state: SportStatSuggestionsFormState,
    formData: FormData
  ) => Promise<SportStatSuggestionsFormState>;
  hasDefault: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [rows, setRows] = useState<Row[]>(() =>
    suggestions.length > 0
      ? suggestions.map((s) => ({ key: newRowKey(), value: s }))
      : [{ key: newRowKey(), value: "" }]
  );
  const boundReset = resetSportStatSuggestionsToDefault.bind(null, sportId);

  function addRow() {
    setRows((r) => [...r, { key: newRowKey(), value: "" }]);
  }

  function removeRow(key: string) {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.key !== key) : r));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold">{sportName}</h3>
        {hasDefault && (
          <form action={boundReset}>
            <Button type="submit" variant="ghost" size="sm">
              Reset to defaults
            </Button>
          </form>
        )}
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.key} className="flex gap-2">
              <Input
                name="suggestion"
                defaultValue={row.value}
                placeholder="e.g. 40-Yard Dash"
                maxLength={60}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.key)}
                aria-label="Remove suggestion"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-3.5 w-3.5" weight="bold" aria-hidden />
            Add Suggestion
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
