import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a J.R. Recruiting account as a parent to list your athlete or as a coach to search verified player profiles.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const requestedRole = role === "coach" ? "COACH" : role === "parent" ? "PARENT" : undefined;

  return <SignUpForm initialRole={requestedRole ?? "PARENT"} lockRole={requestedRole !== undefined} />;
}
