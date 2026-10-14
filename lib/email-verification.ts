import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { APP_URL, ADMIN_EMAIL } from "@/lib/email/resend";
import { scheduleOutboxFlush } from "@/lib/email/send";
import {
  EMAIL_VERIFICATION_TTL_MS,
  hashVerificationToken,
} from "@/lib/email-verification-status";

export function newVerificationToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashVerificationToken(token),
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
  };
}

export function verificationUrl(token: string) {
  return `${APP_URL}/api/verify-email?token=${token}`;
}

// Replaces any outstanding link with a fresh one (only one works at a time,
// same as password reset) and queues the email. Used for "resend".
export async function issueVerificationEmail(user: { id: string; email: string; name: string }) {
  const { token, tokenHash, expiresAt } = newVerificationToken();

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
    prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
    prisma.emailOutbox.create({
      data: {
        toEmail: user.email,
        templateKey: "verify-email",
        payload: { coachName: user.name, verifyUrl: verificationUrl(token) },
      },
    }),
  ]);
  scheduleOutboxFlush();
}

// Marks every outstanding link for this user as used. If that actually
// un-gated them (they had a pending link), this is the moment a real
// coach-signup becomes visible to the admin, so the "new coach" notification
// goes out now instead of at sign-up. Safe to call repeatedly: returns false
// and does nothing if there was nothing pending.
export async function completeEmailVerification(userId: string): Promise<boolean> {
  const result = await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (result.count === 0) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, coachProfile: { select: { organization: true } } },
  });

  if (user?.role === "COACH") {
    await prisma.emailOutbox.create({
      data: {
        toEmail: ADMIN_EMAIL,
        templateKey: "new-coach-signup",
        payload: {
          coachName: user.name,
          coachEmail: user.email,
          organization: user.coachProfile?.organization ?? "",
        },
      },
    });
    scheduleOutboxFlush();
  }

  return true;
}
