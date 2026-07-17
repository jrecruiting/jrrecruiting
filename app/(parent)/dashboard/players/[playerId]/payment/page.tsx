import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LISTING_FEE_LABEL } from "@/lib/stripe";
import { PaymentButton } from "@/components/parent/payment-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default async function PlayerPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { playerId } = await params;
  const { success, canceled } = await searchParams;
  const session = await auth();

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== session!.user.id) notFound();

  if (player.listingStatus === "ACTIVE") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center">
        <CheckCircle className="h-12 w-12 text-gold" weight="fill" aria-hidden />
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {player.firstName}&apos;s profile is live
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Coaches can now find this profile in search.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-border/60"
          nativeButton={false}
          render={<Link href="/dashboard">Back to My Athletes</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          List {player.firstName} {player.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One more step &mdash; complete the listing fee to make this profile
          searchable by verified college coaches.
        </p>
      </div>

      {canceled && (
        <p className="rounded-md border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Checkout was canceled. You can try again below.
        </p>
      )}
      {success && (
        <p className="rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          Payment received &mdash; activating the profile now. This page will
          update automatically once it&apos;s live.
        </p>
      )}

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Listing fee</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">One-time athlete profile listing</span>
            <span className="font-heading text-2xl font-bold">{LISTING_FEE_LABEL}</span>
          </div>
          <PaymentButton playerId={playerId} />
        </CardContent>
      </Card>
    </div>
  );
}
