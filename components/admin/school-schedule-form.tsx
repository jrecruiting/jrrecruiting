"use client";

import { createSchoolSchedule } from "@/actions/school-schedules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SchoolScheduleForm({ schoolNames }: { schoolNames: string[] }) {
  return (
    <form action={createSchoolSchedule} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="schoolName">School</Label>
        <Select name="schoolName">
          <SelectTrigger className="w-full" id="schoolName">
            <SelectValue placeholder="Choose a school" />
          </SelectTrigger>
          <SelectContent>
            {schoolNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Only schools currently on file for an athlete are listed, so the link can&apos;t end up
          attached to a name no one actually has.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scheduleUrl">Schedule URL</Label>
        <Input
          id="scheduleUrl"
          name="scheduleUrl"
          type="url"
          placeholder="https://www.maxpreps.com/..."
          required
        />
      </div>
      <Button type="submit" className="w-fit bg-gold text-gold-foreground hover:bg-gold/90">
        Save Schedule Link
      </Button>
    </form>
  );
}
