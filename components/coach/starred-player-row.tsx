"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { setNotifyOnUpdate, unstarPlayer } from "@/actions/stars";
import { toast } from "sonner";

export function StarredPlayerRow({
  playerId,
  name,
  detail,
  notifyOnUpdate,
}: {
  playerId: string;
  name: string;
  detail: string;
  notifyOnUpdate: boolean;
}) {
  const [notify, setNotify] = useState(notifyOnUpdate);
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    setNotify(checked);
    startTransition(async () => {
      await setNotifyOnUpdate(playerId, checked);
      toast.success(checked ? "You'll be emailed on updates." : "Update emails turned off.");
    });
  }

  function handleUnstar() {
    startTransition(async () => {
      await unstarPlayer(playerId);
      toast.success(`${name} removed from your starred players.`);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <Link href={`/players/${playerId}`} className="font-medium hover:text-gold">
          {name}
        </Link>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={notify}
            disabled={isPending}
            onCheckedChange={(checked) => handleToggle(checked === true)}
          />
          Email on update
        </label>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="outline" size="sm" className="border-border/60" disabled={isPending}>
                Unstar
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unstar {name}?</AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;ll stop getting notified about updates to this profile unless you
                star it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleUnstar}
              >
                Unstar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
