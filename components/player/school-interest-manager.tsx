"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { SchoolInterestFormState } from "@/actions/school-interest";
import { X } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

type SchoolInterestItem = {
  id: string;
  schoolName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
};

function RemoveSchoolInterestButton({
  schoolInterestId,
  schoolName,
  removeAction,
}: {
  schoolInterestId: string;
  schoolName: string;
  removeAction: (schoolInterestId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await removeAction(schoolInterestId);
      toast.success(`${schoolName} removed.`);
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleRemove}
      aria-label={`Remove ${schoolName}`}
    >
      <X className="h-4 w-4" aria-hidden />
    </Button>
  );
}

export function SchoolInterestManager({
  schoolInterests,
  addAction,
  removeAction,
  showStatus = false,
}: {
  schoolInterests: SchoolInterestItem[];
  addAction: (state: SchoolInterestFormState, formData: FormData) => Promise<SchoolInterestFormState>;
  removeAction: (schoolInterestId: string) => Promise<void>;
  // Admin sees PENDING/REJECTED entries too (needs to review them); parents
  // only ever see entries they submitted, so the status still matters to
  // them (e.g. "pending review"), just shown the same way either side.
  showStatus?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(addAction, undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label>Schools in Contact</Label>

      {schoolInterests.length > 0 && (
        <ul className="flex flex-col gap-2">
          {schoolInterests.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{entry.schoolName}</span>
                {showStatus && (
                  <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
                )}
              </div>
              <RemoveSchoolInterestButton
                schoolInterestId={entry.id}
                schoolName={entry.schoolName}
                removeAction={removeAction}
              />
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="schoolInterestName" className="sr-only">
            School name
          </Label>
          <Input
            id="schoolInterestName"
            name="schoolName"
            placeholder="e.g. University of Michigan"
            required
          />
        </div>
        <Button type="submit" disabled={isPending} variant="outline" className="border-border/60">
          {isPending ? "Adding..." : "Add School"}
        </Button>
      </form>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </div>
  );
}
