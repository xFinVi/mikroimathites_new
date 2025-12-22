import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface NewsletterPayload {
  email: string;
  source?: string; // Optional: track where subscription came from
}

/**
 * POST /api/newsletter
 * Subscribe an email to the newsletter
 */
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Newsletter service is not configured." },
      { status: 500 }
    );
  }

  let body: NewsletterPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { email, source } = body;

  // Validate email
  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const { data: existing } = await supabaseAdmin
    .from("newsletter_subscriptions")
    .select("id, status")
    .eq("email", normalizedEmail)
    .single();

  if (existing) {
    // If already subscribed and active, return success (idempotent)
    if (existing.status === "active") {
      return NextResponse.json({
        ok: true,
        message: "Already subscribed",
      });
    }

    // If unsubscribed, reactivate
    const { error: updateError } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
        source: source || null,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Supabase update error", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Subscription reactivated",
    });
  }

  // Insert new subscription
  const { error } = await supabaseAdmin
    .from("newsletter_subscriptions")
    .insert({
      email: normalizedEmail,
      status: "active",
      source: source || null,
    });

  if (error) {
    console.error("Supabase insert error", error);
    
    // Handle unique constraint violation gracefully
    if (error.code === "23505") {
      return NextResponse.json({
        ok: true,
        message: "Already subscribed",
      });
    }

    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Successfully subscribed",
  });
}

/**
 * GET /api/newsletter
 * Admin endpoint - not exposed publicly for security
 * Use Supabase dashboard or add auth-protected admin route for listing
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Admin listing not exposed. Use Supabase dashboard or add auth-protected admin route.",
    },
    { status: 401 }
  );
}

