"use client";

import { useRef, useState } from "react";
import { createAnnouncement } from "@/actions/announcements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PlayerOption = { id: string; name: string };

export function AnnouncementForm({ players }: { players: PlayerOption[] }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  function insertLink() {
    const player = players.find((p) => p.id === selectedPlayerId);
    const textarea = textareaRef.current;
    if (!player || !textarea) return;

    const snippet = `[${player.name}](/players/${player.id})`;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    textarea.value = textarea.value.slice(0, start) + snippet + textarea.value.slice(end);
    textarea.focus();
    const cursor = start + snippet.length;
    textarea.setSelectionRange(cursor, cursor);
  }

  return (
    <form action={createAnnouncement} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Big weekend for our 2027 QBs"
          maxLength={120}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Message</Label>
        <Textarea ref={textareaRef} id="body" name="body" rows={4} maxLength={2000} required />
      </div>

      {players.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Link an athlete&apos;s name</Label>
          <div className="flex gap-2">
            <Select
              value={selectedPlayerId ?? undefined}
              onValueChange={(v) => setSelectedPlayerId(String(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an athlete">
                  {(value: string | null) =>
                    players.find((p) => p.id === value)?.name ?? "Choose an athlete"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 border-border/60"
              disabled={!selectedPlayerId}
              onClick={insertLink}
            >
              Insert Link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Place your cursor where you want the name, choose an athlete, then click Insert
            Link. It&apos;ll link straight to their profile on the coach view.
          </p>
        </div>
      )}

      <Button type="submit" className="w-fit bg-gold text-gold-foreground hover:bg-gold/90">
        Post Announcement
      </Button>
    </form>
  );
}
