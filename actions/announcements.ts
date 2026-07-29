"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const announcementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  body: z.string().trim().min(1, "Body is required").max(2000),
});

export async function createAnnouncement(formData: FormData): Promise<void> {
  const session = await requireRole("ADMIN");

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form for errors.");
  }

  await prisma.announcement.create({
    data: { title: parsed.data.title, body: parsed.data.body, createdBy: session.user.id },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/home");
}

export async function deleteAnnouncement(announcementId: string) {
  await requireRole("ADMIN");

  const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } });
  if (!announcement) notFound();

  await prisma.announcement.delete({ where: { id: announcementId } });
  revalidatePath("/admin/announcements");
  revalidatePath("/home");
}
