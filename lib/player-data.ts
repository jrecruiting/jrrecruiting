import { prisma } from "@/lib/prisma";
import { playerFormSchema, type PlayerFormValues } from "@/lib/validations/player";

export function parsePlayerForm(formData: FormData): PlayerFormValues {
  const raw = Object.fromEntries(formData.entries());

  // Sports are submitted as repeated same-name fields (one pair per sport
  // row in the form), so they need to be zipped back into an array before
  // validation instead of collapsing to the last entry like a plain object
  // spread would.
  const sportIds = formData.getAll("sportId").map(String);
  const positions = formData.getAll("position").map(String);
  const sports = sportIds.map((sportId, i) => ({ sportId, position: positions[i] ?? "" }));

  return playerFormSchema.parse({ ...raw, sports });
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

export async function syncPlayerSportsAndVideo(playerId: string, data: PlayerFormValues) {
  const submittedSportIds = data.sports.map((s) => s.sportId);

  // Drop any sport the parent/admin removed from this profile.
  await prisma.playerSport.deleteMany({
    where: { playerId, sportId: { notIn: submittedSportIds } },
  });

  // The first sport entered is treated as primary; upsert preserves each
  // sport's existing stats JSON (not editable from this form) and just
  // updates position/isPrimary.
  for (const [index, sport] of data.sports.entries()) {
    await prisma.playerSport.upsert({
      where: { playerId_sportId: { playerId, sportId: sport.sportId } },
      update: { position: sport.position || null, isPrimary: index === 0 },
      create: {
        playerId,
        sportId: sport.sportId,
        position: sport.position || null,
        isPrimary: index === 0,
      },
    });
  }

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

/** Formats total inches (as stored) into feet'inches" for display, e.g. 74 -> 6'2". */
export function formatHeight(heightIn: number): string {
  const feet = Math.floor(heightIn / 12);
  const inches = heightIn % 12;
  return `${feet}'${inches}"`;
}
