import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { renderEmailTemplate } from "@/lib/email/templates";

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 25;

/**
 * Schedules a fire-and-forget flush of the email outbox after the current
 * request/action finishes responding. Safe to call after any code path that
 * inserts EmailOutbox rows (e.g. via prisma.emailOutbox.create/createMany).
 */
export function scheduleOutboxFlush() {
  after(() => flushPendingOutbox());
}

async function sendOutboxRow(row: {
  id: string;
  toEmail: string;
  templateKey: string;
  payload: unknown;
}) {
  if (!resend) throw new Error("Resend is not configured (missing RESEND_API_KEY)");

  const template = renderEmailTemplate(
    row.templateKey,
    (row.payload as Record<string, unknown>) ?? {}
  );
  if (!template) throw new Error(`Unknown email template: ${row.templateKey}`);

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: row.toEmail,
    subject: template.subject,
    react: template.react,
  });

  if (result.error) throw new Error(result.error.message);
}

/**
 * Sends every PENDING email, plus FAILED ones under the retry cap. Used both
 * as the near-real-time fire-and-forget path (via scheduleOutboxFlush) and
 * as the safety-net cron sweep for anything that path missed.
 */
export async function flushPendingOutbox() {
  if (!resend) return { sent: 0, failed: 0, skipped: true };

  const rows = await prisma.emailOutbox.findMany({
    where: {
      OR: [{ status: "PENDING" }, { status: "FAILED", attempts: { lt: MAX_ATTEMPTS } }],
    },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE,
  });

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await sendOutboxRow(row);
      await prisma.emailOutbox.update({
        where: { id: row.id },
        data: { status: "SENT", sentAt: new Date() },
      });
      sent += 1;
    } catch (error) {
      await prisma.emailOutbox.update({
        where: { id: row.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: error instanceof Error ? error.message : String(error),
        },
      });
      failed += 1;
    }
  }

  return { sent, failed, skipped: false };
}
