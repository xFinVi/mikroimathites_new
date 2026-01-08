import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { syncSponsorToSanity } from "@/lib/sponsors/sanity-sync";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/sponsors/[id]/sync-to-sanity
 * Manually sync a sponsor to Sanity (admin only)
 * 
 * This is idempotent - safe to call multiple times
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  try {
    const { id } = await params;

    const result = await syncSponsorToSanity(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to sync sponsor" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sponsor synced to Sanity successfully",
      sanityDocumentId: result.sanityDocumentId,
    });
  } catch (error) {
    logger.error("Error in sync-to-sanity route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

