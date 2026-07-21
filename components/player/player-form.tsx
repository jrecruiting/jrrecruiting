"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlayerFormState } from "@/actions/players";
import { PLAYER_TYPES } from "@/lib/player-types";
import { PhotoUpload } from "@/components/player/photo-upload";

type SportOption = { id: string; name: string };

type PlayerDefaults = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: "MALE" | "FEMALE";
  playerType?: "HIGH_SCHOOL" | "JUCO" | "TRANSFER";
  gradYear?: number;
  country?: string;
  state?: string | null;
  city?: string | null;
  heightIn?: number | null;
  weightLb?: number | null;
  gpa?: string | number | null;
  bio?: string | null;
  primaryPhotoUrl?: string | null;
  photoConsent?: boolean;
  sportId?: string;
  position?: string | null;
  videoUrl?: string;
};

export function PlayerForm({
  sports,
  action,
  defaultValues,
  submitLabel,
}: {
  sports: SportOption[];
  action: (state: PlayerFormState, formData: FormData) => Promise<PlayerFormState>;
  defaultValues?: PlayerDefaults;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaultValues?.firstName}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" required defaultValue={defaultValues?.lastName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" name="dob" type="date" required defaultValue={defaultValues?.dob} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" defaultValue={defaultValues?.gender}>
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Select gender">
                {(value: string | null) => (value === "MALE" ? "Boy" : value === "FEMALE" ? "Girl" : "Select gender")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Boy</SelectItem>
              <SelectItem value="FEMALE">Girl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="playerType">Player type</Label>
          <Select name="playerType" defaultValue={defaultValues?.playerType}>
            <SelectTrigger id="playerType" className="w-full">
              <SelectValue placeholder="Select player type">
                {(value: string | null) =>
                  PLAYER_TYPES.find((t) => t.value === value)?.label ?? "Select player type"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PLAYER_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gradYear">Graduation year</Label>
          <Input
            id="gradYear"
            name="gradYear"
            type="number"
            min={2024}
            max={2035}
            required
            defaultValue={defaultValues?.gradYear}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country code</Label>
          <Input
            id="country"
            name="country"
            placeholder="US"
            maxLength={2}
            required
            defaultValue={defaultValues?.country ?? "US"}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="state">State/Province code</Label>
          <Input
            id="state"
            name="state"
            placeholder="CA"
            maxLength={2}
            defaultValue={defaultValues?.state ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={defaultValues?.city ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heightIn">Height (in)</Label>
          <Input
            id="heightIn"
            name="heightIn"
            type="number"
            defaultValue={defaultValues?.heightIn ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weightLb">Weight (lb)</Label>
          <Input
            id="weightLb"
            name="weightLb"
            type="number"
            defaultValue={defaultValues?.weightLb ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            name="gpa"
            type="number"
            step="0.01"
            min={0}
            max={5}
            defaultValue={defaultValues?.gpa ?? undefined}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sportId">Sport</Label>
          <Select name="sportId" defaultValue={defaultValues?.sportId}>
            <SelectTrigger id="sportId" className="w-full">
              <SelectValue placeholder="Select sport">
                {(value: string | null) =>
                  sports.find((sport) => sport.id === value)?.name ?? "Select sport"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" defaultValue={defaultValues?.position ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Photo</Label>
        <PhotoUpload name="primaryPhotoUrl" defaultValue={defaultValues?.primaryPhotoUrl} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="videoUrl">Video highlight URL</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          placeholder="https://youtube.com/... or hudl.com/..."
          defaultValue={defaultValues?.videoUrl ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={5} defaultValue={defaultValues?.bio ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="photoConsent"
          name="photoConsent"
          defaultChecked={defaultValues?.photoConsent}
        />
        <Label htmlFor="photoConsent" className="text-sm font-normal">
          I have the right to publish this player&apos;s photo
        </Label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-fit bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
