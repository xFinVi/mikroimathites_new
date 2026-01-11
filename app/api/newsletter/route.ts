/**
 * Newsletter API Route - Handles newsletter email subscriptions
 * 
 * POST: Subscribes an email address to the newsletter. Stores subscription in
 * Supabase newsletter_subscriptions table. Prevents duplicate subscriptions.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

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
  const { data: existing, error: queryError } = await supabaseAdmin
    .from("newsletter_subscriptions")
    .select("id, status")
    .eq("email", normalizedEmail)
    .maybeSingle();
  
  // Handle query errors (but not "not found" - that's expected)
  if (queryError && queryError.code !== "PGRST116") {
    logger.error("Supabase query error", queryError);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }

  if (existing) {
    // If already subscribed and active, return error to prevent duplicate
    if (existing.status === "active") {
      return NextResponse.json(
        { error: "Αυτό το email είναι ήδη εγγεγραμμένο στο newsletter μας!" },
        { status: 400 }
      );
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
      logger.error("Supabase update error", updateError);
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
    logger.error("Supabase insert error", error);
    
    // Handle unique constraint violation - email already exists
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Αυτό το email είναι ήδη εγγεγραμμένο στο newsletter μας!" },
        { status: 400 }
      );
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

