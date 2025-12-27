import { NextRequest, NextResponse } from "next/server";
import { getContentViewCounts } from "@/lib/analytics/queries";
import { logger } from "@/lib/utils/logger";

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
        
        return NextResponse.json({ counts: countsObj });
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
    
    return NextResponse.json({ views: viewCount });
  } catch (error) {
    logger.error("Error getting view counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


