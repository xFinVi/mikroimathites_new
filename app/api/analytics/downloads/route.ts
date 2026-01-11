/**
 * Analytics Downloads API Route - Tracks and retrieves printable download analytics
 * 
 * POST: Tracks a printable download (called by PrintableDownloadButton component)
 * GET: Retrieves download counts for printables (used by admin dashboard)
 * 
 * Stores download data in Supabase content_downloads table with bot detection.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDownloadCount, getDownloadCounts } from "@/lib/analytics/queries";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

// Force dynamic rendering - download counts must be live
export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/downloads
 * Get download counts for printables
 * 
 * Query params:
 * - items: JSON array of slugs
 *   Example: ?items=["slug1","slug2"]
 * 
 * OR for single item:
 * - content_slug: string
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Check if requesting multiple items
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      try {
        const slugs = JSON.parse(itemsParam);
        if (!Array.isArray(slugs)) {
          return NextResponse.json(
            { error: "items must be an array" },
            { status: 400 }
          );
        }
        
        const counts = await getDownloadCounts(slugs);
        
        // Convert Map to object for JSON response
        const countsObj: Record<string, number> = {};
        counts.forEach((value, key) => {
          countsObj[key] = value;
        });
        
        return new Response(JSON.stringify({ counts: countsObj }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store", // Never cache download counts
          },
        });
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid items JSON" },
          { status: 400 }
        );
      }
    }
    
    // Single item request
    const content_slug = searchParams.get("content_slug");
    
    if (!content_slug) {
      return NextResponse.json(
        { error: "content_slug is required" },
        { status: 400 }
      );
    }
    
    const downloadCount = await getDownloadCount(content_slug);
    
    return new Response(JSON.stringify({ downloads: downloadCount }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store", // Never cache download counts
      },
    });
  } catch (error) {
    logger.error("Error getting download counts:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { "content-type": "application/json" }
      }
    );
  }
}

/**
 * POST /api/analytics/downloads
 * Track a printable download
 * 
 * Body:
 * {
 *   content_slug: string,
 *   session_id?: string,
 *   referrer?: string,
 *   source_page?: string,
 *   device_type?: 'mobile' | 'tablet' | 'desktop'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content_slug,
      session_id,
      referrer,
      source_page,
      device_type,
    } = body;

    // Validate required fields
    if (!content_slug) {
      return NextResponse.json(
        { error: "content_slug is required" },
        { status: 400 }
      );
    }

    // Detect bot (simple check)
    const userAgent = req.headers.get("user-agent") || "";
    const isBot =
      /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i.test(
        userAgent
      );

    // Insert download
    if (!supabaseAdmin) {
      logger.error("Supabase admin client not initialized");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin.from("content_downloads").insert({
      content_type: "printable",
      content_slug,
      session_id: session_id || null,
      user_id: null, // Future: get from auth session
      referrer: referrer || null,
      source_page: source_page || null,
      device_type: device_type || null,
      is_bot: isBot,
    });

    if (error) {
      // Log error but don't fail the request - download tracking is non-critical
      // This allows downloads to work even if the table doesn't exist yet
      logger.error("Error tracking download (non-critical):", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      
      // If table doesn't exist, return success anyway (migration not run yet)
      if (error.code === 'PGRST205' || error.message?.includes('not found') || error.message?.includes('schema cache')) {
        logger.warn("⚠️ content_downloads table not found - Please run migration: supabase/migrations/create-content-downloads.sql");
        return NextResponse.json({ 
          success: true, 
          warning: "Download tracking table not available - migration required",
          error_code: error.code,
        });
      }
      
      // For other errors, still return success to not break downloads
      return NextResponse.json({ 
        success: true, 
        warning: "Download tracking failed but download succeeded",
        error_code: error.code,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in POST /api/analytics/downloads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

