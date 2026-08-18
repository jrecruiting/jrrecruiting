"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhotoUpload } from "@/components/player/photo-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SportOption = { id: string; name: string };

type AlumniUpdateDefaults = {
  athleteName?: string;
  sportId?: string;
  schoolName?: string;
  eventDate?: string;
  updateText?: string;
  linkUrl?: string | null;
  photoUrl?: string | null;
  featured?: boolean;
};

export function AlumniUpdateForm({
  sports,
  action,
  defaultValues,
  submitLabel = "Post Update",
}: {
  sports: SportOption[];
  action: (formData: FormData) => void;
  defaultValues?: AlumniUpdateDefaults;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="athleteName">Athlete name</Label>
          <Input
            id="athleteName"
            name="athleteName"
            placeholder="e.g. Collyn Gillies"
            maxLength={120}
            defaultValue={defaultValues?.athleteName}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sportId">Sport</Label>
          <Select name="sportId" defaultValue={defaultValues?.sportId}>
            <SelectTrigger id="sportId" className="w-full">
              <SelectValue placeholder="Choose a sport">
                {(value: string | null) =>
                  sports.find((s) => s.id === value)?.name ?? "Choose a sport"
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="schoolName">School</Label>
          <Input
            id="schoolName"
            name="schoolName"
            placeholder="e.g. Penn State University"
            maxLength={120}
            defaultValue={defaultValues?.schoolName}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eventDate">Date</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={defaultValues?.eventDate}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="updateText">Update</Label>
        <Textarea
          id="updateText"
          name="updateText"
          rows={4}
          maxLength={2000}
          placeholder="e.g. Threw for 285 yards and 3 TDs in Penn State's win over Ohio State this weekend."
          defaultValue={defaultValues?.updateText}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="linkUrl">Link (optional)</Label>
        <Input
          id="linkUrl"
          name="linkUrl"
          type="url"
          placeholder="https://... (article, highlight, box score)"
          defaultValue={defaultValues?.linkUrl ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Photo (optional)</Label>
        <PhotoUpload
          name="photoUrl"
          uploadEndpoint="/api/blob/alumni-photo"
          publicUrl
          defaultValue={defaultValues?.photoUrl}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="featured" name="featured" defaultChecked={defaultValues?.featured} />
        <Label htmlFor="featured" className="font-normal">
          Feature on homepage
        </Label>
      </div>

      <Button type="submit" className="w-fit bg-gold text-gold-foreground hover:bg-gold/90">
        {submitLabel}
      </Button>
    </form>
  );
}
