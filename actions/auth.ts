"use server";

import { randomBytes, createHash } from "crypto";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { APP_URL } from "@/lib/email/resend";

export async function signInWithCredentials(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password");
  const explicitCallbackUrl = formData.get("callbackUrl") as string;

  const ip = await getClientIp();
  const { success } = await rateLimit(`sign-in:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return "Too many sign-in attempts. Please try again in a few minutes.";
  }

  // A specific destination (e.g. bounced here from a protected page) is
  // always honored. Otherwise land the user somewhere role-appropriate
  // instead of the public homepage, which looks identical whether you're
  // signed in or not.
  let redirectTo = explicitCallbackUrl || "/";
  if (redirectTo === "/") {
    const user = await prisma.user.findUnique({ where: { email }, select: { role: true } });
    if (user?.role === "COACH") redirectTo = "/search";
    else if (user?.role === "PARENT") redirectTo = "/dashboard";
    else if (user?.role === "ADMIN") redirectTo = "/admin";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong signing you in.";
      }
    }
    throw error;
  }
}

export async function signUp(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const ip = await getClientIp();
  const { success } = await rateLimit(`sign-up:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!success) {
    return "Too many accounts created from this network. Please try again later.";
  }

  let data;
  try {
    data = signUpSchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message ?? "Please check the form for errors.";
    }
    throw error;
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return "An account with that email already exists.";
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
      coachProfile:
        data.role === "COACH"
          ? {
              create: {
                organization: data.organization || "",
                title: data.title || null,
                phone: data.phone || null,
              },
            }
          : undefined,
    },
  });

  // Coaches can browse/search immediately with reduced info; full detail
  // unlocks once an admin verifies them (see lib/coach-visibility.ts).
  const redirectTo = data.role === "COACH" ? "/search" : "/dashboard";

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created, but automatic sign-in failed. Please sign in manually.";
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
// Generic message shown regardless of whether the email matched an
// account, so this endpoint can't be used to enumerate registered emails.
const FORGOT_PASSWORD_GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export type ForgotPasswordState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const ip = await getClientIp();
  const { success } = await rateLimit(`password-reset-request:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!success) {
    return { status: "error", message: "Too many requests. Please try again later." };
  }

  let data;
  try {
    data = forgotPasswordSchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "Enter a valid email." };
    }
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (user?.passwordHash) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${APP_URL}/reset-password?token=${token}`;
    await prisma.emailOutbox.create({
      data: {
        toEmail: user.email,
        templateKey: "password-reset",
        payload: { resetUrl },
      },
    });
    scheduleOutboxFlush();
  }

  return { status: "success", message: FORGOT_PASSWORD_GENERIC_MESSAGE };
}

export type ResetPasswordState = { status: "idle" } | { status: "error"; message: string };

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const ip = await getClientIp();
  const { success } = await rateLimit(`password-reset:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return { status: "error", message: "Too many attempts. Please try again later." };
  }

  let data;
  try {
    data = resetPasswordSchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  const tokenHash = createHash("sha256").update(data.token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return {
      status: "error",
      message: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: resetToken.userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
  ]);

  const redirectTo = resetToken.user.role === "COACH" ? "/search" : "/dashboard";

  try {
    await signIn("credentials", {
      email: resetToken.user.email,
      password: data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Password updated. Please sign in manually." };
    }
    throw error;
  }

  return { status: "idle" };
}
