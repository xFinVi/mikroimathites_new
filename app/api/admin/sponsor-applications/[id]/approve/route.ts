import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { sendSponsorApprovalConfirmation } from "@/lib/email/sponsor-notifications";
import { requireAdmin } from "@/lib/auth/middleware";
import { syncSponsorToSanity } from "@/lib/sponsors/sanity-sync";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/sponsor-applications/[id]/approve
 * Approve a sponsor application (admin only)
 * Creates sponsor record and updates application status
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
    const { tier = "standard" } = body;

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

    if (application.status === "approved") {
      return NextResponse.json(
        { error: "Application already approved" },
        { status: 400 }
      );
    }

    // Create sponsor record
    const { data: sponsor, error: sponsorError } = await supabaseAdmin
      .from("sponsors")
      .insert({
        application_id: application.id,
        company_name: application.company_name,
        website: application.website || null,
        contact_email: application.contact_email,
        category: application.category || null,
        sponsor_type: application.sponsor_type || null,
        tier: tier,
        is_active: true,
        is_featured: false,
        sync_status: "pending",
      })
      .select()
      .single();

    if (sponsorError) {
      logger.error("Error creating sponsor:", sponsorError);
      return NextResponse.json(
        { error: "Failed to create sponsor" },
        { status: 500 }
      );
    }

    // Update application status
    const { error: updateError } = await supabaseAdmin
      .from("sponsor_applications")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      logger.error("Error updating application:", updateError);
      // Sponsor was created, but status update failed - log and continue
    }

    // Sync sponsor to Sanity (non-blocking, but log errors)
    syncSponsorToSanity(sponsor.id)
      .then((result) => {
        if (result.success) {
          logger.info(`✅ Sponsor ${sponsor.id} synced to Sanity: ${result.sanityDocumentId}`);
        } else {
          logger.warn(`⚠️ Failed to sync sponsor ${sponsor.id} to Sanity: ${result.error}`);
        }
      })
      .catch((err) => {
        logger.error("Error syncing sponsor to Sanity", err);
      });

    // Send confirmation email (non-blocking)
    sendSponsorApprovalConfirmation({
      email: application.contact_email,
      companyName: application.company_name,
      contactName: application.contact_name,
    }).catch((err) => {
      logger.error("Failed to send approval email", err);
    });

    return NextResponse.json({
      success: true,
      message: "Application approved",
      sponsor: {
        id: sponsor.id,
        company_name: sponsor.company_name,
      },
    });
  } catch (error) {
    logger.error("Error in approve route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

