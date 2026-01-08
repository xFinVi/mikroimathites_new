import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";
import type { NextRequest } from "next/server";
import { deleteQADocumentFromSanity } from "@/lib/sanity/write-client";

/**
 * GET /api/admin/submissions/[id]
 * Get a single submission by ID
 * Protected: Admin only
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("Failed to fetch submission", error);
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission: data });
  } catch (error) {
    logger.error("Error in GET /api/admin/submissions/[id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/submissions/[id]
 * Update a submission (status, admin_reply, admin_notes, etc.)
 * Protected: Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Allowed fields to update
    const allowedFields = [
      "status",
      "admin_notes",
      "admin_reply",
      "admin_reply_sent_at",
      "published_to_sanity",
      "sanity_qa_item_id",
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // If admin_reply is being set, also set admin_reply_sent_at if not provided
    if (updateData.admin_reply && !updateData.admin_reply_sent_at) {
      updateData.admin_reply_sent_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("submissions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Failed to update submission", error);
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ submission: data });
  } catch (error) {
    logger.error("Error in PATCH /api/admin/submissions/[id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/submissions/[id]
 * Delete a submission permanently
 * Protected: Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;

    // First, fetch the submission to check if it's published to Sanity
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("published_to_sanity, sanity_qa_item_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      logger.error("Failed to fetch submission before deletion", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch submission" },
        { status: 500 }
      );
    }

    // If published to Sanity, delete from Sanity first
    if (submission?.published_to_sanity && submission?.sanity_qa_item_id) {
      logger.info("Deleting published Q&A from Sanity", {
        submissionId: id,
        sanityId: submission.sanity_qa_item_id,
      });

      const sanityDeleted = await deleteQADocumentFromSanity(
        submission.sanity_qa_item_id
      );

      if (!sanityDeleted) {
        logger.warn("Failed to delete from Sanity, but continuing with Supabase deletion", {
          submissionId: id,
          sanityId: submission.sanity_qa_item_id,
        });
        // Continue with Supabase deletion even if Sanity deletion fails
        // This prevents orphaned records in Supabase
      }
    }

    // Delete from Supabase
    const { error } = await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Failed to delete submission from Supabase", error);
      return NextResponse.json(
        { error: "Failed to delete submission" },
        { status: 500 }
      );
    }

    logger.info("Successfully deleted submission", {
      submissionId: id,
      wasPublished: submission?.published_to_sanity || false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in DELETE /api/admin/submissions/[id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


