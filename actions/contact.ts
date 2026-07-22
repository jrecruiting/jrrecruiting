"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";
import { scheduleOutboxFlush } from "@/lib/email/send";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { ADMIN_EMAIL } from "@/lib/email/resend";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ip = await getClientIp();
  const { success } = await rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!success) {
    return { status: "error", message: "Too many messages sent. Please try again later." };
  }

  let data;
  try {
    data = contactSchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "Please check the form for errors." };
    }
    throw error;
  }

  // Honeypot field — real users never fill this in, bots that autofill every
  // field will, so silently pretend success rather than tipping them off.
  if (data.company) {
    return { status: "success" };
  }

  await prisma.emailOutbox.create({
    data: {
      toEmail: ADMIN_EMAIL,
      templateKey: "contact-inquiry",
      payload: { name: data.name, email: data.email, message: data.message },
    },
  });
  scheduleOutboxFlush();

  return { status: "success" };
}
