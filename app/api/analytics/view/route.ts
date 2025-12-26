import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/analytics/view
 * Track a content view
 * 
 * Body:
 * {
 *   content_type: 'article' | 'activity' | 'recipe' | 'printable',
 *   content_slug: string,
 *   session_id?: string,
 *   time_spent?: number,
 *   scroll_depth?: number,
 *   read_complete?: boolean,
 *   referrer?: string,
 *   source_page?: string,
 *   search_query?: string,
 *   device_type?: 'mobile' | 'tablet' | 'desktop'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content_type,
      content_slug,
      session_id,
      time_spent,
      scroll_depth,
      read_complete,
      referrer,
      source_page,
      search_query,
      device_type,
    } = body;

    // Validate required fields
    if (!content_type || !content_slug) {
      return NextResponse.json(
        { error: "content_type and content_slug are required" },
        { status: 400 }
      );
    }

    // Validate content_type
    const validTypes = ["article", "activity", "recipe", "printable"];
    if (!validTypes.includes(content_type)) {
      return NextResponse.json(
        { error: `content_type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Detect bot (simple check)
    const userAgent = req.headers.get("user-agent") || "";
    const isBot =
      /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i.test(
        userAgent
      );

    // Insert view
    if (!supabaseAdmin) {
      logger.error("Supabase admin client not initialized");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin.from("content_views").insert({
      content_type,
      content_slug,
      session_id: session_id || null,
      time_spent: time_spent || null,
      scroll_depth: scroll_depth || null,
      read_complete: read_complete || false,
      referrer: referrer || null,
      source_page: source_page || null,
      search_query: search_query || null,
      device_type: device_type || null,
      is_bot: isBot,
    });

    if (error) {
      logger.error("Error tracking view:", error);
      return NextResponse.json(
        { error: "Failed to track view" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Error in view tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

