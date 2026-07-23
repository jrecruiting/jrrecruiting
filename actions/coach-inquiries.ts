"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { coachInquirySchema } from "@/lib/validations/coach-inquiry";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { ADMIN_EMAIL } from "@/lib/email/resend";

export type CoachInquiryFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitCoachInquiry(
  _prevState: CoachInquiryFormState,
  formData: FormData
): Promise<CoachInquiryFormState> {
  const session = await requireRole("COACH");

  const ip = await getClientIp();
  const { success } = await rateLimit(`coach-inquiry:${session.user.id}:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!success) {
    return { status: "error", message: "Too many messages sent. Please try again later." };
  }

  let data;
  try {
    data = coachInquirySchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  await prisma.coachInquiry.create({
    data: { coachId: session.user.id, message: data.message },
  });

  await prisma.emailOutbox.create({
    data: {
      toEmail: ADMIN_EMAIL,
      templateKey: "contact-inquiry",
      payload: {
        name: session.user.name,
        email: session.user.email,
        message: data.message,
      },
    },
  });
  scheduleOutboxFlush();

  return { status: "success" };
}
