"use server";

import { randomBytes, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { APP_URL } from "@/lib/email/resend";

const SETUP_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const createTeamCoachSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  playerId: z.string().min(1, "Select an athlete"),
});

export type TeamCoachFormState = { error?: string } | undefined;

// Admin sets a team coach up with a specific athlete right away -- more
// can be linked afterward. The account gets an unguessable placeholder
// password and an immediate setup-link email (same mechanism as "forgot
// password"), so the coach chooses their own password before ever
// signing in.
export async function createTeamCoach(
  _prevState: TeamCoachFormState,
  formData: FormData
): Promise<TeamCoachFormState> {
  await requireRole("ADMIN");

  const parsed = createTeamCoachSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }
  const { name, email, playerId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { firstName: true, lastName: true },
  });
  if (!player) {
    return { error: "That athlete couldn't be found." };
  }

  const placeholderHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);

  const teamCoach = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: placeholderHash,
      role: "TEAM_COACH",
      teamCoachAccess: { create: { playerId } },
    },
  });

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: teamCoach.id,
      tokenHash,
      expiresAt: new Date(Date.now() + SETUP_TOKEN_TTL_MS),
    },
  });

  await prisma.emailOutbox.create({
    data: {
      toEmail: email,
      templateKey: "team-coach-invite",
      payload: {
        coachName: name,
        playerName: `${player.firstName} ${player.lastName}`,
        setupUrl: `${APP_URL}/reset-password?token=${token}`,
      },
    },
  });
  scheduleOutboxFlush();

  revalidatePath("/admin/team-coaches");
}

export async function searchPlayersByName(query: string) {
  await requireRole("ADMIN");
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  return prisma.player.findMany({
    where: {
      OR: [
        { firstName: { contains: trimmed, mode: "insensitive" } },
        { lastName: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    select: { id: true, firstName: true, lastName: true, gradYear: true },
    take: 20,
  });
}

export async function linkTeamCoachToPlayer(teamCoachId: string, playerId: string) {
  await requireRole("ADMIN");

  const existing = await prisma.teamCoachAccess.findUnique({
    where: { teamCoachId_playerId: { teamCoachId, playerId } },
  });
  if (existing) return;

  await prisma.teamCoachAccess.create({ data: { teamCoachId, playerId } });
  revalidatePath("/admin/team-coaches");
}

export async function unlinkTeamCoachFromPlayer(teamCoachId: string, playerId: string) {
  await requireRole("ADMIN");

  await prisma.teamCoachAccess.deleteMany({ where: { teamCoachId, playerId } });
  revalidatePath("/admin/team-coaches");
}

export async function deleteTeamCoach(userId: string) {
  await requireRole("ADMIN");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "TEAM_COACH") notFound();

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/team-coaches");
}
