import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.user || !roles.includes(session.user.role)) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireVerifiedCoach() {
  const session = await requireRole("COACH");
  if (session.user.coachVerificationStatus !== "APPROVED") {
    redirect("/coach/dashboard/account/verification-pending");
  }
  return session;
}
