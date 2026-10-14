import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { flushPendingOutbox } from "@/lib/email/send";

const UNCONFIRMED_COACH_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await flushPendingOutbox();

  // Housekeeping on the same daily run: coach sign-ups that never confirmed
  // their email within two weeks are almost certainly fake (or abandoned),
  // so remove them instead of letting them pile up. Narrow on purpose --
  // only coaches, only still-unconfirmed, only still-PENDING review, so a
  // real account that's been approved or rejected can never be touched.
  const purged = await prisma.user.deleteMany({
    where: {
      role: "COACH",
      createdAt: { lt: new Date(Date.now() - UNCONFIRMED_COACH_MAX_AGE_MS) },
      emailVerificationTokens: { some: { usedAt: null } },
      coachProfile: { verificationStatus: "PENDING" },
    },
  });

  return NextResponse.json({ ...result, purgedUnconfirmedCoaches: purged.count });
}
