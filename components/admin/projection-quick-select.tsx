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

const NONE = "none";

export function ProjectionQuickSelect({
  playerId,
  sportId,
  sportName,
  projection,
}: {
  playerId: string;
  sportId: string;
  sportName: string;
  projection: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    startTransition(async () => {
      await setSportProjectionAdmin(playerId, sportId, !value || value === NONE ? "" : value);
      toast.success(`${sportName} projection updated.`);
    });
  }

  return (
    <Select value={projection ?? NONE} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="h-7 w-[100px] text-xs" aria-label={`${sportName} projection`}>
        <SelectValue placeholder="—">
          {(value: string | null) =>
            PLAYER_PROJECTIONS.find((p) => p.value === value)?.label ?? "—"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>—</SelectItem>
        {PLAYER_PROJECTIONS.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
