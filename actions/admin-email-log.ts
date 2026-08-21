"use server";

import { randomBytes, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { resendOutboxRow } from "@/lib/email/send";
import { APP_URL } from "@/lib/email/resend";
import { WELCOME_TOKEN_TTL_MS } from "@/lib/email/token-ttl";

export async function resendEmail(rowId: string): Promise<void> {
  await requireRole("ADMIN");

  const row = await prisma.emailOutbox.findUnique({ where: { id: rowId } });
  if (!row) return;

  // Welcome emails carry a time-limited set-password link. Resending is
  // often prompted by "they say they never got it," which by definition
  // means enough time has passed to be worth re-sending -- possibly past
  // the original link's expiry -- so this generates a fresh token instead
  // of re-firing a link that may already be dead.
  if (row.templateKey === "coach-welcome") {
    const user = await prisma.user.findUnique({ where: { email: row.toEmail } });
    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + WELCOME_TOKEN_TTL_MS),
        },
      });
      await prisma.emailOutbox.update({
        where: { id: row.id },
        data: {
          payload: {
            coachName: user.name,
            setPasswordUrl: `${APP_URL}/reset-password?token=${token}`,
          },
        },
      });
    }
  }

  await resendOutboxRow(rowId);
  revalidatePath("/admin/email-log");
}
