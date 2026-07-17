"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations/auth";

export async function signInWithCredentials(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
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

  const redirectTo = data.role === "COACH" ? "/coach/dashboard/account/verification-pending" : "/dashboard";

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
