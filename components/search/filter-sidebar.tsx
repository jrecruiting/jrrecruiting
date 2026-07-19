"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PLAYER_TYPES } from "@/lib/player-types";
import { currentSeniorGradYear } from "@/lib/pricing";

const ANY = "any";

const gradYears = Array.from({ length: 6 }, (_, i) => currentSeniorGradYear() + i);

export function FilterSidebar({ sports }: { sports: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumped only on "Clear all" to force the uncontrolled text inputs to
  // remount (and thus drop their stale defaultValue) — normal typing or
  // select changes don't touch this, so focus/typing state is preserved.
  const [resetKey, setResetKey] = useState(0);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === ANY) params.delete(key);
        else params.set(key, value);
      }
      params.delete("page");
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  function handleTextChange(key: string, value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ [key]: value }), 350);
  }

  function clearAll() {
    setResetKey((k) => k + 1);
    startTransition(() => router.replace(pathname));
  }

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Filters
        </h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto p-0 text-xs text-gold">
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-sport">Sport</Label>
        <Select
          value={searchParams.get("sportId") ?? ANY}
          onValueChange={(v) => updateParams({ sportId: v ?? undefined })}
        >
          <SelectTrigger id="filter-sport" className="w-full">
            <SelectValue placeholder="Any sport">
              {(value: string | null) =>
                sports.find((s) => s.id === value)?.name ?? "Any sport"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any sport</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-position">Position</Label>
        <Input
          key={`position-${resetKey}`}
          id="filter-position"
          placeholder="e.g. Pitcher"
          defaultValue={searchParams.get("position") ?? ""}
          onChange={(e) => handleTextChange("position", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-player-type">Player type</Label>
        <Select
          value={searchParams.get("playerType") ?? ANY}
          onValueChange={(v) => updateParams({ playerType: v ?? undefined })}
        >
          <SelectTrigger id="filter-player-type" className="w-full">
            <SelectValue placeholder="Any type">
              {(value: string | null) =>
                PLAYER_TYPES.find((t) => t.value === value)?.label ?? "Any type"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any type</SelectItem>
            {PLAYER_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-gender">Gender</Label>
        <Select
          value={searchParams.get("gender") ?? ANY}
          onValueChange={(v) => updateParams({ gender: v ?? undefined })}
        >
          <SelectTrigger id="filter-gender" className="w-full">
            <SelectValue placeholder="Any">
              {(value: string | null) =>
                value === "MALE" ? "Boy" : value === "FEMALE" ? "Girl" : "Any"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any</SelectItem>
            <SelectItem value="MALE">Boy</SelectItem>
            <SelectItem value="FEMALE">Girl</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-grad-year">Grad year</Label>
        <Select
          value={searchParams.get("gradYear") ?? ANY}
          onValueChange={(v) => updateParams({ gradYear: v ?? undefined })}
        >
          <SelectTrigger id="filter-grad-year" className="w-full">
            <SelectValue placeholder="Any year">
              {(value: string | null) =>
                value && value !== ANY ? `Class of ${value}` : "Any year"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any year</SelectItem>
            {gradYears.map((year) => (
              <SelectItem key={year} value={String(year)}>
                Class of {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-country">Country</Label>
          <Input
            key={`country-${resetKey}`}
            id="filter-country"
            placeholder="US"
            maxLength={2}
            defaultValue={searchParams.get("country") ?? ""}
            onChange={(e) => handleTextChange("country", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-state">State</Label>
          <Input
            key={`state-${resetKey}`}
            id="filter-state"
            placeholder="CA"
            maxLength={2}
            defaultValue={searchParams.get("state") ?? ""}
            onChange={(e) => handleTextChange("state", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
