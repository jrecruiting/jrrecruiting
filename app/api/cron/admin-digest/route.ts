import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";

const WINDOW_DAYS = 7;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [newCoaches, views, stars] = await Promise.all([
    prisma.user.findMany({
      where: { role: "COACH", createdAt: { gte: since } },
      select: { name: true, email: true, coachProfile: { select: { organization: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.profileViewEvent.findMany({
      where: { viewedAt: { gte: since }, coachId: { not: null } },
      select: {
        player: { select: { firstName: true, lastName: true } },
        coach: { select: { name: true } },
      },
      orderBy: { viewedAt: "asc" },
    }),
    prisma.star.findMany({
      where: { createdAt: { gte: since } },
      select: {
        player: { select: { firstName: true, lastName: true } },
        coach: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  await prisma.emailOutbox.create({
    data: {
      toEmail: ADMIN_EMAIL,
      templateKey: "admin-activity-digest",
      payload: {
        periodLabel: "the past 7 days",
        newCoaches: newCoaches.map((c) => ({
          name: c.name || "Unnamed coach",
          email: c.email,
          organization: c.coachProfile?.organization || "",
        })),
        views: views.map((v) => ({
          playerName: `${v.player.firstName} ${v.player.lastName}`,
          coachName: v.coach?.name || "A coach",
        })),
        stars: stars.map((s) => ({
          playerName: `${s.player.firstName} ${s.player.lastName}`,
          coachName: s.coach.name || "A coach",
        })),
      },
    },
  });
  scheduleOutboxFlush();

  return NextResponse.json({
    newCoaches: newCoaches.length,
    views: views.length,
    stars: stars.length,
  });
}
