"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
        <Button
          variant="outline"
          size="sm"
          className="border-border/60"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await unstarPlayer(playerId);
            })
          }
        >
          Unstar
        </Button>
      </div>
    </div>
  );
}
