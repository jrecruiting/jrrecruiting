import type { Metadata } from "next";
import { CoachInquiryForm } from "@/components/coach/coach-inquiry-form";

export const metadata: Metadata = {
  title: "Contact J.R. Recruiting",
};

export default function CoachContactPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Contact J.R. Recruiting</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about a player, your account, or anything else &mdash; send us a message and
          we&apos;ll get back to you.
        </p>
      </div>
      <CoachInquiryForm />
    </div>
  );
}
