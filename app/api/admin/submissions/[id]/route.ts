import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";
import type { NextRequest } from "next/server";

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

    const { error } = await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Failed to delete submission", error);
      return NextResponse.json(
        { error: "Failed to delete submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in DELETE /api/admin/submissions/[id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


