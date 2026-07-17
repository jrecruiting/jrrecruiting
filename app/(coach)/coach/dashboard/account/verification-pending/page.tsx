import { requireRole } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockCountdown } from "@phosphor-icons/react/dist/ssr";

export default async function VerificationPendingPage() {
  await requireRole("COACH");

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
            account before granting access to player search &mdash; this
            keeps profiles safe for the families on our platform.
          </p>
          <p>We&apos;ll email you as soon as you&apos;re approved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
