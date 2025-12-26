import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { requireAdmin } from "@/lib/auth/middleware";
import { createQAItemInSanity } from "@/lib/sanity/write-client";
import {
  getCategoryIdByTopic,
  getAgeGroupIdsByAgeGroup,
  textToPortableText,
} from "@/lib/utils/sanity-mapping";
import { sendAnswerNotificationToUser } from "@/lib/email/resend";
import type { NextRequest } from "next/server";

interface PublishQABody {
  submissionId: string;
  answer: string; // Plain text answer (will be converted to PortableText)
  sendEmail?: boolean; // Whether to send email notification to user
}

/**
 * POST /api/admin/qa/publish
 * Publish a Q&A submission to Sanity and optionally send email to user
 * Protected: Admin only
 */
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const body: PublishQABody = await request.json();
    const { submissionId, answer, sendEmail = true } = body;

    if (!submissionId || !answer) {
      return NextResponse.json(
        { error: "Missing required fields: submissionId, answer" },
        { status: 400 }
      );
    }

    // Get submission from database
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", submissionId)
      .eq("type", "question")
      .single();

    if (fetchError || !submission) {
      logger.error("Submission not found", fetchError);
      return NextResponse.json(
        { error: "Submission not found or not a question" },
        { status: 404 }
      );
    }

    // Convert answer to PortableText
    const portableTextAnswer = textToPortableText(answer);

    // Get category and age group IDs from Sanity
    const categoryId = submission.topic
      ? await getCategoryIdByTopic(submission.topic)
      : null;
    const ageGroupIds = submission.child_age_group
      ? await getAgeGroupIdsByAgeGroup(submission.child_age_group)
      : [];

    // Create Q&A item in Sanity
    const sanityItemId = await createQAItemInSanity({
      question: submission.message,
      answer: portableTextAnswer,
      categoryId: categoryId || undefined,
      ageGroupIds: ageGroupIds.length > 0 ? ageGroupIds : undefined,
      publishedAt: new Date().toISOString(),
    });

    if (!sanityItemId) {
      return NextResponse.json(
        { error: "Failed to publish to Sanity" },
        { status: 500 }
      );
    }

    // Update submission in database
    const { error: updateError } = await supabaseAdmin
      .from("submissions")
      .update({
        status: "published",
        admin_reply: answer,
        admin_reply_sent_at: new Date().toISOString(),
        published_to_sanity: true,
        sanity_qa_item_id: sanityItemId,
      })
      .eq("id", submissionId);

    if (updateError) {
      logger.error("Failed to update submission", updateError);
      // Don't fail the request, but log the error
    }

    // Send email notification to user if requested and email exists
    if (sendEmail && submission.email) {
      sendAnswerNotificationToUser({
        email: submission.email,
        name: submission.name,
        question: submission.message,
        answer: answer,
        published: true,
        submissionType: submission.type, // Pass submission type for subject line
      }).catch((err) => {
        logger.error("Failed to send email notification", err);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({
      success: true,
      sanityItemId,
      message: "Q&A published successfully",
    });
  } catch (error) {
    logger.error("Error in POST /api/admin/qa/publish", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


