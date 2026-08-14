"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const scheduleSchema = z.object({
  schoolName: z.string().trim().min(1, "Choose a school"),
  scheduleUrl: z.string().trim().url("Enter a valid URL"),
});

export async function createSchoolSchedule(formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const parsed = scheduleSchema.safeParse({
    schoolName: formData.get("schoolName"),
    scheduleUrl: formData.get("scheduleUrl"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form for errors.");
  }

  await prisma.schoolFootballSchedule.upsert({
    where: { schoolName: parsed.data.schoolName },
    create: parsed.data,
    update: { scheduleUrl: parsed.data.scheduleUrl },
  });

  revalidatePath("/admin/school-schedules");
}

export async function deleteSchoolSchedule(scheduleId: string) {
  await requireRole("ADMIN");

  const schedule = await prisma.schoolFootballSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) notFound();

  await prisma.schoolFootballSchedule.delete({ where: { id: scheduleId } });
  revalidatePath("/admin/school-schedules");
}
