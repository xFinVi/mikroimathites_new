import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { checkRateLimit, getClientIP } from "@/lib/sponsors/rate-limit";
import { sendSponsorApplicationNotification } from "@/lib/email/sponsor-notifications";

export const dynamic = "force-dynamic";

interface SponsorApplicationPayload {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  category?: "education" | "health" | "local" | "tech" | "other";
  sponsor_type?: "business" | "individual" | "organization";
  description?: string;
  tagline?: string;
  logo_asset_id: string; // Sanity asset ID
  logo_url?: string; // Sanity CDN URL
  logo_file_name?: string;
  logo_mime_type?: string;
  logo_file_size?: number;
}

/**
 * POST /api/sponsors/apply
 * Submit a sponsor application
 * 
 * Body: SponsorApplicationPayload
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      logger.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body: SponsorApplicationPayload = await req.json();

    // Validate required fields
    if (!body.company_name || !body.contact_name || !body.contact_email || !body.logo_asset_id) {
      return NextResponse.json(
        { error: "Missing required fields: company_name, contact_name, contact_email, logo_asset_id" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contact_email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // URL validation (if provided)
    if (body.website) {
      try {
        new URL(body.website);
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL" },
          { status: 400 }
        );
      }
    }

    // Rate limiting - per IP
    const clientIP = getClientIP(req);
    const ipRateLimit = checkRateLimit(
      `sponsor:ip:${clientIP}`,
      10, // 10 requests per hour
      60 * 60 * 1000 // 1 hour
    );

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: ipRateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(ipRateLimit.retryAfter || 3600),
          },
        }
      );
    }

    // Rate limiting - per email
    const emailRateLimit = checkRateLimit(
      `sponsor:email:${body.contact_email}`,
      3, // 3 applications per 24 hours
      24 * 60 * 60 * 1000 // 24 hours
    );

    if (!emailRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "You have already submitted the maximum number of applications. Please try again later.",
          retryAfter: emailRateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(emailRateLimit.retryAfter || 86400),
          },
        }
      );
    }

    // Create application record
    // Store Sanity asset ID in logo_storage_path field (for database compatibility)
    // The asset is already in Sanity, so we just need to store the reference
    const { data: application, error } = await supabaseAdmin
      .from("sponsor_applications")
      .insert({
        company_name: body.company_name,
        contact_name: body.contact_name,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone || null,
        website: body.website || null,
        category: body.category || null,
        sponsor_type: body.sponsor_type || null,
        description: body.description || null,
        tagline: body.tagline || null,
        logo_storage_path: body.logo_asset_id, // Store Sanity asset ID here
        logo_file_name: body.logo_file_name || null,
        logo_mime_type: body.logo_mime_type || null,
        logo_file_size: body.logo_file_size || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating sponsor application:", error);
      
      // Handle table not found (migrations not run)
      if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Database not configured. Please contact support.",
            code: "MISSING_TABLE",
            details: "The sponsor_applications table does not exist. Database migrations need to be run."
          },
          { status: 503 }
        );
      }
      
      // Handle unique constraint violation (duplicate email per day)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already submitted an application today. Please try again tomorrow." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: "Failed to submit application",
          code: error.code || "UNKNOWN_ERROR",
          details: process.env.NODE_ENV === "development" ? error.message : undefined
        },
        { status: 500 }
      );
    }

    // Send email notification to admin (non-blocking)
    sendSponsorApplicationNotification({
      applicationId: application.id,
      companyName: body.company_name,
      contactName: body.contact_name,
      contactEmail: body.contact_email,
      website: body.website,
      category: body.category,
      sponsorType: body.sponsor_type,
    }).catch((err) => {
      // Log but don't fail the request if email fails
      logger.error("Failed to send notification email", err);
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application.id,
    });
  } catch (error) {
    logger.error("Error in sponsor apply route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

