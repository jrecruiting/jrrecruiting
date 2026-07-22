"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SportFormState } from "@/actions/player-sports";

type SportOption = { id: string; name: string };

export function AddSportForm({
  action,
  availableSports,
}: {
  action: (state: SportFormState, formData: FormData) => Promise<SportFormState>;
  availableSports: SportOption[];
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  if (availableSports.length === 0) return null;

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="add-sportId">Add another sport</Label>
        <Select name="sportId">
          <SelectTrigger id="add-sportId" className="w-full">
            <SelectValue placeholder="Select sport">
              {(value: string | null) =>
                availableSports.find((sport) => sport.id === value)?.name ?? "Select sport"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableSports.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Adding..." : "Add"}
      </Button>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
