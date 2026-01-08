import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { sendSponsorRejectionNotification } from "@/lib/email/sponsor-notifications";
import { requireAdmin } from "@/lib/auth/middleware";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/sponsor-applications/[id]/reject
 * Reject a sponsor application (admin only)
 */
export async function POST(
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
    const body = await request.json().catch(() => ({}));
    const { reason, sendEmail = false } = body;

    // Fetch application
    const { data: application, error: fetchError } = await supabaseAdmin
      .from("sponsor_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      logger.error("Error fetching application:", fetchError);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status === "rejected") {
      return NextResponse.json(
        { error: "Application already rejected" },
        { status: 400 }
      );
    }

    // Update application status
    const { error: updateError } = await supabaseAdmin
      .from("sponsor_applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        admin_notes: reason || null,
      })
      .eq("id", id);

    if (updateError) {
      logger.error("Error updating application:", updateError);
      return NextResponse.json(
        { error: "Failed to reject application" },
        { status: 500 }
      );
    }

    // Send rejection email if requested (non-blocking)
    if (sendEmail) {
      sendSponsorRejectionNotification({
        email: application.contact_email,
        companyName: application.company_name,
        contactName: application.contact_name,
        reason: reason || undefined,
      }).catch((err) => {
        logger.error("Failed to send rejection email", err);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application rejected",
    });
  } catch (error) {
    logger.error("Error in reject route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

