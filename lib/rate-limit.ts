import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Fixed-window counter backed by Postgres (not in-memory) so it stays
 * correct across serverless instances. Fine-grained enough for abuse
 * protection on a low-traffic form; not meant for high-QPS endpoints.
 */
export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<{ success: boolean }> {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return { success: true };
  }

  if (existing.count >= limit) {
    return { success: false };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return { success: true };
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}
