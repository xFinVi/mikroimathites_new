import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/admin/stats
 * Get dashboard statistics for admin
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      logger.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get total submissions
    const { count: totalSubmissions } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true });

    // Get new submissions (status = 'new')
    const { count: newSubmissions } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    // Get answered submissions (status = 'answered' or 'published')
    const { count: answeredSubmissions } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .in("status", ["answered", "published"]);

    // Get published Q&A (published_to_sanity = true)
    const { count: publishedQA } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("published_to_sanity", true)
      .eq("type", "question");

    return NextResponse.json({
      totalSubmissions: totalSubmissions || 0,
      newSubmissions: newSubmissions || 0,
      answeredSubmissions: answeredSubmissions || 0,
      publishedQA: publishedQA || 0,
    });
  } catch (error) {
    logger.error("Failed to fetch dashboard stats", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

