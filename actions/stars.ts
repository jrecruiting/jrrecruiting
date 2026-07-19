"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function toggleStar(playerId: string): Promise<{ starred: boolean }> {
  const session = await requireRole("COACH");

  const existing = await prisma.star.findUnique({
    where: { coachId_playerId: { coachId: session.user.id, playerId } },
  });

  if (existing) {
    await prisma.star.delete({ where: { id: existing.id } });
    revalidatePath("/search");
    revalidatePath("/coach/dashboard/starred");
    return { starred: false };
  }

  await prisma.star.create({
    data: { coachId: session.user.id, playerId, notifyOnUpdate: false },
  });
  revalidatePath("/search");
  revalidatePath("/coach/dashboard/starred");
  return { starred: true };
}

export async function setNotifyOnUpdate(playerId: string, notify: boolean) {
  const session = await requireRole("COACH");

  await prisma.star.updateMany({
    where: { coachId: session.user.id, playerId },
    data: { notifyOnUpdate: notify },
  });

  revalidatePath("/coach/dashboard/starred");
}

export async function unstarPlayer(playerId: string) {
  const session = await requireRole("COACH");
  await prisma.star.deleteMany({ where: { coachId: session.user.id, playerId } });
  revalidatePath("/coach/dashboard/starred");
  revalidatePath("/search");
}
