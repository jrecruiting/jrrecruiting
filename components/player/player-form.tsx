"use client";

import { useActionState, useRef } from "react";
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
import { PhotoUpload, type PhotoUploadHandle } from "@/components/player/photo-upload";
import { PhotoConsentCheckbox } from "@/components/player/photo-consent-checkbox";

type SportOption = { id: string; name: string };

type PlayerDefaults = {
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  playerType?: "HIGH_SCHOOL" | "JUCO" | "TRANSFER";
  gradYear?: number;
  country?: string;
  state?: string | null;
  schoolName?: string | null;
  heightFeet?: number | null;
  heightInches?: number | null;
  weightLb?: number | null;
  gpa?: string | number | null;
  bio?: string | null;
  primaryPhotoUrl?: string | null;
  photoConsent?: boolean;
  sportId?: string;
  position?: string | null;
  videoUrl?: string;
  instagramHandle?: string | null;
  xHandle?: string | null;
  cellPhone?: string | null;
};

export function PlayerForm({
  sports,
  action,
  defaultValues,
  submitLabel,
  requireConsentDialog = false,
}: {
  sports: SportOption[];
  action: (state: PlayerFormState, formData: FormData) => Promise<PlayerFormState>;
  defaultValues?: PlayerDefaults;
  submitLabel: string;
  requireConsentDialog?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const photoUploadRef = useRef<PhotoUploadHandle>(null);

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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label>Height</Label>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-1.5">
              <Input
                id="heightFeet"
                name="heightFeet"
                type="number"
                min={3}
                max={8}
                placeholder="ft"
                aria-label="Height, feet"
                defaultValue={defaultValues?.heightFeet ?? undefined}
              />
              <span className="text-sm text-muted-foreground">ft</span>
            </div>
            <div className="flex flex-1 items-center gap-1.5">
              <Input
                id="heightInches"
                name="heightInches"
                type="number"
                min={0}
                max={11}
                placeholder="in"
                aria-label="Height, inches"
                defaultValue={defaultValues?.heightInches ?? undefined}
              />
              <span className="text-sm text-muted-foreground">in</span>
            </div>
          </div>
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

      <div className="grid gap-4 sm:grid-cols-3">
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
          <Label htmlFor="schoolName">Name of school</Label>
          <Input
            id="schoolName"
            name="schoolName"
            defaultValue={defaultValues?.schoolName ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" defaultValue={defaultValues?.position ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Photo</Label>
        <PhotoUpload
          ref={photoUploadRef}
          name="primaryPhotoUrl"
          defaultValue={defaultValues?.primaryPhotoUrl}
        />
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="instagramHandle">Instagram</Label>
          <Input
            id="instagramHandle"
            name="instagramHandle"
            placeholder="username"
            defaultValue={defaultValues?.instagramHandle ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="xHandle">X (Twitter)</Label>
          <Input
            id="xHandle"
            name="xHandle"
            placeholder="username"
            defaultValue={defaultValues?.xHandle ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cellPhone">Cell number</Label>
          <Input
            id="cellPhone"
            name="cellPhone"
            type="tel"
            placeholder="(555) 555-5555"
            defaultValue={defaultValues?.cellPhone ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={5} defaultValue={defaultValues?.bio ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        {requireConsentDialog ? (
          <PhotoConsentCheckbox
            defaultChecked={defaultValues?.photoConsent}
            onClearPhoto={() => photoUploadRef.current?.clear()}
          />
        ) : (
          <Checkbox
            id="photoConsent"
            name="photoConsent"
            defaultChecked={defaultValues?.photoConsent}
          />
        )}
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
