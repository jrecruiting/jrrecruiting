import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Placeholder price — pricing model (one-time vs. subscription) and the
// actual amount were not finalized with the client. Confirm before launch.
export const LISTING_FEE_CENTS = 4900;
export const LISTING_FEE_LABEL = "$49";
