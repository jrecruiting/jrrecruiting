import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const playerId = session.metadata?.playerId;

    const payment = await prisma.payment.findUnique({
      where: { stripeCheckoutSessionId: session.id },
    });

    if (payment && playerId) {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        select: {
          firstName: true,
          lastName: true,
          parentId: true,
          parent: { select: { email: true } },
        },
      });
      const playerName = player ? `${player.firstName} ${player.lastName}` : "Your athlete";

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        }),
        prisma.player.update({
          where: { id: playerId },
          data: { listingStatus: "ACTIVE", publishedAt: new Date() },
        }),
        ...(player?.parentId
          ? [
              prisma.notification.create({
                data: {
                  userId: player.parentId,
                  type: "LISTING_PAID" as const,
                  payload: { playerId, playerName },
                },
              }),
            ]
          : []),
        ...(player?.parent?.email
          ? [
              prisma.emailOutbox.create({
                data: {
                  toEmail: player.parent.email,
                  templateKey: "listing-paid",
                  payload: { playerName },
                },
              }),
            ]
          : []),
      ]);
      scheduleOutboxFlush();
    }
  }

  return NextResponse.json({ received: true });
}
