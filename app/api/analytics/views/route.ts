import { NextRequest, NextResponse } from "next/server";
import { getContentViewCounts } from "@/lib/analytics/queries";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

// Force dynamic rendering - view counts must be live
export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/views
 * Get view counts for multiple content items
 * 
 * Query params:
 * - items: JSON array of {content_type, content_slug}
 *   Example: ?items=[{"content_type":"article","content_slug":"example"}]
 * 
 * OR for single item:
 * - content_type: 'article' | 'activity' | 'recipe' | 'printable'
 * - content_slug: string
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Check if requesting multiple items
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      try {
        const items = JSON.parse(itemsParam);
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { error: "items must be an array" },
            { status: 400 }
          );
        }
        
        const counts = await getContentViewCounts(items);
        
        // Convert Map to object for JSON response
        const countsObj: Record<string, number> = {};
        counts.forEach((value, key) => {
          countsObj[key] = value;
        });
        
        return new Response(JSON.stringify({ counts: countsObj }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store", // Never cache view counts
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
    const content_type = searchParams.get("content_type");
    const content_slug = searchParams.get("content_slug");
    
    if (!content_type || !content_slug) {
      return NextResponse.json(
        { error: "content_type and content_slug are required" },
        { status: 400 }
      );
    }
    
    const counts = await getContentViewCounts([
      { content_type: content_type as any, content_slug },
    ]);
    
    const key = `${content_type}:${content_slug}`;
    const viewCount = counts.get(key) || 0;
    
    return new Response(JSON.stringify({ views: viewCount }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store", // Never cache view counts
      },
    });
  } catch (error) {
    logger.error("Error getting view counts:", error);
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
 * POST /api/analytics/views
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

    return new Response(null, { status: 204 });
  } catch (error) {
    logger.error("Error in view tracking:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { "content-type": "application/json" }
      }
    );
  }
}

// Explicitly reject other methods (Next.js handles this implicitly,
// but being explicit makes the API contract clear)
export async function PUT() {
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { 
      status: 405,
      headers: { "content-type": "application/json" }
    }
  );
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { 
      status: 405,
      headers: { "content-type": "application/json" }
    }
  );
}
