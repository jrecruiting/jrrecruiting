"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import {
  searchPlayersByName,
  linkTeamCoachToPlayer,
  unlinkTeamCoachFromPlayer,
  deleteTeamCoach,
} from "@/actions/team-coaches";
import { PlayerSearchPicker } from "@/components/admin/player-search-picker";

type LinkedPlayer = { id: string; firstName: string; lastName: string };

export function TeamCoachRow({
  teamCoachId,
  coachName,
  linkedPlayers,
}: {
  teamCoachId: string;
  coachName: string;
  linkedPlayers: LinkedPlayer[];
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLink(player: { id: string; firstName: string; lastName: string }) {
    startTransition(async () => {
      await linkTeamCoachToPlayer(teamCoachId, player.id);
      toast.success(`Linked ${player.firstName} ${player.lastName} to ${coachName}.`);
      setShowPicker(false);
    });
  }

  function handleUnlink(player: LinkedPlayer) {
    startTransition(async () => {
      await unlinkTeamCoachFromPlayer(teamCoachId, player.id);
      toast.success(`Unlinked ${player.firstName} ${player.lastName} from ${coachName}.`);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTeamCoach(teamCoachId);
      toast.success(`${coachName}'s account was removed.`);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {linkedPlayers.length === 0 ? (
          <span className="text-xs text-muted-foreground">No athletes linked yet.</span>
        ) : (
          linkedPlayers.map((player) => (
            <Badge key={player.id} variant="secondary" className="gap-1 pr-1">
              {player.firstName} {player.lastName}
              <button
                type="button"
                aria-label={`Unlink ${player.firstName} ${player.lastName}`}
                disabled={isPending}
                onClick={() => handleUnlink(player)}
                className="rounded-full p-0.5 hover:bg-black/10"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </Badge>
          ))
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-border/60"
          onClick={() => setShowPicker((v) => !v)}
        >
          {showPicker ? "Cancel" : "Link Another Athlete"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" size="sm" disabled={isPending}>
                Delete Account
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {coachName}&apos;s account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes their login and all athlete links. This can&apos;t be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {showPicker && (
        <PlayerSearchPicker
          searchAction={searchPlayersByName}
          onSelect={handleLink}
          selectLabel="Link"
          disabledIds={new Set(linkedPlayers.map((p) => p.id))}
        />
      )}
    </div>
  );
}
