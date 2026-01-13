// lib/email/resend.ts
import "server-only";

import crypto from "node:crypto";
import { Resend } from "resend";
import { logger } from "@/lib/utils/logger";
import { escapeHtmlWithLineBreaks } from "@/lib/utils/forms";

type AppEnv = "development" | "preview" | "production";

type RuntimeEmailConfig = {
  env: AppEnv;
  isDevelopmentLike: boolean; // development OR preview
  siteUrl: string;
  resendApiKey?: string;
  resendAccountEmail?: string;
  adminEmail?: string;
  fromEmail?: string;
};

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeToSingleLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function resolveAppEnv(): AppEnv {
  const vercelEnv = (process.env.VERCEL_ENV || "").toLowerCase();
  if (vercelEnv === "production" || vercelEnv === "preview" || vercelEnv === "development") {
    return vercelEnv as AppEnv;
  }

  const nodeEnv = (process.env.NODE_ENV || "").toLowerCase();
  return nodeEnv === "production" ? "production" : "development";
}

function getRuntimeEmailConfig(): RuntimeEmailConfig {
  const env = resolveAppEnv();
  const isDevelopmentLike = env !== "production";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (env === "development" ? "http://localhost:3000" : "");

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const resendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

  if (process.env.EMAIL_DEBUG === "true") {
    logger.info("Email runtime config (sanitized)", {
      env,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      RESEND_API_KEY: resendApiKey ? "[SET]" : "[NOT SET]",
      RESEND_ACCOUNT_EMAIL: resendAccountEmail || "[NOT SET]",
      ADMIN_EMAIL: adminEmail || "[NOT SET]",
      RESEND_FROM_EMAIL: fromEmail || "[NOT SET]",
    });
  }

  return {
    env,
    isDevelopmentLike,
    siteUrl,
    resendApiKey,
    resendAccountEmail,
    adminEmail,
    fromEmail,
  };
}

function requireResendClient(cfg: RuntimeEmailConfig): Resend {
  if (!cfg.resendApiKey) throw new Error("Missing RESEND_API_KEY");
  return new Resend(cfg.resendApiKey);
}

function requireFromEmail(cfg: RuntimeEmailConfig): string {
  if (!cfg.fromEmail) throw new Error("Missing RESEND_FROM_EMAIL (required)");
  return cfg.fromEmail;
}

function redactEmail(email?: string | null): string | undefined {
  if (!email) return undefined;
  const [user, domain] = email.split("@");
  if (!domain) return "[invalid-email]";
  return `${user?.slice(0, 2) || ""}***@${domain}`;
}

function formatResendError(err: unknown): Record<string, unknown> {
  if (!err || typeof err !== "object") return { err };
  const anyErr = err as any;
  return {
    name: anyErr.name,
    message: anyErr.message,
    statusCode: anyErr.statusCode,
    details: anyErr.details,
  };
}

async function sendWithResendLogging(params: {
  resend: Resend;
  payload: Parameters<Resend["emails"]["send"]>[0];
  cfg: RuntimeEmailConfig;
  purpose: "admin_notification" | "user_answer";
}): Promise<{ ok: boolean; resendId?: string; requestId: string; error?: unknown }> {
  const requestId = crypto.randomUUID();
  const debug = process.env.EMAIL_DEBUG === "true";

  const payloadWithTags = {
    ...params.payload,
    tags: [
      ...(params.payload.tags ?? []),
      { name: "request_id", value: requestId },
      { name: "purpose", value: params.purpose },
      { name: "env", value: params.cfg.env },
    ],
  };

  logger.info("Resend send attempt", {
    requestId,
    purpose: params.purpose,
    env: params.cfg.env,
    from: debug ? payloadWithTags.from : "[hidden]",
    to: Array.isArray(payloadWithTags.to)
      ? payloadWithTags.to.map((t) => (debug ? t : redactEmail(t)))
      : debug
        ? payloadWithTags.to
        : redactEmail(payloadWithTags.to),
    subject: debug ? payloadWithTags.subject : "[hidden]",
  });

  const { data, error } = await params.resend.emails.send(payloadWithTags);

  if (error) {
    logger.error("Resend send failed", {
      requestId,
      purpose: params.purpose,
      env: params.cfg.env,
      error: formatResendError(error),
    });
    return { ok: false, requestId, error };
  }

  logger.info("Resend send success", {
    requestId,
    purpose: params.purpose,
    env: params.cfg.env,
    resendId: (data as any)?.id,
  });

  return { ok: true, requestId, resendId: (data as any)?.id };
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

  const safeTitle = escapeHtml(title);
  const safePreheader = normalizeToSingleLine(escapeHtml(preheader));

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>${safeTitle}</title>
      </head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial, Helvetica, sans-serif;color:#111827;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${safePreheader}
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;">
                <tr>
                  <td style="padding:0 8px 12px 8px;">
                    <div style="font-size:14px;color:#6b7280;letter-spacing:0.2px;">Μικροί Μαθητές</div>
                    <div style="font-size:22px;line-height:1.25;font-weight:700;color:#111827;">${safeTitle}</div>
                  </td>
                </tr>

                <tr>
                  <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px 20px;">
                    ${intro ? `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">${intro}</p>` : ""}

                    ${contentHtml}

                    ${
                      cta
                        ? `
                      <div style="margin-top:22px;text-align:center;">
                        <a href="${cta.href}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;font-size:14px;">
                          ${cta.label}
                        </a>
                      </div>
                    `
                        : ""
                    }

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

  try {
    const resend = requireResendClient(cfg);
    const from = requireFromEmail(cfg);

    const toEmail = cfg.adminEmail || cfg.resendAccountEmail;
    if (!toEmail) throw new Error("Missing ADMIN_EMAIL and RESEND_ACCOUNT_EMAIL");

    const typeLabels: Record<string, string> = {
      question: "Ερώτηση (Q&A)",
      feedback: "Feedback",
      video_idea: "Ιδέα για βίντεο",
      review: "Αξιολόγηση",
    };

    const typeLabel = typeLabels[data.type] || data.type;

    const out = await sendWithResendLogging({
      resend,
      cfg,
      purpose: "admin_notification",
      payload: {
        from,
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
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:15px;line-height:1.7;">${escapeHtmlWithLineBreaks(
                    data.message
                  )}</div>
                </td>
              </tr>
            </table>
          `,
          cta: cfg.siteUrl
            ? { label: "Δείτε στο Dashboard", href: `${cfg.siteUrl}/admin/submissions/${data.submissionId}` }
            : undefined,
        }),
      },
    });

    return out.ok;
  } catch (err) {
    logger.error("Admin notification email threw", formatResendError(err));
    return false;
  }
}

/**
 * Send email to user when their submission is answered
 */
export async function sendAnswerNotificationToUser(data: {
  email: string;
  name?: string | null;
  answer: string;
  published?: boolean;
  submissionType?: string;
}): Promise<boolean> {
  const cfg = getRuntimeEmailConfig();

  try {
    const resend = requireResendClient(cfg);

    const toEmail = cfg.isDevelopmentLike ? cfg.resendAccountEmail : data.email;
    if (!toEmail) {
      throw new Error(
        cfg.isDevelopmentLike
          ? "Missing RESEND_ACCOUNT_EMAIL (required in development/preview)"
          : "Missing recipient email",
      );
    }

    const from = cfg.isDevelopmentLike
      ? "Mikroi Mathites <onboarding@resend.dev>"
      : requireFromEmail(cfg);

    const typeLabels: Record<string, string> = {
      question: "ερώτηση",
      feedback: "feedback",
      video_idea: "ιδέα για βίντεο",
      review: "αξιολόγηση",
    };

    const typeLabel = typeLabels[data.submissionType || "question"] || "υποβολή";
    const greeting = data.name ? `Γεια σας, ${escapeHtmlWithLineBreaks(data.name)},` : "Γεια σας,";
    const subject = `Μικροί Μαθητές — Απάντηση στην ${typeLabel} σας`;

    const out = await sendWithResendLogging({
      resend,
      cfg,
      purpose: "user_answer",
      payload: {
        from,
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
      },
    });

    return out.ok;
  } catch (err) {
    logger.error("User answer email threw", formatResendError(err));
    return false;
  }
}

export function getResend(): Resend {
  const cfg = getRuntimeEmailConfig();
  return requireResendClient(cfg);
}