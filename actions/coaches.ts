"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { APP_URL } from "@/lib/email/resend";
import { WELCOME_TOKEN_TTL_MS } from "@/lib/email/token-ttl";

export type CoachFormState = { error?: string } | undefined;

const addCoachSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  organization: z.string().trim().min(1, "College / organization is required").max(120),
  title: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),
});

export async function createCoachAdmin(
  _prevState: CoachFormState,
  formData: FormData
): Promise<CoachFormState> {
  const session = await requireRole("ADMIN");

  const parsed = addCoachSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    title: formData.get("title"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  // The coach never sees or uses this -- they set their own password via
  // the welcome-email link below, same mechanism as forgot-password.
  const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      role: "COACH",
      coachProfile: {
        create: {
          organization: data.organization,
          title: data.title || null,
          phone: data.phone || null,
          // Admin is creating this account directly, so it's pre-approved --
          // no reason to make the admin also visit /admin/coaches to approve
          // an account they just vouched for themselves.
          verificationStatus: "APPROVED",
          verifiedAt: new Date(),
          verifiedByAdminId: session.user.id,
        },
      },
    },
  });

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + WELCOME_TOKEN_TTL_MS),
    },
  });

  await prisma.emailOutbox.create({
    data: {
      toEmail: user.email,
      templateKey: "coach-welcome",
      payload: {
        coachName: user.name,
        setPasswordUrl: `${APP_URL}/reset-password?token=${token}`,
      },
    },
  });
  scheduleOutboxFlush();

  revalidatePath("/admin/coaches");
  redirect("/admin/coaches");
}

export async function approveCoach(coachProfileId: string) {
  const session = await requireRole("ADMIN");

  const coachProfile = await prisma.coachProfile.update({
    where: { id: coachProfileId },
    data: {
      verificationStatus: "APPROVED",
      verifiedAt: new Date(),
      verifiedByAdminId: session.user.id,
      rejectionReason: null,
    },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  await prisma.$transaction([
    prisma.notification.create({
      data: { userId: coachProfile.userId, type: "COACH_APPROVED", payload: {} },
    }),
    prisma.emailOutbox.create({
      data: {
        toEmail: coachProfile.user.email,
        templateKey: "coach-approved",
        payload: { coachName: coachProfile.user.name },
      },
    }),
  ]);
  scheduleOutboxFlush();

  revalidatePath("/admin/coaches");
}

export async function setCoachTestAccount(coachProfileId: string, isTestAccount: boolean) {
  await requireRole("ADMIN");

  await prisma.coachProfile.update({
    where: { id: coachProfileId },
    data: { isTestAccount },
  });

  revalidatePath("/admin/coaches");
}

export async function deleteCoach(userId: string) {
  await requireRole("ADMIN");

  // Deletes the underlying account (cascades to the coach profile, stars,
  // notifications, and sessions), not just the coach profile -- otherwise
  // the account would be left in a broken, profile-less state and could
  // still sign in.
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/coaches");
}

export async function rejectCoach(coachProfileId: string, reason: string) {
  const session = await requireRole("ADMIN");

  const coachProfile = await prisma.coachProfile.update({
    where: { id: coachProfileId },
    data: {
      verificationStatus: "REJECTED",
      verifiedAt: new Date(),
      verifiedByAdminId: session.user.id,
      rejectionReason: reason || null,
    },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  await prisma.$transaction([
    prisma.notification.create({
      data: { userId: coachProfile.userId, type: "COACH_REJECTED", payload: {} },
    }),
    prisma.emailOutbox.create({
      data: {
        toEmail: coachProfile.user.email,
        templateKey: "coach-rejected",
        payload: { coachName: coachProfile.user.name, reason: reason || undefined },
      },
    }),
  ]);
  scheduleOutboxFlush();

  revalidatePath("/admin/coaches");
}
