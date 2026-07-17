"use server";

import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { stripe, LISTING_FEE_CENTS } from "@/lib/stripe";

export type CheckoutState = { error?: string } | undefined;

export async function createListingCheckoutSession(
  playerId: string,
  _prevState: CheckoutState,
  _formData: FormData
): Promise<CheckoutState> {
  const session = await requireRole("PARENT");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== session.user.id) notFound();

  if (player.listingStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  if (!stripe) {
    return {
      error:
        "Payments aren't configured yet on this environment. Add STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") ?? process.env.AUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: LISTING_FEE_CENTS,
          product_data: {
            name: `J.R. Recruiting listing — ${player.firstName} ${player.lastName}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard/players/${playerId}/payment?success=1`,
    cancel_url: `${origin}/dashboard/players/${playerId}/payment?canceled=1`,
    metadata: { playerId, parentId: session.user.id },
  });

  if (!checkoutSession.url) {
    return { error: "Could not start checkout. Please try again." };
  }

  await prisma.payment.create({
    data: {
      playerId,
      parentId: session.user.id,
      stripeCheckoutSessionId: checkoutSession.id,
      amountCents: LISTING_FEE_CENTS,
      status: "PENDING",
    },
  });

  await prisma.player.update({ where: { id: playerId }, data: { listingStatus: "PENDING_PAYMENT" } });

  redirect(checkoutSession.url);
}
