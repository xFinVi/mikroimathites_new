import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { sendSubmissionNotificationToAdmin } from "@/lib/email/resend";
import type { NextRequest } from "next/server";

/**
 * POST /api/admin/test-email
 * Test email functionality (admin only)
 * This endpoint allows admins to test if email notifications are working
 */
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  try {
    // Send a test email notification
    const emailSent = await sendSubmissionNotificationToAdmin({
      type: "question",
      name: "Test User",
      email: "test@example.com",
      message: "This is a test email to verify that email notifications are working correctly.",
      topic: "speech",
      submissionId: "test-" + Date.now(),
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully! Check your admin email inbox.",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send test email. Check your RESEND_API_KEY and ADMIN_EMAIL configuration.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending test email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

