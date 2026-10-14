import type { Metadata } from "next";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export const metadata: Metadata = {
  title: "Confirm Your Email",
  description: "Confirm your email address to finish creating your J.R. Recruiting coach account.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; email?: string }>;
}) {
  const { status, email } = await searchParams;
  return <VerifyEmailPanel status={status ?? "invalid"} email={email ?? ""} />;
}
