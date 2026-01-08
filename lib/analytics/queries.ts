import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export type ContentType = "article" | "activity" | "recipe" | "printable";
export type Period = "day" | "week" | "month" | "all";

export interface ContentViewStats {
  content_type: ContentType;
  content_slug: string;
  views: number;
  unique_views?: number;
}

/**
 * Get view count for a specific content item
 */
export async function getContentViewCount(
  content_type: ContentType,
  content_slug: string
): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from("content_views")
      .select("*", { count: "exact", head: true })
      .eq("content_type", content_type)
      .eq("content_slug", content_slug)
      .eq("is_bot", false);

    if (error) {
      logger.error("Error getting view count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    logger.error("Error in getContentViewCount:", error);
    return 0;
  }
}

/**
 * Get most viewed content
 */
export async function getMostViewedContent(
  type?: ContentType,
  limit = 10,
  period: Period = "week"
): Promise<ContentViewStats[]> {
  try {
    let query = supabaseAdmin
      .from("content_views")
      .select("content_type, content_slug, session_id")
      .eq("is_bot", false);

    if (type) {
      query = query.eq("content_type", type);
    }

    // Filter by period
    if (period !== "all") {
      const date = new Date();
      if (period === "day") date.setDate(date.getDate() - 1);
      if (period === "week") date.setDate(date.getDate() - 7);
      if (period === "month") date.setMonth(date.getMonth() - 1);
      query = query.gte("viewed_at", date.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Error getting most viewed content:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group and count views
    const viewCounts = new Map<string, { views: number; sessions: Set<string> }>();

    data.forEach((view) => {
      const key = `${view.content_type}:${view.content_slug}`;
      if (!viewCounts.has(key)) {
        viewCounts.set(key, { views: 0, sessions: new Set() });
      }
      const stats = viewCounts.get(key)!;
      stats.views += 1;
      if (view.session_id) {
        stats.sessions.add(view.session_id);
      }
    });

    // Convert to array and sort
    const sorted = Array.from(viewCounts.entries())
      .map(([key, stats]) => {
        const [content_type, content_slug] = key.split(":") as [ContentType, string];
        return {
          content_type,
          content_slug,
          views: stats.views,
          unique_views: stats.sessions.size,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return sorted;
  } catch (error) {
    logger.error("Error in getMostViewedContent:", error);
    return [];
  }
}

/**
 * Get view counts for multiple content items at once
 */
export async function getContentViewCounts(
  items: Array<{ content_type: ContentType; content_slug: string }>
): Promise<Map<string, number>> {
  try {
    if (items.length === 0) return new Map();

    // For multiple items, we'll query each type separately and combine
    // This is more efficient than complex OR queries
    const counts = new Map<string, number>();

    // Group by content_type for more efficient queries
    const byType = new Map<ContentType, string[]>();
    items.forEach((item) => {
      if (!byType.has(item.content_type)) {
        byType.set(item.content_type, []);
      }
      byType.get(item.content_type)!.push(item.content_slug);
    });

    // Query each content type separately
    for (const [content_type, slugs] of byType.entries()) {
      const { data, error } = await supabaseAdmin
        .from("content_views")
        .select("content_slug")
        .eq("content_type", content_type)
        .eq("is_bot", false)
        .in("content_slug", slugs);

      if (error) {
        logger.error(`Error getting view counts for ${content_type}:`, error);
        continue;
      }

      if (data && data.length > 0) {
        data.forEach((view) => {
          const key = `${content_type}:${view.content_slug}`;
          counts.set(key, (counts.get(key) || 0) + 1);
        });
      }
    }

    return counts;
  } catch (error) {
    logger.error("Error in getContentViewCounts:", error);
    return new Map();
  }
}

/**
 * Get trending content (most viewed in recent period)
 */
export async function getTrendingContent(
  type?: ContentType,
  limit = 6,
  period: Period = "week"
): Promise<ContentViewStats[]> {
  return getMostViewedContent(type, limit, period);
}

/**
 * Get download count for a specific printable
 */
export async function getDownloadCount(
  content_slug: string
): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from("content_downloads")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "printable")
      .eq("content_slug", content_slug)
      .eq("is_bot", false);

    if (error) {
      logger.error("Error getting download count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    logger.error("Error in getDownloadCount:", error);
    return 0;
  }
}

/**
 * Get download counts for multiple printables at once
 */
export async function getDownloadCounts(
  slugs: string[]
): Promise<Map<string, number>> {
  try {
    if (slugs.length === 0) return new Map();

    const counts = new Map<string, number>();

    const { data, error } = await supabaseAdmin
      .from("content_downloads")
      .select("content_slug")
      .eq("content_type", "printable")
      .eq("is_bot", false)
      .in("content_slug", slugs);

    if (error) {
      logger.error("Error getting download counts:", error);
      return counts;
    }

    if (data && data.length > 0) {
      data.forEach((download) => {
        const key = `printable:${download.content_slug}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    }

    return counts;
  } catch (error) {
    logger.error("Error in getDownloadCounts:", error);
    return new Map();
  }
}

