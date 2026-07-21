import { prisma } from "@/lib/prisma";
import { playerFormSchema, type PlayerFormValues } from "@/lib/validations/player";

export function parsePlayerForm(formData: FormData): PlayerFormValues {
  const raw = Object.fromEntries(formData.entries());
  return playerFormSchema.parse(raw);
}

export function buildPlayerData(data: PlayerFormValues) {
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
    bio: data.bio || null,
    primaryPhotoUrl: data.primaryPhotoUrl || null,
    photoConsent: Boolean(data.photoConsent),
    instagramHandle: data.instagramHandle || null,
    xHandle: data.xHandle || null,
    cellPhone: data.cellPhone || null,
  };
}

export async function upsertSportAndVideo(playerId: string, data: PlayerFormValues) {
  await prisma.playerSport.upsert({
    where: { playerId_sportId: { playerId, sportId: data.sportId } },
    update: { position: data.position || null },
    create: {
      playerId,
      sportId: data.sportId,
      position: data.position || null,
      isPrimary: true,
    },
  });

  if (data.videoUrl) {
    const existing = await prisma.mediaAsset.findFirst({
      where: { playerId, type: "VIDEO", url: data.videoUrl },
    });
    if (!existing) {
      await prisma.mediaAsset.create({
        data: {
          playerId,
          type: "VIDEO",
          provider: guessVideoProvider(data.videoUrl),
          url: data.videoUrl,
        },
      });
    }
  }
}

export function guessVideoProvider(url: string): "YOUTUBE" | "HUDL" | "VIMEO" | "OTHER" {
  if (/youtube\.com|youtu\.be/.test(url)) return "YOUTUBE";
  if (/hudl\.com/.test(url)) return "HUDL";
  if (/vimeo\.com/.test(url)) return "VIMEO";
  return "OTHER";
}
