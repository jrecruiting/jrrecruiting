"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  X,
  IdentificationCard,
  Ruler,
  Image as ImageIcon,
  FilmSlate,
  AddressBook,
  NotePencil,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

// Same icon-header treatment already used on the coach-facing profile page
// (components/coach/player-profile-sections.tsx) -- a long form reads as a
// wall of identical fields without it, and reusing the same icons per
// section (Ruler for measurables, FilmSlate for video, etc.) keeps the form
// and the profile it produces visually consistent.
function FormSection({
  icon: SectionIcon,
  label,
  children,
}: {
  icon: Icon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold">
          <SectionIcon className="h-3.5 w-3.5" weight="duotone" />
        </span>
        <h2 className="text-xs font-bold uppercase tracking-wide">{label}</h2>
      </div>
      {children}
    </div>
  );
}

type SportOption = { id: string; name: string };

type VideoRow = { key: string; url?: string; title?: string };

type PlayerDefaults = {
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  playerType?: "HIGH_SCHOOL" | "JUCO" | "TRANSFER";
  gradYear?: number | null;
  country?: string;
  state?: string | null;
  schoolName?: string | null;
  heightFeet?: number | null;
  heightInches?: number | null;
  weightLb?: number | null;
  gpa?: string | number | null;
  bio?: string | null;
  primaryPhotoUrl?: string | null;
  extraPhotos?: string[];
  photoConsent?: boolean;
  sportId?: string;
  position?: string | null;
  videos?: { url: string; title?: string | null }[];
  instagramHandle?: string | null;
  xHandle?: string | null;
  cellPhone?: string | null;
};

export function PlayerForm({
  sports = [],
  showSportField = false,
  action,
  defaultValues,
  submitLabel,
  requireConsentDialog = false,
  promptAnnounceOnSave = false,
}: {
  sports?: SportOption[];
  showSportField?: boolean;
  action: (state: PlayerFormState, formData: FormData) => Promise<PlayerFormState>;
  defaultValues?: PlayerDefaults;
  submitLabel: string;
  requireConsentDialog?: boolean;
  // Editing an existing player directly (admin only) applies immediately --
  // when true, saving pops the same "announce this on the coach home page?"
  // choice the parent-edit approval flow uses, instead of submitting right
  // away. Not used on create, since a new player already gets its own
  // "joined" feed entry.
  promptAnnounceOnSave?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const photoUploadRef = useRef<PhotoUploadHandle>(null);
  const extraPhotoRef1 = useRef<PhotoUploadHandle>(null);
  const extraPhotoRef2 = useRef<PhotoUploadHandle>(null);
  const extraPhotoRef3 = useRef<PhotoUploadHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const announceInputRef = useRef<HTMLInputElement>(null);
  const [playerType, setPlayerType] = useState(defaultValues?.playerType);
  const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
  // Scoped to this component instance (not module-level) so server and
  // client agree on the initial keys during hydration -- both start
  // counting from 0 for the same defaultValues. A module-level counter
  // would carry over mutated state from earlier interactions in the same
  // browser session or dev-server process, producing a server/client key
  // mismatch React can't patch up.
  const videoRowCounterRef = useRef(0);
  function newVideoRowKey() {
    videoRowCounterRef.current += 1;
    return `video-${videoRowCounterRef.current}`;
  }
  const [videoRows, setVideoRows] = useState<VideoRow[]>(() =>
    (defaultValues?.videos ?? []).map((v) => ({
      key: newVideoRowKey(),
      url: v.url,
      title: v.title ?? "",
    }))
  );

  function addVideoRow() {
    setVideoRows((rows) => [...rows, { key: newVideoRowKey() }]);
  }

  function removeVideoRow(key: string) {
    setVideoRows((rows) => rows.filter((r) => r.key !== key));
  }

  function clearAllPhotos() {
    photoUploadRef.current?.clear();
    extraPhotoRef1.current?.clear();
    extraPhotoRef2.current?.clear();
    extraPhotoRef3.current?.clear();
  }

  function submitWithAnnounce(announce: boolean) {
    if (announceInputRef.current) announceInputRef.current.value = String(announce);
    setAnnounceDialogOpen(false);
    formRef.current?.requestSubmit();
  }

  const showGradYear = playerType !== "JUCO" && playerType !== "TRANSFER";

  return (
    <form ref={formRef} action={formAction} className="flex max-w-2xl flex-col gap-6">
      {promptAnnounceOnSave && (
        <input type="hidden" name="announce" ref={announceInputRef} defaultValue="false" />
      )}

      <FormSection icon={IdentificationCard} label="Athlete Info">
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
            <Select
              name="playerType"
              value={playerType}
              onValueChange={(value: string | null) =>
                setPlayerType(value as "HIGH_SCHOOL" | "JUCO" | "TRANSFER" | undefined)
              }
            >
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
          {showGradYear && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gradYear">Graduation year</Label>
              <Input
                id="gradYear"
                name="gradYear"
                type="number"
                min={2024}
                max={2035}
                required
                defaultValue={defaultValues?.gradYear ?? undefined}
              />
            </div>
          )}
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
            <Label htmlFor="schoolName">Name of school</Label>
            <Input
              id="schoolName"
              name="schoolName"
              defaultValue={defaultValues?.schoolName ?? ""}
            />
          </div>
        </div>

        {showSportField && (
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
        )}
      </FormSection>

      <FormSection icon={Ruler} label="Measurables">
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
      </FormSection>

      <FormSection icon={ImageIcon} label="Photos">
        <div className="flex flex-col gap-1.5">
          <Label>Photos (up to 4)</Label>
          <p className="text-xs text-muted-foreground">
            The first photo is used as the profile thumbnail everywhere on the site. All
            uploaded photos rotate on the full profile page coaches see.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoUpload
              ref={photoUploadRef}
              name="primaryPhotoUrl"
              defaultValue={defaultValues?.primaryPhotoUrl}
            />
            <PhotoUpload
              ref={extraPhotoRef1}
              name="extraPhotoUrl"
              defaultValue={defaultValues?.extraPhotos?.[0]}
            />
            <PhotoUpload
              ref={extraPhotoRef2}
              name="extraPhotoUrl"
              defaultValue={defaultValues?.extraPhotos?.[1]}
            />
            <PhotoUpload
              ref={extraPhotoRef3}
              name="extraPhotoUrl"
              defaultValue={defaultValues?.extraPhotos?.[2]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {requireConsentDialog ? (
            <PhotoConsentCheckbox
              defaultChecked={defaultValues?.photoConsent}
              onClearPhoto={clearAllPhotos}
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
      </FormSection>

      <FormSection icon={FilmSlate} label="Highlight Videos">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Video clips</Label>
            <Button type="button" variant="outline" size="sm" onClick={addVideoRow}>
              <Plus className="h-3.5 w-3.5" weight="bold" aria-hidden />
              Add Video
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add as many clips as you&apos;d like -- YouTube, Hudl, Vimeo, or any other link.
            The first video&apos;s title is used as its section heading on the coach-facing
            profile.
          </p>

          {videoRows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-lg border border-border/60 p-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`videoUrl-${row.key}`}>Video URL</Label>
                <Input
                  id={`videoUrl-${row.key}`}
                  name="videoUrl"
                  placeholder="https://youtube.com/... or hudl.com/..."
                  defaultValue={row.url ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`videoTitle-${row.key}`}>Title (optional)</Label>
                <Input
                  id={`videoTitle-${row.key}`}
                  name="videoTitle"
                  placeholder="e.g. Junior Year Highlights"
                  maxLength={100}
                  defaultValue={row.title ?? ""}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeVideoRow(row.key)}
                aria-label="Remove video"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection icon={AddressBook} label="Social & Contact">
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
      </FormSection>

      <FormSection icon={NotePencil} label="Bio">
        <Textarea id="bio" name="bio" rows={5} defaultValue={defaultValues?.bio ?? ""} />
      </FormSection>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {promptAnnounceOnSave ? (
        <>
          <Button
            type="button"
            disabled={isPending}
            className="w-fit bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={() => setAnnounceDialogOpen(true)}
          >
            {isPending ? "Saving..." : submitLabel}
          </Button>

          <AlertDialog open={announceDialogOpen} onOpenChange={setAnnounceDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Announce this update?</AlertDialogTitle>
                <AlertDialogDescription>
                  Saving publishes these changes right away either way. You can also have it
                  show up as a &ldquo;profile updated&rdquo; item in the Recent Activity feed
                  on the coaches&apos; home page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction variant="outline" onClick={() => submitWithAnnounce(false)}>
                  Save only
                </AlertDialogAction>
                <AlertDialogAction
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={() => submitWithAnnounce(true)}
                >
                  Save &amp; announce
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <Button
          type="submit"
          disabled={isPending}
          className="w-fit bg-gold text-gold-foreground hover:bg-gold/90"
        >
          {isPending ? "Saving..." : submitLabel}
        </Button>
      )}
    </form>
  );
}
