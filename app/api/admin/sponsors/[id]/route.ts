import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/sponsors/[id]
 * Update a sponsor (admin only)
 * 
 * Body can include:
 * - company_name: string
 * - contact_email: string
 * - website: string
 * - category: 'education' | 'health' | 'local' | 'tech' | 'other'
 * - sponsor_type: 'business' | 'individual' | 'organization'
 * - tier: 'premium' | 'standard' | 'community'
 * - is_active: boolean
 * - is_featured: boolean
 */
export async function PATCH(
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
    const body = await request.json();

    // Allowed fields to update
    const allowedFields = [
      "company_name",
      "contact_email",
      "website",
      "category",
      "sponsor_type",
      "tier",
      "is_active",
      "is_featured",
    ];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field] || null; // Allow null for optional fields
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Add updated_at
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("sponsors")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Error updating sponsor:", error);
      return NextResponse.json(
        { error: "Failed to update sponsor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sponsor: data });
  } catch (error) {
    logger.error("Error in PATCH /api/admin/sponsors/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/sponsors/[id]
 * Delete a sponsor (admin only)
 */
export async function DELETE(
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

    // Delete sponsor
    const { error } = await supabaseAdmin
      .from("sponsors")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting sponsor:", error);
      return NextResponse.json(
        { error: "Failed to delete sponsor" },
        { status: 500 }
      );
    }

    logger.info(`Sponsor ${id} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in DELETE /api/admin/sponsors/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

