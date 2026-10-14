import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashVerificationToken } from "@/lib/email-verification-status";
import { completeEmailVerification } from "@/lib/email-verification";

// Verifies on GET and redirects to a result page, rather than showing a
// "Confirm" button. Email scanners (corporate/.edu security tools) often
// open links in advance; confirming is idempotent and exactly what the
// recipient wants anyway, so a scanner getting there first just means the
// real click later lands on "already confirmed" instead of an error.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const go = (status: string) =>
    NextResponse.redirect(new URL(`/verify-email?status=${status}`, req.url));

  if (!token) return go("invalid");

  const row = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashVerificationToken(token) },
  });
  if (!row) return go("invalid");
  if (row.usedAt) return go("already");
  if (row.expiresAt < new Date()) return go("expired");

  await completeEmailVerification(row.userId);
  return go("confirmed");
}
