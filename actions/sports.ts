"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { sportStatSuggestionsFormSchema } from "@/lib/validations/sport";
import { DEFAULT_SPORT_STAT_SUGGESTIONS } from "@/lib/player-stats";

export type SportStatSuggestionsFormState = { error?: string } | undefined;

export async function updateSportStatSuggestions(
  sportId: string,
  _prevState: SportStatSuggestionsFormState,
  formData: FormData
): Promise<SportStatSuggestionsFormState> {
  await requireRole("ADMIN");

  try {
    const raw = formData
      .getAll("suggestion")
      .map(String)
      .map((v) => v.trim())
      .filter(Boolean);
    // Dedupe case-insensitively, keeping the first casing entered -- two
    // rows that only differ by case would otherwise both show up in the
    // stat-name dropdown as if they were different options.
    const seen = new Set<string>();
    const deduped = raw.filter((v) => {
      const key = v.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const { suggestions } = sportStatSuggestionsFormSchema.parse({ suggestions: deduped });
    await prisma.sport.update({ where: { id: sportId }, data: { statSuggestions: suggestions } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the list for errors." };
    }
    throw error;
  }

  revalidatePath("/admin/stat-suggestions");
  return { error: undefined };
}

export async function resetSportStatSuggestionsToDefault(sportId: string) {
  await requireRole("ADMIN");

  const sport = await prisma.sport.findUnique({ where: { id: sportId }, select: { slug: true } });
  if (!sport) return;

  await prisma.sport.update({
    where: { id: sportId },
    data: { statSuggestions: DEFAULT_SPORT_STAT_SUGGESTIONS[sport.slug] ?? [] },
  });

  revalidatePath("/admin/stat-suggestions");
}
