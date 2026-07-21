"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { recordPlayerUpdate } from "@/lib/notifications/player-update";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { buildPlayerData, upsertSportAndVideo } from "@/lib/player-data";
import type { PlayerFormValues } from "@/lib/validations/player";

export async function resolveEditRequest(requestId: string, approve: boolean) {
  const session = await requireRole("ADMIN");

  const request = await prisma.playerEditRequest.findUnique({
    where: { id: requestId },
    include: {
      player: { select: { firstName: true, lastName: true } },
      submitter: { select: { email: true } },
    },
  });
  if (!request) notFound();

  const playerName = `${request.player.firstName} ${request.player.lastName}`;
  const data = request.proposedData as unknown as PlayerFormValues;

  await prisma.$transaction(async (tx) => {
    await tx.playerEditRequest.update({
      where: { id: requestId },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    if (approve) {
      await tx.player.update({ where: { id: request.playerId }, data: buildPlayerData(data) });
    }

    await tx.notification.create({
      data: {
        userId: request.submittedBy,
        type: approve ? "EDIT_APPROVED" : "EDIT_REJECTED",
        payload: { playerId: request.playerId, playerName },
      },
    });

    await tx.emailOutbox.create({
      data: {
        toEmail: request.submitter.email,
        templateKey: approve ? "edit-approved" : "edit-rejected",
        payload: { playerName },
      },
    });
  });

  if (approve) {
    await upsertSportAndVideo(request.playerId, data);
    await recordPlayerUpdate(request.playerId);
  }

  scheduleOutboxFlush();

  revalidatePath("/admin/edit-requests");
  revalidatePath("/admin");
  revalidatePath(`/admin/players/${request.playerId}/edit`);
  revalidatePath(`/dashboard/players/${request.playerId}/edit`);
  revalidatePath("/dashboard");
}
