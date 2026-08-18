"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const alumniUpdateSchema = z.object({
  athleteName: z.string().trim().min(1, "Athlete name is required").max(120),
  sportId: z.string().trim().min(1, "Choose a sport"),
  schoolName: z.string().trim().min(1, "School name is required").max(120),
  updateText: z.string().trim().min(1, "Update is required").max(2000),
  eventDate: z.coerce.date(),
  photoUrl: z.preprocess(emptyToUndefined, z.string().trim().url().optional()),
  linkUrl: z.preprocess(emptyToUndefined, z.string().trim().url().optional()),
  featured: z.coerce.boolean().optional(),
});

function revalidateAlumniPaths() {
  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  revalidatePath("/");
}

export async function createAlumniUpdate(formData: FormData): Promise<void> {
  const session = await requireRole("ADMIN");

  const parsed = alumniUpdateSchema.safeParse({
    athleteName: formData.get("athleteName"),
    sportId: formData.get("sportId"),
    schoolName: formData.get("schoolName"),
    updateText: formData.get("updateText"),
    eventDate: formData.get("eventDate"),
    photoUrl: formData.get("photoUrl"),
    linkUrl: formData.get("linkUrl"),
    featured: formData.get("featured"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form for errors.");
  }

  await prisma.alumniUpdate.create({
    data: { ...parsed.data, createdBy: session.user.id },
  });

  revalidateAlumniPaths();
}

export async function updateAlumniUpdate(updateId: string, formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const existing = await prisma.alumniUpdate.findUnique({ where: { id: updateId } });
  if (!existing) notFound();

  const parsed = alumniUpdateSchema.safeParse({
    athleteName: formData.get("athleteName"),
    sportId: formData.get("sportId"),
    schoolName: formData.get("schoolName"),
    updateText: formData.get("updateText"),
    eventDate: formData.get("eventDate"),
    photoUrl: formData.get("photoUrl"),
    linkUrl: formData.get("linkUrl"),
    featured: formData.get("featured"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form for errors.");
  }

  await prisma.alumniUpdate.update({
    where: { id: updateId },
    data: parsed.data,
  });

  revalidateAlumniPaths();
  redirect("/admin/alumni");
}

export async function deleteAlumniUpdate(updateId: string) {
  await requireRole("ADMIN");

  const update = await prisma.alumniUpdate.findUnique({ where: { id: updateId } });
  if (!update) notFound();

  await prisma.alumniUpdate.delete({ where: { id: updateId } });
  revalidateAlumniPaths();
}
