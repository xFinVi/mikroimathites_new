import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";
import type { NextRequest } from "next/server";
import type { Submission, SubmissionsResponse } from "@/lib/types/submission";

/**
 * GET /api/admin/submissions
 * Get all submissions with filtering and pagination
 * Protected: Admin only
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("q") || searchParams.get("search") || "";
    
    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Apply filters
    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    // Status filter - handle "not_answered" properly in SQL
    if (status === "archived") {
      query = query.eq("status", "archived");
    } else if (status === "not_answered") {
      // Not answered = not answered, not published, not archived
      query = query
        .neq("status", "answered")
        .neq("status", "published")
        .neq("status", "archived");
    } else if (status && status !== "all") {
      query = query.eq("status", status).neq("status", "archived");
    } else {
      // Default: exclude archived items
      query = query.neq("status", "archived");
    }

    // Server-side search
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`message.ilike.${searchTerm},name.ilike.${searchTerm},email.ilike.${searchTerm}`);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error("Failed to fetch submissions", error);
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    const response: SubmissionsResponse = {
      submissions: (data as Submission[]) || [],
      total,
      page,
      pageSize,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Error in GET /api/admin/submissions", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


