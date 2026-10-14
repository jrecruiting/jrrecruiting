import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

// Kept free of email/Resend imports on purpose: lib/auth.ts (and therefore
// the proxy) imports this, and neither should pull in the email client.

export const EMAIL_VERIFICATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// A user is "pending" when an unused verification token exists for them,
// whether or not it has expired -- an expired link still means they never
// proved the inbox is theirs, so they stay gated until a fresh link is used.
// Accounts that predate verification, and admin-created coaches, have no
// token row at all and are never gated.
export async function isEmailVerificationPending(userId: string): Promise<boolean> {
  const count = await prisma.emailVerificationToken.count({
    where: { userId, usedAt: null },
  });
  return count > 0;
}
