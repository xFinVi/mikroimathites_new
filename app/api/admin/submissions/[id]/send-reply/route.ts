import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";
import { sendAnswerNotificationToUser } from "@/lib/email/resend";
import { createQADraftInSanity } from "@/lib/sanity/write-client";
import { sanityClient } from "@/lib/sanity/client";
import {
  getCategoryIdByTopic,
  getAgeGroupIdsByAgeGroup,
  textToPortableText,
} from "@/lib/utils/sanity-mapping";
import type { NextRequest } from "next/server";

/**
 * POST /api/admin/submissions/[id]/send-reply
 * Send email reply to user AND create draft Q&A in Sanity (if question with consent)
 * Protected: Admin only
 */
export async function POST(
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
    const { reply, admin_notes } = body;

    if (!reply || !reply.trim()) {
      return NextResponse.json(
        { error: "Reply message is required" },
        { status: 400 }
      );
    }

    // Get submission details
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      logger.error("Failed to fetch submission", fetchError);
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (!submission.email) {
      return NextResponse.json(
        { error: "No email address for this submission" },
        { status: 400 }
      );
    }

    // Send email to user
    const emailSent = await sendAnswerNotificationToUser({
      email: submission.email,
      name: submission.name,
      question: submission.message,
      answer: reply,
      published: false, // Not published yet - it's a draft
      submissionType: submission.type,
    });

    if (!emailSent) {
      logger.warn("Failed to send email", { submissionId: id });
    }

    // Create draft Q&A in Sanity if:
    // 1. It's a question
    // 2. User gave publish consent
    // 3. Not already created
    let sanityDraftId: string | null = null;
    let draftCreationError: string | null = null;
    
    if (
      submission.type === "question" &&
      submission.is_approved &&
      !submission.sanity_qa_item_id
    ) {
      logger.info("Attempting to create Q&A draft in Sanity", {
        submissionId: id,
        type: submission.type,
        is_approved: submission.is_approved,
        has_sanity_id: !!submission.sanity_qa_item_id,
      });

      try {
        // Convert answer to PortableText
        const portableTextAnswer = textToPortableText(reply);
        logger.info("Converted answer to PortableText", {
          submissionId: id,
          answerLength: reply.length,
        });

        // Get category and age group IDs from Sanity (with validation)
        const categoryId = submission.topic
          ? await getCategoryIdByTopic(submission.topic)
          : null;
        const ageGroupIds = submission.child_age_group
          ? await getAgeGroupIdsByAgeGroup(submission.child_age_group)
          : [];

        logger.info("Retrieved Sanity references", {
          submissionId: id,
          topic: submission.topic,
          categoryId,
          ageGroup: submission.child_age_group,
          ageGroupIds,
        });

        // Log warnings if references are missing (but still create draft)
        if (submission.topic && !categoryId) {
          logger.warn(`⚠️ Category not found for topic: ${submission.topic}. Checking available categories in Sanity...`);
          // Try to list available categories for debugging
          try {
            const availableCategories = await sanityClient?.fetch<Array<{ _id: string; title: string; slug: { current: string } }>>(
              `*[_type == "category"]{_id, title, "slug": slug.current}`
            );
            logger.info("Available categories in Sanity:", availableCategories);
          } catch (err) {
            logger.warn("Could not fetch available categories", err);
          }
        }
        if (submission.child_age_group && ageGroupIds.length === 0) {
          logger.warn(`⚠️ Age groups not found for: ${submission.child_age_group}. Checking available age groups in Sanity...`);
          // Try to list available age groups for debugging
          try {
            const availableAgeGroups = await sanityClient?.fetch<Array<{ _id: string; title: string; slug: { current: string } }>>(
              `*[_type == "ageGroup"]{_id, title, "slug": slug.current}`
            );
            logger.info("Available age groups in Sanity:", availableAgeGroups);
          } catch (err) {
            logger.warn("Could not fetch available age groups", err);
          }
        }

        // Create draft in Sanity (will work even if references are missing)
        // Pass existing draft ID if it exists to prevent duplicates
        // Note: We don't include user names for privacy reasons
        sanityDraftId = await createQADraftInSanity(
          {
            question: submission.message,
            answer: portableTextAnswer,
            categoryId: categoryId || undefined,
            ageGroupIds: ageGroupIds.length > 0 ? ageGroupIds : undefined,
          },
          submission.sanity_qa_item_id || null
        );

        if (sanityDraftId) {
          logger.info("✅ Created Q&A draft in Sanity", {
            submissionId: id,
            sanityId: sanityDraftId,
          });
        } else {
          draftCreationError = "createQADraftInSanity returned null - check Sanity client configuration and logs";
          logger.error("❌ Failed to create Q&A draft in Sanity - function returned null", {
            submissionId: id,
            hasCategory: !!categoryId,
            hasAgeGroups: ageGroupIds.length > 0,
          });
        }
      } catch (error) {
        draftCreationError = error instanceof Error ? error.message : "Unknown error creating draft";
        logger.error("❌ Error creating Q&A draft in Sanity", {
          error,
          submissionId: id,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        // Don't fail the request if Sanity draft creation fails
      }
    } else {
      logger.info("Skipping draft creation - conditions not met", {
        submissionId: id,
        type: submission.type,
        is_approved: submission.is_approved,
        has_sanity_id: !!submission.sanity_qa_item_id,
        reason: !submission.is_approved 
          ? "User did not give publish consent" 
          : submission.sanity_qa_item_id 
          ? "Draft already exists" 
          : "Not a question type",
      });
    }

    // Update submission in database (includes admin_notes if provided)
    const updateData: Record<string, any> = {
      admin_reply: reply,
      admin_reply_sent_at: new Date().toISOString(),
      status: "answered",
    };

    // Include admin_notes if provided (fixes race condition)
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes || null;
    }

    // If draft was created, save the reference
    if (sanityDraftId) {
      updateData.sanity_qa_item_id = sanityDraftId;
      // Note: published_to_sanity stays false until admin publishes from Sanity
    }

    const { error: updateError } = await supabaseAdmin
      .from("submissions")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      logger.error("Failed to update submission", updateError);
      // Don't fail if this update fails
    }

    // Determine overall success status
    const allOperationsSucceeded = emailSent && !updateError;
    const partialSuccess = emailSent || (!updateError && sanityDraftId !== null);
    
    const warnings: string[] = [];
    if (updateError) {
      warnings.push("Database update may have failed");
    }
    if (draftCreationError) {
      warnings.push(`Draft creation failed: ${draftCreationError}`);
    }
    if (!sanityDraftId && submission.type === "question" && submission.is_approved && !submission.sanity_qa_item_id) {
      warnings.push("Draft was not created despite meeting conditions - check server logs for details");
    }

    return NextResponse.json({
      success: allOperationsSucceeded,
      partialSuccess: partialSuccess && !allOperationsSucceeded,
      message: allOperationsSucceeded
        ? "Reply sent successfully"
        : emailSent
        ? "Reply sent but some operations may have failed"
        : "Reply saved but email failed to send",
      emailSent,
      draftCreated: !!sanityDraftId,
      sanityDraftId: sanityDraftId || null,
      databaseUpdated: !updateError,
      warnings,
      debug: {
        shouldCreateDraft: submission.type === "question" && submission.is_approved && !submission.sanity_qa_item_id,
        draftCreationError: draftCreationError || null,
      },
    });
  } catch (error) {
    logger.error("Error in POST /api/admin/submissions/[id]/send-reply", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

