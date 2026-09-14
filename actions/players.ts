"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";
import {
  parseCreatePlayerForm,
  parseUpdatePlayerForm,
  buildPlayerData,
  syncVideos,
  syncPhotos,
  guessVideoProvider,
} from "@/lib/player-data";

export type PlayerFormState = { error?: string } | undefined;

// ── Admin ────────────────────────────────────────────────

export async function createPlayerAdmin(
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("ADMIN");

  let playerId: string;
  try {
    const data = parseCreatePlayerForm(formData);

    const player = await prisma.player.create({
      data: {
        ...buildPlayerData(data),
        isAdminAuthored: true,
        createdByAdminId: session.user.id,
        listingStatus: "ACTIVE",
        publishedAt: new Date(),
        sports: {
          create: { sportId: data.sportId, position: data.position || null, isPrimary: true },
        },
        media:
          data.videos.length > 0
            ? {
                create: data.videos.map((v, i) => ({
                  type: "VIDEO" as const,
                  provider: guessVideoProvider(v.url),
                  url: v.url,
                  title: v.title || null,
                  notes: v.notes || null,
                  sortOrder: i,
                })),
              }
            : undefined,
      },
    });
    playerId = player.id;
    await syncPhotos(playerId, data.extraPhotos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/admin/players");
  redirect(`/admin/players/${playerId}/edit`);
}

export async function updatePlayerAdmin(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("ADMIN");

  try {
    const data = parseUpdatePlayerForm(formData);

    // Guards against the same class of bug the edit-request approval flow
    // had (see syncVideos in lib/player-data.ts): this form's data reflects
    // whatever the browser had loaded, which isn't always "right now" --
    // the browser's own back/forward cache can resurrect an older render
    // of this exact page (from before a change was made in another tab or
    // a later visit) and resubmit its stale state. formLoadedAt, set
    // client-side when this form instance mounted, is how the server tells
    // a stale submission apart from a fresh one.
    const formLoadedAtRaw = Number(formData.get("formLoadedAt"));
    const protectSince = formLoadedAtRaw ? new Date(formLoadedAtRaw) : undefined;

    // Videos/photos are protected row-by-row inside syncVideos/syncPhotos
    // (each has its own updatedAt), but the profile fields below --bio,
    // GPA, measurables, etc.-- all live on one Player row with a single
    // timestamp, so there's no way to merge at the field level: it's not
    // possible to tell which specific field changed, only that *something*
    // did. Rather than silently overwrite a change made elsewhere with
    // this stale form's older values, refuse the whole save and ask the
    // admin to reload -- the same conflict a wiki or shared doc surfaces
    // when two edits collide, instead of quietly discarding one of them.
    // parentId is also needed below regardless of protectSince, to know
    // whether there's a linked parent account to save the parent's cell
    // number to.
    const current = await prisma.player.findUnique({
      where: { id: playerId },
      select: { profileUpdatedAt: true, parentId: true },
    });
    if (protectSince && current && current.profileUpdatedAt > protectSince) {
      return {
        error:
          "This player's profile was updated elsewhere after you opened this page, so saving now could overwrite that change. Please reload the page and reapply your edit.",
      };
    }

    // profileUpdatedAt (distinct from the general updatedAt) marks this as a
    // real edit to the profile fields, so a pending edit request submitted
    // before this save can be flagged stale on the review page.
    await prisma.player.update({
      where: { id: playerId },
      data: { ...buildPlayerData(data), profileUpdatedAt: new Date() },
    });

    await syncVideos(playerId, data.videos, protectSince);
    await syncPhotos(playerId, data.extraPhotos, protectSince);
    await recordPlayerUpdate(playerId);

    // Only meaningful when a real parent account is linked -- an
    // admin-authored player may have none, in which case there's nowhere to
    // save this (the form doesn't show the field in that case either; see
    // showParentPhoneField in PlayerForm).
    if (current?.parentId) {
      await prisma.user.update({
        where: { id: current.parentId },
        data: { cellPhone: data.parentCellPhone || null },
      });
    }

    // A direct admin edit has no PlayerEditRequest of its own to flag --
    // when the admin opts to announce it, log one as self-submitted and
    // self-approved so it flows through the same "announced" feed query as
    // an approved parent edit, without a separate announcement mechanism.
    if (formData.get("announce") === "true") {
      await prisma.playerEditRequest.create({
        data: {
          playerId,
          submittedBy: session.user.id,
          proposedData: data,
          status: "APPROVED",
          resolvedAt: new Date(),
          resolvedBy: session.user.id,
          announced: true,
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath(`/admin/players/${playerId}/edit`);
  revalidatePath("/admin/players");
  revalidatePath("/home");
  return { error: undefined };
}

export async function deletePlayerAdmin(playerId: string) {
  await requireRole("ADMIN");
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

// ── Parent ───────────────────────────────────────────────

export async function createPlayerParent(
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("PARENT");

  let playerId: string;
  try {
    const data = parseCreatePlayerForm(formData);

    const player = await prisma.player.create({
      data: {
        ...buildPlayerData(data),
        parentId: session.user.id,
        isAdminAuthored: false,
        listingStatus: "DRAFT",
        sports: {
          create: { sportId: data.sportId, position: data.position || null, isPrimary: true },
        },
        media:
          data.videos.length > 0
            ? {
                create: data.videos.map((v, i) => ({
                  type: "VIDEO" as const,
                  provider: guessVideoProvider(v.url),
                  url: v.url,
                  title: v.title || null,
                  notes: v.notes || null,
                  sortOrder: i,
                })),
              }
            : undefined,
      },
    });
    playerId = player.id;
    await syncPhotos(playerId, data.extraPhotos);

    // The parent's own number lives on their account, not this player (see
    // parentCellPhone in lib/validations/player.ts) -- applied immediately
    // rather than staged, since it's the parent's own contact info, not
    // something about the athlete that needs admin review.
    await prisma.user.update({
      where: { id: session.user.id },
      data: { cellPhone: data.parentCellPhone || null },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/players/${playerId}/payment`);
}

export async function requireOwnedPlayer(playerId: string, parentId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== parentId) notFound();
  return player;
}

export async function updatePlayerParent(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const session = await requireRole("PARENT");
  const player = await requireOwnedPlayer(playerId, session.user.id);

  try {
    const data = parseUpdatePlayerForm(formData);

    // The parent's own number lives on their account, not this player --
    // applied immediately rather than staged below, since it's the
    // parent's own contact info, not something about the athlete that
    // needs admin review. See createPlayerParent's identical reasoning.
    await prisma.user.update({
      where: { id: session.user.id },
      data: { cellPhone: data.parentCellPhone || null },
    });

    // Parent edits are staged for admin review rather than applied directly,
    // so coaches watching this player aren't notified until an admin approves
    // the change. Resubmitting while a request is still pending replaces it
    // rather than piling up duplicates.
    const existing = await prisma.playerEditRequest.findFirst({
      where: { playerId, status: "PENDING" },
    });

    if (existing) {
      await prisma.playerEditRequest.update({
        where: { id: existing.id },
        data: { proposedData: data, submittedBy: session.user.id, createdAt: new Date() },
      });
    } else {
      await prisma.playerEditRequest.create({
        data: { playerId, submittedBy: session.user.id, proposedData: data },
      });
    }

    await prisma.emailOutbox.create({
      data: {
        toEmail: ADMIN_EMAIL,
        templateKey: "new-edit-request",
        payload: {
          playerName: `${player.firstName} ${player.lastName}`,
          submitterName: session.user.name,
          submitterEmail: session.user.email,
        },
      },
    });
    scheduleOutboxFlush();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  revalidatePath(`/dashboard/players/${playerId}/edit`);
  revalidatePath("/dashboard");
  return { error: undefined };
}

export async function deletePlayerParent(playerId: string) {
  const session = await requireRole("PARENT");
  await requireOwnedPlayer(playerId, session.user.id);
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
