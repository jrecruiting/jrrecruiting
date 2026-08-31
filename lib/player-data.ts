import { prisma } from "@/lib/prisma";
import {
  createPlayerFormSchema,
  updatePlayerFormSchema,
  sportDetailsFormSchema,
  type CreatePlayerFormValues,
  type UpdatePlayerFormValues,
  type SportDetailsFormValues,
} from "@/lib/validations/player";

// Extra photo slots submit as repeated same-name hidden inputs (one per
// upload slot, same pattern as stats/projections below), including empty
// ones for slots the parent never filled -- filter those out here so the
// schema always sees a compact ordered list.
function extraPhotosFromFormData(formData: FormData): string[] {
  return formData
    .getAll("extraPhotoUrl")
    .map(String)
    .map((v) => v.trim())
    .filter(Boolean);
}

// Video rows submit as repeated same-name url/title inputs (one pair per
// row in the form's "Add Video" repeater), so they need to be zipped back
// into an array before validation, same as stats' label/value pairs. Rows
// with no URL are dropped rather than validated, since an empty row just
// means the parent added then didn't fill in a slot.
function videosFromFormData(formData: FormData): { url: string; title?: string; notes?: string }[] {
  const urls = formData.getAll("videoUrl").map(String);
  const titles = formData.getAll("videoTitle").map(String);
  // Submitted as a hidden input on the parent-facing form (no visible field
  // there) so a parent's resubmission round-trips an admin's existing notes
  // unchanged instead of quietly wiping them out.
  const notesList = formData.getAll("videoNotes").map(String);
  return urls
    .map((url, i) => ({
      url: url.trim(),
      title: (titles[i] ?? "").trim(),
      notes: (notesList[i] ?? "").trim(),
    }))
    .filter((v) => v.url);
}

export function parseCreatePlayerForm(formData: FormData): CreatePlayerFormValues {
  return createPlayerFormSchema.parse({
    ...Object.fromEntries(formData.entries()),
    extraPhotos: extraPhotosFromFormData(formData),
    videos: videosFromFormData(formData),
  });
}

export function parseUpdatePlayerForm(formData: FormData): UpdatePlayerFormValues {
  return updatePlayerFormSchema.parse({
    ...Object.fromEntries(formData.entries()),
    extraPhotos: extraPhotosFromFormData(formData),
    videos: videosFromFormData(formData),
  });
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

  // The projections Select submits multiple same-name hidden inputs when
  // more than one is picked (e.g. FCS and D2), so collect all of them.
  const projections = formData.getAll("projections").map(String);

  return sportDetailsFormSchema.parse({ ...raw, projections, stats });
}

export function buildPlayerData(data: UpdatePlayerFormValues) {
  const hasHeight = data.heightFeet != null || data.heightInches != null;

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    playerType: data.playerType,
    gradYear: data.gradYear ?? null,
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

// Reconciles a player's video MediaAsset rows (type VIDEO) to exactly match
// the submitted ordered list of {url, title, notes} entries -- same
// match-by-url, delete-what's-gone, rewrite-sortOrder approach as
// syncPhotos, plus title/notes updates for rows that kept the same URL.
//
// `protectSince` guards against a real bug: approving a parent's edit
// request replays a *snapshot* taken when they loaded their form, which
// goes stale the moment an admin makes a direct edit to the same player
// afterward -- e.g. adding a video, or setting notes on one -- while that
// request sits pending. Approving it later would otherwise blindly delete
// the video the stale snapshot never knew about, or reset its notes back
// to whatever the snapshot had. When set (edit-request approval passes the
// request's createdAt), a row touched more recently than that cutoff is
// left alone: not deleted even if the snapshot omits it, and not
// overwritten even if the snapshot's title/notes differ. Direct saves
// (admin/parent forms) don't pass this -- there's no snapshot staleness
// risk when the data came from the live form just submitted.
export async function syncVideos(
  playerId: string,
  videos: { url: string; title?: string; notes?: string }[],
  protectSince?: Date
) {
  const existing = await prisma.mediaAsset.findMany({
    where: { playerId, type: "VIDEO" },
  });
  const existingByUrl = new Map(existing.map((m) => [m.url, m]));
  const keep = new Set(videos.map((v) => v.url));
  const isProtected = (m: (typeof existing)[number]) =>
    protectSince != null && m.updatedAt > protectSince;

  const toDelete = existing.filter((m) => !keep.has(m.url) && !isProtected(m));
  if (toDelete.length > 0) {
    await prisma.mediaAsset.deleteMany({ where: { id: { in: toDelete.map((m) => m.id) } } });
  }

  // sortOrder still needs to make room for protected rows the incoming
  // list doesn't know about, so they don't end up sharing a position with
  // one of the submitted videos -- append them after everything submitted.
  let nextSortOrder = videos.length;

  for (let i = 0; i < videos.length; i++) {
    const { url, title, notes } = videos[i];
    const normalizedTitle = title || null;
    const normalizedNotes = notes || null;
    const existingRow = existingByUrl.get(url);
    if (existingRow) {
      if (isProtected(existingRow)) {
        if (existingRow.sortOrder !== i) {
          await prisma.mediaAsset.update({ where: { id: existingRow.id }, data: { sortOrder: i } });
        }
        continue;
      }
      if (
        existingRow.sortOrder !== i ||
        existingRow.title !== normalizedTitle ||
        existingRow.notes !== normalizedNotes
      ) {
        await prisma.mediaAsset.update({
          where: { id: existingRow.id },
          data: { sortOrder: i, title: normalizedTitle, notes: normalizedNotes },
        });
      }
    } else {
      await prisma.mediaAsset.create({
        data: {
          playerId,
          type: "VIDEO",
          provider: guessVideoProvider(url),
          url,
          title: normalizedTitle,
          notes: normalizedNotes,
          sortOrder: i,
        },
      });
    }
  }

  for (const m of existing) {
    if (isProtected(m) && !keep.has(m.url)) {
      await prisma.mediaAsset.update({ where: { id: m.id }, data: { sortOrder: nextSortOrder } });
      nextSortOrder += 1;
    }
  }
}

// Reconciles a player's extra-photo MediaAsset rows (type PHOTO) to exactly
// match the submitted ordered list -- unlike syncVideo's append-only
// behavior, photo slots can be reordered, replaced, or cleared, so this
// deletes what's no longer present and rewrites sortOrder for the rest.
// See syncVideos above for what protectSince guards against.
export async function syncPhotos(playerId: string, photoUrls: string[], protectSince?: Date) {
  const existing = await prisma.mediaAsset.findMany({
    where: { playerId, type: "PHOTO" },
  });
  const existingByUrl = new Map(existing.map((m) => [m.url, m]));
  const keep = new Set(photoUrls);
  const isProtected = (m: (typeof existing)[number]) =>
    protectSince != null && m.updatedAt > protectSince;

  const toDelete = existing.filter((m) => !keep.has(m.url) && !isProtected(m));
  if (toDelete.length > 0) {
    await prisma.mediaAsset.deleteMany({ where: { id: { in: toDelete.map((m) => m.id) } } });
  }

  let nextSortOrder = photoUrls.length;

  for (let i = 0; i < photoUrls.length; i++) {
    const url = photoUrls[i];
    const existingRow = existingByUrl.get(url);
    if (existingRow) {
      if (existingRow.sortOrder !== i) {
        await prisma.mediaAsset.update({ where: { id: existingRow.id }, data: { sortOrder: i } });
      }
    } else {
      await prisma.mediaAsset.create({
        data: { playerId, type: "PHOTO", provider: "VERCEL_BLOB", url, sortOrder: i },
      });
    }
  }

  for (const m of existing) {
    if (isProtected(m) && !keep.has(m.url)) {
      await prisma.mediaAsset.update({ where: { id: m.id }, data: { sortOrder: nextSortOrder } });
      nextSortOrder += 1;
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
