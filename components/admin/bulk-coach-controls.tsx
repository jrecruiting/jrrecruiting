"use client";

import { useState, useTransition } from "react";
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
import { deleteCoachesBulk } from "@/actions/coaches";
import { toast } from "sonner";

// The checkboxes themselves are plain inputs rendered by the (server) page next
// to each pending coach; this component just reads and toggles them by name,
// so the page can stay a server component with no per-row client state.
const CHECKBOX_SELECTOR = 'input[name="bulk-coach"]';

function checkboxes() {
  return Array.from(document.querySelectorAll<HTMLInputElement>(CHECKBOX_SELECTOR));
}

function selectedIds() {
  return checkboxes()
    .filter((box) => box.checked)
    .map((box) => box.value);
}

export function BulkCoachControls({ pendingCount }: { pendingCount: number }) {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  if (pendingCount === 0) return null;

  function setAll(checked: boolean) {
    checkboxes().forEach((box) => {
      box.checked = checked;
    });
  }

  function handleDelete() {
    const ids = selectedIds();
    startTransition(async () => {
      const deleted = await deleteCoachesBulk(ids);
      toast.success(`${deleted} coach account${deleted === 1 ? "" : "s"} removed.`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => setAll(true)}>
        Select all pending
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => setAll(false)}>
        Clear selection
      </Button>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => setCount(selectedIds().length)}
            >
              Delete selected
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {count === 0
                ? "Nothing selected"
                : `Delete ${count} coach account${count === 1 ? "" : "s"}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {count === 0
                ? "Tick the boxes next to the sign-ups you want to remove, or use Select all pending, then try again."
                : "This permanently removes the selected pending coach accounts. They are deleted without sending any email, and this can't be undone. Approved coaches are never affected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{count === 0 ? "Close" : "Cancel"}</AlertDialogCancel>
            {count > 0 && (
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete {count}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
