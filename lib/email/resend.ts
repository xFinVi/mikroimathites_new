import { Resend } from "resend";
import { logger } from "@/lib/utils/logger";
import { escapeHtmlWithLineBreaks } from "@/lib/utils/forms";

function wrapEmail(params: {
  preheader: string;
  title: string;
  intro?: string;
  contentHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
}): string {
  const { preheader, title, intro, contentHtml, cta, footerNote } = params;

  // Table-based layout for better email client compatibility
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>${title}</title>
      </head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial, Helvetica, sans-serif;color:#111827;">
        <!-- Preheader (hidden) -->
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${preheader}
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;">
                <!-- Header -->
                <tr>
                  <td style="padding:0 8px 12px 8px;">
                    <div style="font-size:14px;color:#6b7280;letter-spacing:0.2px;">Μικροί Μαθητές</div>
                    <div style="font-size:22px;line-height:1.25;font-weight:700;color:#111827;">${title}</div>
                  </td>
                </tr>

                <!-- Card -->
                <tr>
                  <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px 20px;">
                    ${intro ? `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">${intro}</p>` : ""}

                    ${contentHtml}

                    ${cta ? `
                      <div style="margin-top:22px;text-align:center;">
                        <a href="${cta.href}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;font-size:14px;">
                          ${cta.label}
                        </a>
                      </div>
                    ` : ""}

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                      Με εκτίμηση,<nobr></nobr><br>
                      <strong style="color:#111827;">Η ομάδα Mikroi Mathites</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:14px 8px 0 8px;">
                    <p style="margin:0;text-align:center;color:#9ca3af;font-size:12px;line-height:1.6;">
                      ${footerNote || "Αυτό είναι ένα αυτόματο email. Παρακαλώ μην απαντάτε σε αυτό το email."}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Email Service Configuration (Resend)
 * 
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get API key from Resend Dashboard → API Keys
 * 3. Add RESEND_API_KEY to .env.local
 * 4. Add ADMIN_EMAIL to .env.local
 * 
 * Domain Setup (Optional - for production):
 * - Currently using Resend's test domain: onboarding@resend.dev
 * - To use your own domain (e.g., noreply@mikroimathites.gr):
 *   1. Go to Resend Dashboard → Domains
 *   2. Add and verify your domain
 *   3. Update "from" addresses in email functions below
 * 
 * Testing:
 * - Test emails work immediately with onboarding@resend.dev
 * - For production, verify your domain for better deliverability
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const adminEmail = process.env.ADMIN_EMAIL?.trim();
// Resend account owner email (for test domain - must match Resend account email)
const resendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "mikrimathites@outlook.com";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

// Email "from" address - use test domain in dev, verified domain in production
const emailFrom = isDevelopment 
  ? "Mikroi Mathites <onboarding@resend.dev>"  // Test domain for development
  : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";  // Production domain

if (!resendApiKey) {
  logger.warn("Resend API key not configured: missing RESEND_API_KEY");
}

if (!adminEmail) {
  logger.warn("Admin email not configured: missing ADMIN_EMAIL");
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Send email notification to admin when a new submission is received
 */
export async function sendSubmissionNotificationToAdmin(data: {
  type: string;
  name?: string | null;
  email?: string | null;
  message: string;
  topic?: string | null;
  submissionId: string;
}): Promise<boolean> {
  // Access env vars at runtime (server-side - no NEXT_PUBLIC_ prefix needed)
  const runtimeResendApiKey = process.env.RESEND_API_KEY?.trim();
  const runtimeSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const runtimeIsDevelopment = runtimeSiteUrl.includes('localhost') || runtimeSiteUrl.includes('127.0.0.1');
  const runtimeResendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "philterzidis@hotmail.com";
  const runtimeAdminEmail = process.env.ADMIN_EMAIL?.trim();
  
  // Create Resend client with runtime API key
  const activeResend = runtimeResendApiKey ? new Resend(runtimeResendApiKey) : resend;
  
  if (!activeResend) {
    logger.warn("Cannot send email: Resend not configured");
    return false;
  }

  // In development, send to Resend account owner email (required for test domain)
  // In production, send to admin email
  const recipientEmail = runtimeIsDevelopment ? runtimeResendAccountEmail : (runtimeAdminEmail || runtimeResendAccountEmail);
  
  if (!recipientEmail) {
    logger.warn("Cannot send email: No recipient email configured");
    return false;
  }

  const activeEmailFrom = runtimeIsDevelopment 
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";

  try {
    const typeLabels: Record<string, string> = {
      question: "Ερώτηση (Q&A)",
      feedback: "Feedback",
      video_idea: "Ιδέα για βίντεο",
      review: "Αξιολόγηση",
    };

    const typeLabel = typeLabels[data.type] || data.type;

    await activeResend.emails.send({
      from: activeEmailFrom,
      to: recipientEmail,
      subject: `Νέα υποβολή: ${typeLabel}`,
      html: wrapEmail({
        preheader: `Νέα υποβολή: ${typeLabel} από ${data.name || "Ανώνυμος"}`,
        title: `Νέα υποβολή: ${typeLabel}`,
        contentHtml: `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;">
            <tr>
              <td style="padding:0 0 14px 0;">
                <div style="font-size:14px;color:#6b7280;">Στοιχεία</div>
                <div style="margin-top:8px;font-size:15px;line-height:1.7;">
                  <div><strong>Από:</strong> ${escapeHtmlWithLineBreaks(data.name || "Ανώνυμος")}</div>
                  ${data.email ? `<div><strong>Email:</strong> ${escapeHtmlWithLineBreaks(data.email)}</div>` : ""}
                  ${data.topic ? `<div><strong>Θέμα:</strong> ${escapeHtmlWithLineBreaks(data.topic)}</div>` : ""}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Μήνυμα</div>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:15px;line-height:1.7;">${escapeHtmlWithLineBreaks(data.message)}</div>
              </td>
            </tr>
          </table>
        `,
        cta: {
          label: "Δείτε στο Dashboard",
          href: `${runtimeSiteUrl}/admin/submissions/${data.submissionId}`,
        },
      }),
    });
    return true;
  } catch (error) {
    logger.error("Failed to send submission notification email", error);
    return false;
  }
}

/**
 * Send email to user when their question is answered
 * 
 * Note: If using Resend's test domain (onboarding@resend.dev), emails can only be sent
 * to the account owner's email. For production, verify your domain at resend.com/domains
 */
export async function sendAnswerNotificationToUser(data: {
  email: string;
  name?: string | null;
  question: string;
  answer: string;
  published?: boolean;
  submissionType?: string; // question, feedback, video_idea, review
}): Promise<boolean> {
  // Access env vars at runtime (server-side - no NEXT_PUBLIC_ prefix needed for server vars)
  const runtimeResendApiKey = process.env.RESEND_API_KEY?.trim();
  const runtimeSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const runtimeIsDevelopment = runtimeSiteUrl.includes('localhost') || runtimeSiteUrl.includes('127.0.0.1');
  const runtimeResendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "philterzidis@hotmail.com";
  
  // Create Resend client with runtime API key
  const activeResend = runtimeResendApiKey ? new Resend(runtimeResendApiKey) : resend;
  
  if (!activeResend) {
    logger.warn("Cannot send email: Resend not configured");
    return false;
  }

  // In development, send to Resend account owner (required for test domain)
  // In production, send directly to user
  const recipientEmail = data.email.toLowerCase();
  const resendAccountEmailLower = runtimeResendAccountEmail.toLowerCase();
  const isSendingToAccountOwner = recipientEmail === resendAccountEmailLower;
  const shouldSendToAccountOwner = runtimeIsDevelopment && !isSendingToAccountOwner;
  const actualRecipient = shouldSendToAccountOwner ? runtimeResendAccountEmail : data.email;
  
  const activeEmailFrom = runtimeIsDevelopment 
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";

  // Get Greek label for submission type
  const getTypeLabel = (type?: string): string => {
    const typeLabels: Record<string, string> = {
      question: "ερώτηση",
      feedback: "feedback",
      video_idea: "ιδέα για βίντεο",
      review: "αξιολόγηση",
    };
    return typeLabels[type || "question"] || "υποβολή";
  };

  const typeLabel = getTypeLabel(data.submissionType);

  try {
    const greeting = data.name ? `Γεια σας, ${escapeHtmlWithLineBreaks(data.name)},` : "Γεια σας,";

    // Clean, user-friendly subject line
    const emailSubject = `Μικροί Μαθητές — Απάντηση στην ${typeLabel} σας`;

    const emailResult = await activeResend.emails.send({
      from: activeEmailFrom,
      to: actualRecipient,
      subject: emailSubject,
      html: wrapEmail({
        preheader: `Η απάντησή μας στην ${typeLabel} σας είναι έτοιμη.`,
        title: `Απάντηση στην ${typeLabel} σας`,
        intro: greeting,
        contentHtml: `
          <div style="margin:0 0 16px 0;">
            <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Η ${typeLabel} σας</div>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:15px;line-height:1.7;">${escapeHtmlWithLineBreaks(data.question)}</div>
          </div>

          <div style="margin:0;">
            <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Η απάντησή μας</div>
            <div style="background:#eef2ff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:15px;line-height:1.7;">${escapeHtmlWithLineBreaks(data.answer)}</div>
          </div>

          ${data.published ? `
            <div style="margin-top:18px;background:#ecfdf5;border:1px solid #d1fae5;border-radius:10px;padding:14px;">
              <div style="font-weight:700;color:#065f46;margin-bottom:4px;">✨ Η ${typeLabel} σας δημοσιεύτηκε!</div>
              <div style="color:#065f46;font-size:14px;line-height:1.6;">Μπορείτε να τη δείτε στη σελίδα Q&A μας.</div>
            </div>
          ` : ""}
        `,
        cta: data.published
          ? { label: "Δείτε τη στη σελίδα Q&A", href: `${runtimeSiteUrl}/epikoinonia` }
          : undefined,
      }),
    });

    // Check for errors
    if (emailResult.error) {
      logger.error("Failed to send email", emailResult.error);
      throw new Error(`Email send failed: ${JSON.stringify(emailResult.error)}`);
    }

    return true;
  } catch (error) {
    logger.error("Failed to send email", error);
    return false;
  }
}
