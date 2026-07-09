import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Stripe requires the raw body for signature verification.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  console.log("[webhook] Event received:", event.type);

  try {
    switch (event.type) {
      // ── Payment succeeded → grant premium ─────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        await setPremium(customerId, true, subscriptionId);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;
        await setPremium(customerId, true, subscriptionId);
        break;
      }

      // ── Subscription cancelled / payment failed → revoke premium ───────
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        await setPremium(sub.customer as string, false, null);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        await setPremium(invoice.customer as string, false, null);
        break;
      }

      default:
        // Silently ignore unhandled events
        break;
    }
  } catch (err: any) {
    console.error("[webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/* ── Helper: update profiles by stripe_customer_id ─────────────────── */
async function setPremium(
  customerId: string,
  isPremium: boolean,
  subscriptionId: string | null
) {
  const updates: Record<string, any> = { is_premium: isPremium };
  if (subscriptionId !== undefined) {
    updates.stripe_subscription_id = subscriptionId;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[webhook] Failed to update profile:", error);
    throw error;
  }
  console.log(
    `[webhook] Set is_premium=${isPremium} for customer ${customerId}`
  );
}
