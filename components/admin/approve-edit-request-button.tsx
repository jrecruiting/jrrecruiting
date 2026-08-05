"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ApproveEditRequestButton({
  approveAndAnnounce,
  approveOnly,
}: {
  approveAndAnnounce: () => Promise<void>;
  approveOnly: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChoice(action: () => Promise<void>) {
    setOpen(false);
    startTransition(action);
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        className="bg-gold text-gold-foreground hover:bg-gold/90"
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {isPending ? "Approving..." : "Approve"}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Announce this update?</AlertDialogTitle>
            <AlertDialogDescription>
              Approving publishes these changes right away either way. You can also have it
              show up as a &ldquo;profile updated&rdquo; item in the Recent Activity feed on
              the coaches&apos; home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="outline" onClick={() => handleChoice(approveOnly)}>
              Approve only
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              onClick={() => handleChoice(approveAndAnnounce)}
            >
              Approve &amp; announce
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
