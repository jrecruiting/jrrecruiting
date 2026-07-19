import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClockCountdown } from "@phosphor-icons/react/dist/ssr";

export default async function VerificationPendingPage() {
  const session = await requireRole("COACH");
  if (session.user.coachVerificationStatus === "APPROVED") {
    redirect("/search");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <ClockCountdown className="h-12 w-12 text-gold" weight="duotone" aria-hidden />
      <Card className="w-full border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Your coach account is under review
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            Thanks for signing up. Our team manually reviews every coach
            account before unlocking full profile details &mdash; this keeps
            identifying info safe for the families on our platform.
          </p>
          <p>
            In the meantime, you can already search and browse player
            profiles with limited info (no full last names, exact locations,
            bios, or highlight videos). We&apos;ll email you as soon as
            you&apos;re fully verified.
          </p>
          <Button
            className="mt-2 w-fit self-center bg-gold text-gold-foreground hover:bg-gold/90"
            nativeButton={false}
            render={<Link href="/search">Browse Players Now</Link>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
