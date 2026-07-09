import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user via Supabase session token in Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Look up or create Stripe Customer
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, is_premium")
      .eq("id", user.id)
      .single();

    if (profile?.is_premium) {
      return NextResponse.json({ error: "already_premium" }, { status: 400 });
    }

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      // Persist customer ID immediately
      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // 3. Build success / cancel URLs
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const successUrl = `${origin}/discover?upgraded=true`;
    const cancelUrl  = `${origin}/upgrade?cancelled=true`;

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_WEEKLY_PRICE_ID!,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
