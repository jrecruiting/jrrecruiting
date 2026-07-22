import { prisma } from "@/lib/prisma";
import {
  createPlayerFormSchema,
  updatePlayerFormSchema,
  sportDetailsFormSchema,
  type CreatePlayerFormValues,
  type UpdatePlayerFormValues,
  type SportDetailsFormValues,
} from "@/lib/validations/player";

export function parseCreatePlayerForm(formData: FormData): CreatePlayerFormValues {
  return createPlayerFormSchema.parse(Object.fromEntries(formData.entries()));
}

export function parseUpdatePlayerForm(formData: FormData): UpdatePlayerFormValues {
  return updatePlayerFormSchema.parse(Object.fromEntries(formData.entries()));
}

export function parseSportDetailsForm(formData: FormData): SportDetailsFormValues {
  const raw = Object.fromEntries(formData.entries());

  // Stats are submitted as repeated same-name fields (one label/value pair
  // per stat row), so they need to be zipped back into an array before
  // validation instead of collapsing to the last entry.
  const labels = formData.getAll("statLabel").map(String);
  const values = formData.getAll("statValue").map(String);
  const stats = labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] ?? "").trim() }))
    .filter((s) => s.label && s.value);

  return sportDetailsFormSchema.parse({ ...raw, stats });
}

export function buildPlayerData(data: UpdatePlayerFormValues) {
  const hasHeight = data.heightFeet != null || data.heightInches != null;

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    playerType: data.playerType,
    gradYear: data.gradYear,
    country: data.country.toUpperCase(),
    state: data.state ? data.state.toUpperCase() : null,
    schoolName: data.schoolName || null,
    heightIn: hasHeight ? (data.heightFeet ?? 0) * 12 + (data.heightInches ?? 0) : null,
    weightLb: data.weightLb ?? null,
    gpa: data.gpa ?? null,
    primaryPhotoUrl: data.primaryPhotoUrl || null,
    photoConsent: Boolean(data.photoConsent),
    instagramHandle: data.instagramHandle || null,
    xHandle: data.xHandle || null,
    cellPhone: data.cellPhone || null,
  };
}

export async function syncVideo(playerId: string, videoUrl: string | undefined) {
  if (!videoUrl) return;

  const existing = await prisma.mediaAsset.findFirst({
    where: { playerId, type: "VIDEO", url: videoUrl },
  });
  if (!existing) {
    await prisma.mediaAsset.create({
      data: {
        playerId,
        type: "VIDEO",
        provider: guessVideoProvider(videoUrl),
        url: videoUrl,
      },
    });
  }
}

export function guessVideoProvider(url: string): "YOUTUBE" | "HUDL" | "VIMEO" | "OTHER" {
  if (/youtube\.com|youtu\.be/.test(url)) return "YOUTUBE";
  if (/hudl\.com/.test(url)) return "HUDL";
  if (/vimeo\.com/.test(url)) return "VIMEO";
  return "OTHER";
}

/** Formats total inches (as stored) into feet'inches" for display, e.g. 74 -> 6'2". */
export function formatHeight(heightIn: number): string {
  const feet = Math.floor(heightIn / 12);
  const inches = heightIn % 12;
  return `${feet}'${inches}"`;
}
