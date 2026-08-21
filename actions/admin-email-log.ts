"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { resendOutboxRow } from "@/lib/email/send";

export async function resendEmail(rowId: string): Promise<void> {
  await requireRole("ADMIN");
  await resendOutboxRow(rowId);
  revalidatePath("/admin/email-log");
}
