"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function searchUnclaimedPlayers(query: string) {
  await requireRole("PARENT");
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  return prisma.player.findMany({
    where: {
      parentId: null,
      isAdminAuthored: true,
      OR: [
        { firstName: { contains: trimmed, mode: "insensitive" } },
        { lastName: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    select: { id: true, firstName: true, lastName: true, state: true, country: true, gradYear: true },
    take: 20,
  });
}

export async function requestClaim(playerId: string, note: string) {
  const session = await requireRole("PARENT");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId) notFound();

  const existing = await prisma.claimRequest.findFirst({
    where: { playerId, requestedBy: session.user.id, status: "PENDING" },
  });
  if (existing) return;

  await prisma.claimRequest.create({
    data: { playerId, requestedBy: session.user.id, note: note || null },
  });

  revalidatePath("/dashboard/claim");
}

export async function resolveClaim(claimId: string, approve: boolean) {
  const session = await requireRole("ADMIN");

  const claim = await prisma.claimRequest.findUnique({
    where: { id: claimId },
    include: { player: { select: { firstName: true, lastName: true } } },
  });
  if (!claim) notFound();

  const playerName = `${claim.player.firstName} ${claim.player.lastName}`;

  await prisma.$transaction(async (tx) => {
    await tx.claimRequest.update({
      where: { id: claimId },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    if (approve) {
      await tx.player.update({
        where: { id: claim.playerId },
        data: { parentId: claim.requestedBy },
      });
    }

    await tx.notification.create({
      data: {
        userId: claim.requestedBy,
        type: approve ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
        payload: { playerId: claim.playerId, playerName },
      },
    });
  });

  revalidatePath("/admin/claims");
}
