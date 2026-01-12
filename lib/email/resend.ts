// lib/email/resend.ts
import { Resend } from "resend";
import { logger } from "@/lib/utils/logger";
import { escapeHtmlWithLineBreaks } from "@/lib/utils/forms";

type RuntimeEmailConfig = {
  isDevelopment: boolean;
  siteUrl: string;
  resendApiKey?: string;
  resendAccountEmail?: string;
  adminEmail?: string;
  fromEmail: string;
};

function getRuntimeEmailConfig(): RuntimeEmailConfig {
  const nodeEnv = (process.env.NODE_ENV || "").toLowerCase();
  const isDevelopment = nodeEnv !== "production";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (isDevelopment ? "http://localhost:3000" : "");

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const resendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  logger.info("Raw environment variables", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: resendApiKey ? "[SET]" : "[NOT SET]",
    RESEND_ACCOUNT_EMAIL: resendAccountEmail || "[NOT SET]",
    ADMIN_EMAIL: adminEmail || "[NOT SET]",
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "[NOT SET]",
  });

  // In dev we MUST use Resend test domain
  const fromEmail = isDevelopment
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : (process.env.RESEND_FROM_EMAIL?.trim() ||
        "Mikroi Mathites <noreply@mikroimathites.gr>");

  return {
    isDevelopment,
    siteUrl,
    resendApiKey,
    resendAccountEmail,
    adminEmail,
    fromEmail,
  };
}

function getResendClient(resendApiKey?: string): Resend | null {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

/**
 * Wraps email content in a styled HTML template
 */
export function wrapEmail(params: {
  preheader: string;
  title: string;
  intro?: string;
  contentHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
}): string {
  const { preheader, title, intro, contentHtml, cta, footerNote } = params;

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
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${preheader}
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;">
                <tr>
                  <td style="padding:0 8px 12px 8px;">
                    <div style="font-size:14px;color:#6b7280;letter-spacing:0.2px;">Μικροί Μαθητές</div>
                    <div style="font-size:22px;line-height:1.25;font-weight:700;color:#111827;">${title}</div>
                  </td>
                </tr>

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
                      Με εκτίμηση,<br>
                      <strong style="color:#111827;">Η ομάδα Mikroi Mathites</strong>
                    </p>
                  </td>
                </tr>

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
 * Send email notification to admin when a new submission is received
 * - to: admin
 * - replyTo: user's email (so admin can reply easily)
 */
export async function sendSubmissionNotificationToAdmin(data: {
  type: string;
  name?: string | null;
  email?: string | null;
  message: string;
  topic?: string | null;
  submissionId: string;
}): Promise<boolean> {
  const cfg = getRuntimeEmailConfig();
  const resend = getResendClient(cfg.resendApiKey);

  if (!resend) {
    logger.error("Cannot send admin notification: missing RESEND_API_KEY");
    return false;
  }

  const toEmail = cfg.adminEmail || cfg.resendAccountEmail;
  if (!toEmail) {
    logger.error("Cannot send admin notification: missing ADMIN_EMAIL and RESEND_ACCOUNT_EMAIL");
    return false;
  }

  const typeLabels: Record<string, string> = {
    question: "Ερώτηση (Q&A)",
    feedback: "Feedback",
    video_idea: "Ιδέα για βίντεο",
    review: "Αξιολόγηση",
  };
  const typeLabel = typeLabels[data.type] || data.type;

  try {
    const result = await resend.emails.send({
      from: cfg.fromEmail,
      to: toEmail,
      replyTo: data.email || undefined,
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
        cta: cfg.siteUrl
          ? { label: "Δείτε στο Dashboard", href: `${cfg.siteUrl}/admin/submissions/${data.submissionId}` }
          : undefined,
      }),
    });

    if (result.error) {
      logger.error("Admin notification email failed", result.error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("Admin notification email threw", err);
    return false;
  }
}

/**
 * Send email to user when their submission is answered
 * - to: user
 * - replyTo: admin/support inbox
 * - body: only your answer (professional)
 */
export async function sendAnswerNotificationToUser(data: {
  email: string;
  name?: string | null;
  answer: string;
  published?: boolean;
  submissionType?: string; // question, feedback, video_idea, review
}): Promise<boolean> {
  logger.info("sendAnswerNotificationToUser called with data", {
    email: data.email,
    name: data.name,
    answerLength: data.answer?.length || 0,
    published: data.published,
    submissionType: data.submissionType,
  });

  const cfg = getRuntimeEmailConfig();
  logger.info("Runtime email config", {
    isDevelopment: cfg.isDevelopment,
    siteUrl: cfg.siteUrl,
    hasApiKey: !!cfg.resendApiKey,
    resendAccountEmail: cfg.resendAccountEmail,
    resendAccountEmailType: typeof cfg.resendAccountEmail,
    resendAccountEmailLength: cfg.resendAccountEmail?.length || 0,
    adminEmail: cfg.adminEmail,
    fromEmail: cfg.fromEmail,
    nodeEnv: process.env.NODE_ENV,
    nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });

  const resend = getResendClient(cfg.resendApiKey);

  if (!resend) {
    logger.error("Cannot send user answer: missing RESEND_API_KEY");
    return false;
  }

  // Dev: Resend test domain can only email your account owner
  const toEmail = cfg.isDevelopment ? cfg.resendAccountEmail : data.email;
  logger.info("Email recipient determination", {
    originalEmail: data.email,
    isDevelopment: cfg.isDevelopment,
    resendAccountEmail: cfg.resendAccountEmail,
    toEmail,
    reason: cfg.isDevelopment ? "Using account owner email for dev" : "Using user's email for prod",
  });

  if (!toEmail) {
    logger.error("Cannot send user answer: missing recipient email (data.email or RESEND_ACCOUNT_EMAIL)", {
      dataEmail: data.email,
      resendAccountEmail: cfg.resendAccountEmail,
    });
    return false;
  }

  const typeLabels: Record<string, string> = {
    question: "ερώτηση",
    feedback: "feedback",
    video_idea: "ιδέα για βίντεο",
    review: "αξιολόγηση",
  };
  const typeLabel = typeLabels[data.submissionType || "question"] || "υποβολή";

  const greeting = data.name ? `Γεια σας, ${escapeHtmlWithLineBreaks(data.name)},` : "Γεια σας,";
  const subject = `Μικροί Μαθητές — Απάντηση στην ${typeLabel} σας`;

  try {
    const result = await resend.emails.send({
      from: cfg.fromEmail,
      to: toEmail,
      replyTo: cfg.adminEmail || undefined,
      subject,
      html: wrapEmail({
        preheader: `Η απάντησή μας στην ${typeLabel} σας είναι έτοιμη.`,
        title: `Απάντηση στην ${typeLabel} σας`,
        intro: greeting,
        contentHtml: `
          <div style="margin:0;">
            <div style="background:#eef2ff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;white-space:pre-wrap;font-size:15px;line-height:1.7;">
              ${escapeHtmlWithLineBreaks(data.answer)}
            </div>
          </div>
        `,
        cta:
          data.published && cfg.siteUrl
            ? { label: "Δείτε τη σελίδα", href: `${cfg.siteUrl}/epikoinonia` }
            : undefined,
      }),
    });

    if (result.error) {
      logger.error("User answer email failed", result.error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("User answer email threw", err);
    return false;
  }
}

// Legacy exports for backward compatibility
export { wrapEmail };
export const resend = getResendClient(getRuntimeEmailConfig().resendApiKey);