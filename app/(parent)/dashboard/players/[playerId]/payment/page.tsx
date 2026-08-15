import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tierForPlayer, priceForTier, formatCents } from "@/lib/pricing";
import { PaymentOptions } from "@/components/parent/payment-options";
import { MountReveal } from "@/components/parent/mount-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

const INCLUDED_ITEMS = [
  "A verified, searchable profile coaches can find by state, sport, and grad year",
  "Personal outreach to coaches from our recruiting team, on top of the site listing",
  "Editing of your athlete's game and season film, done by our team to help it stand out to coaches",
  "One fee, no recurring charges — active through graduation",
];

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

  const tier = tierForPlayer(player);
  const { totalCents } = priceForTier(tier);
  const priceLabel = formatCents(totalCents);

  if (player.listingStatus === "ACTIVE") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center">
        <CheckCircle className="h-12 w-12 text-gold" weight="fill" aria-hidden />
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {player.firstName}&apos;s profile is now live
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Coaches nationwide can start finding them today.
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

      <MountReveal>
        <Card className="bg-secondary/20">
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              What&apos;s included
            </p>
            <ul className="flex flex-col gap-1.5">
              {INCLUDED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" weight="fill" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </MountReveal>

      {canceled && (
        <MountReveal delay={0.05}>
          <p className="rounded-md border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            Checkout was canceled. You can try again below.
          </p>
        </MountReveal>
      )}
      {success && (
        <MountReveal delay={0.05}>
          <p className="rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            Payment received &mdash; activating the profile now. This page will
            update automatically once it&apos;s live.
          </p>
        </MountReveal>
      )}

      <MountReveal delay={0.1}>
        <PaymentOptions playerId={playerId} tier={tier} priceLabel={priceLabel} />
      </MountReveal>

      <p className="text-center text-xs text-muted-foreground">
        Having trouble paying online?{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:text-foreground">
          Contact us
        </Link>{" "}
        and we&apos;ll help.
      </p>
    </div>
  );
}
