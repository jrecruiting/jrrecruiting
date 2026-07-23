"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLAYER_PROJECTIONS } from "@/lib/player-projections";
import { setSportProjectionAdmin } from "@/actions/player-sports";
import { toast } from "sonner";

export function ProjectionQuickSelect({
  playerId,
  sportId,
  sportName,
  projections,
}: {
  playerId: string;
  sportId: string;
  sportName: string;
  projections: string[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string[] | null) {
    startTransition(async () => {
      await setSportProjectionAdmin(playerId, sportId, value ?? []);
      toast.success(`${sportName} projection updated.`);
    });
  }

  return (
    <Select multiple value={projections} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        className="h-7 min-w-[90px] max-w-[160px] text-xs"
        aria-label={`${sportName} projection`}
      >
        <SelectValue placeholder="—">
          {(value: string[] | null) =>
            value && value.length > 0
              ? value.map((v) => PLAYER_PROJECTIONS.find((p) => p.value === v)?.label ?? v).join(", ")
              : "—"
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
  );
}
