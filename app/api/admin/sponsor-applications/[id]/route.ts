import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { generateSignedDownloadUrl } from "@/lib/storage/signed-urls";
import { requireAdmin } from "@/lib/auth/middleware";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/sponsor-applications/[id]
 * Get single sponsor application details (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Fetch application
    const { data: application, error } = await supabaseAdmin
      .from("sponsor_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("Error fetching sponsor application:", error);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Generate signed URL for logo preview (if exists)
    let logoPreviewUrl: string | null = null;
    if (application.logo_storage_path) {
      logoPreviewUrl = await generateSignedDownloadUrl(
        application.logo_storage_path,
        3600 // 1 hour expiry
      );
    }

    return NextResponse.json({
      ...application,
      logo_preview_url: logoPreviewUrl,
    });
  } catch (error) {
    logger.error("Error in sponsor-applications/[id] route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

