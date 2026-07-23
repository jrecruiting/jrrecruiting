import { prisma } from "@/lib/prisma";

/**
 * Logs every time a parent opens their own athlete's profile page, so
 * admin can see engagement per player. Unlike coach profile views, this
 * doesn't trigger a notification -- it's purely for admin visibility.
 */
export async function recordParentView(playerId: string, parentId: string) {
  await prisma.parentViewEvent.create({ data: { playerId, parentId } });
}
