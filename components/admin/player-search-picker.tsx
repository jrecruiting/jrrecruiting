"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PlayerResult = { id: string; firstName: string; lastName: string; gradYear: number | null };

export function PlayerSearchPicker({
  searchAction,
  onSelect,
  selectLabel = "Select",
  disabledIds,
}: {
  searchAction: (query: string) => Promise<PlayerResult[]>;
  onSelect: (player: PlayerResult) => void;
  selectLabel?: string;
  disabledIds?: Set<string>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch() {
    startTransition(async () => {
      const found = await searchAction(query);
      setResults(found);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search athlete by name"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-border/60"
          onClick={handleSearch}
          disabled={isPending || query.trim().length < 2}
        >
          Search
        </Button>
      </div>

      {results !== null && (
        <div className="flex flex-col gap-1.5">
          {results.length === 0 ? (
            <p className="text-xs text-muted-foreground">No athletes match that name.</p>
          ) : (
            results.map((player) => {
              const isDisabled = disabledIds?.has(player.id) ?? false;
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2.5 py-1.5 text-sm"
                >
                  <span>
                    {player.firstName} {player.lastName}
                    {player.gradYear != null ? ` · Class of ${player.gradYear}` : ""}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isDisabled}
                    onClick={() => onSelect(player)}
                  >
                    {isDisabled ? "Already linked" : selectLabel}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
