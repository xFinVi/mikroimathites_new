import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/sponsors
 * List all sponsors (admin only)
 * 
 * Query params:
 * - is_active: Filter by active status (true/false)
 * - tier: Filter by tier (premium, standard, community)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  try {
    if (!supabaseAdmin) {
      logger.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("is_active");
    const tier = searchParams.get("tier");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from("sponsors")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }
    if (tier) {
      query = query.eq("tier", tier);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error("Error fetching sponsors:", error);
      return NextResponse.json(
        { error: "Failed to fetch sponsors" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sponsors: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error("Error in sponsors route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

