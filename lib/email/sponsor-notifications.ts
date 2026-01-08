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
                      Με εκτίμηση,<nobr></nobr><br>
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
 * Send email notification to admin when a new sponsor application is received
 */
export async function sendSponsorApplicationNotification(data: {
  applicationId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  website?: string;
  category?: string;
  sponsorType?: string;
}): Promise<boolean> {
  const runtimeResendApiKey = process.env.RESEND_API_KEY?.trim();
  const runtimeSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const runtimeIsDevelopment = runtimeSiteUrl.includes('localhost') || runtimeSiteUrl.includes('127.0.0.1');
  const runtimeResendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "mikrimathites@outlook.com";
  const runtimeAdminEmail = process.env.ADMIN_EMAIL?.trim();
  
  const activeResend = runtimeResendApiKey ? new Resend(runtimeResendApiKey) : null;
  
  if (!activeResend) {
    logger.warn("Cannot send email: Resend not configured");
    return false;
  }

  const recipientEmail = runtimeIsDevelopment ? runtimeResendAccountEmail : (runtimeAdminEmail || runtimeResendAccountEmail);
  
  if (!recipientEmail) {
    logger.warn("Cannot send email: No recipient email configured");
    return false;
  }

  const activeEmailFrom = runtimeIsDevelopment 
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";

  try {
    const categoryLabels: Record<string, string> = {
      education: "Εκπαίδευση",
      health: "Υγεία",
      local: "Τοπικό",
      tech: "Τεχνολογία",
      other: "Άλλο",
    };

    const typeLabels: Record<string, string> = {
      business: "Επιχείρηση",
      individual: "Άτομο",
      organization: "Οργανισμός",
    };

    const categoryLabel = data.category ? categoryLabels[data.category] || data.category : "Δεν καθορίστηκε";
    const typeLabel = data.sponsorType ? typeLabels[data.sponsorType] || data.sponsorType : "Δεν καθορίστηκε";

    await activeResend.emails.send({
      from: activeEmailFrom,
      to: recipientEmail,
      subject: `Νέα αίτηση χορηγού: ${data.companyName}`,
      html: wrapEmail({
        preheader: `Νέα αίτηση χορηγού από ${data.companyName}`,
        title: "Νέα αίτηση χορηγού",
        intro: "Έχετε λάβει μια νέα αίτηση για χορηγία.",
        contentHtml: `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;">
            <tr>
              <td style="padding:0 0 14px 0;">
                <div style="font-size:14px;color:#6b7280;">Στοιχεία εταιρείας</div>
                <div style="margin-top:8px;font-size:15px;line-height:1.7;">
                  <div><strong>Εταιρεία:</strong> ${escapeHtmlWithLineBreaks(data.companyName)}</div>
                  <div><strong>Επικοινωνία:</strong> ${escapeHtmlWithLineBreaks(data.contactName)}</div>
                  <div><strong>Email:</strong> ${escapeHtmlWithLineBreaks(data.contactEmail)}</div>
                  ${data.website ? `<div><strong>Ιστοσελίδα:</strong> <a href="${data.website}" style="color:#4f46e5;">${escapeHtmlWithLineBreaks(data.website)}</a></div>` : ""}
                  <div><strong>Κατηγορία:</strong> ${escapeHtmlWithLineBreaks(categoryLabel)}</div>
                  <div><strong>Τύπος:</strong> ${escapeHtmlWithLineBreaks(typeLabel)}</div>
                </div>
              </td>
            </tr>
          </table>
        `,
        cta: {
          label: "Δείτε την αίτηση",
          href: `${runtimeSiteUrl}/admin/sponsor-applications/${data.applicationId}`,
        },
      }),
    });
    return true;
  } catch (error) {
    logger.error("Failed to send sponsor application notification email", error);
    return false;
  }
}

/**
 * Send confirmation email to applicant when application is approved
 */
export async function sendSponsorApprovalConfirmation(data: {
  email: string;
  companyName: string;
  contactName: string;
}): Promise<boolean> {
  const runtimeResendApiKey = process.env.RESEND_API_KEY?.trim();
  const runtimeSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const runtimeIsDevelopment = runtimeSiteUrl.includes('localhost') || runtimeSiteUrl.includes('127.0.0.1');
  const runtimeResendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "mikrimathites@outlook.com";
  
  const activeResend = runtimeResendApiKey ? new Resend(runtimeResendApiKey) : null;
  
  if (!activeResend) {
    logger.warn("Cannot send email: Resend not configured");
    return false;
  }

  const recipientEmail = runtimeIsDevelopment ? runtimeResendAccountEmail : data.email.toLowerCase();
  
  const activeEmailFrom = runtimeIsDevelopment 
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";

  try {
    await activeResend.emails.send({
      from: activeEmailFrom,
      to: recipientEmail,
      subject: `Η αίτησή σας για χορηγία έχει εγκριθεί`,
      html: wrapEmail({
        preheader: `Η αίτησή σας για χορηγία από ${data.companyName} έχει εγκριθεί`,
        title: "Η αίτησή σας έχει εγκριθεί!",
        intro: `Αγαπητέ/ή ${escapeHtmlWithLineBreaks(data.contactName)},`,
        contentHtml: `
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">
            Είμαστε ενθουσιασμένοι να σας ενημερώσουμε ότι η αίτησή σας για χορηγία από την <strong>${escapeHtmlWithLineBreaks(data.companyName)}</strong> έχει εγκριθεί!
          </p>
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">
            Το λογότυπό σας θα εμφανίζεται σύντομα στην ιστοσελίδα μας. Θα σας ενημερώσουμε όταν το λογότυπο σας είναι online.
          </p>
        `,
      }),
    });
    return true;
  } catch (error) {
    logger.error("Failed to send sponsor approval confirmation email", error);
    return false;
  }
}

/**
 * Send rejection email to applicant (optional)
 */
export async function sendSponsorRejectionNotification(data: {
  email: string;
  companyName: string;
  contactName: string;
  reason?: string;
}): Promise<boolean> {
  const runtimeResendApiKey = process.env.RESEND_API_KEY?.trim();
  const runtimeSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const runtimeIsDevelopment = runtimeSiteUrl.includes('localhost') || runtimeSiteUrl.includes('127.0.0.1');
  const runtimeResendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL?.trim() || "mikrimathites@outlook.com";
  
  const activeResend = runtimeResendApiKey ? new Resend(runtimeResendApiKey) : null;
  
  if (!activeResend) {
    logger.warn("Cannot send email: Resend not configured");
    return false;
  }

  const recipientEmail = runtimeIsDevelopment ? runtimeResendAccountEmail : data.email.toLowerCase();
  
  const activeEmailFrom = runtimeIsDevelopment 
    ? "Mikroi Mathites <onboarding@resend.dev>"
    : process.env.RESEND_FROM_EMAIL || "Mikroi Mathites <noreply@mikroimathites.gr>";

  try {
    await activeResend.emails.send({
      from: activeEmailFrom,
      to: recipientEmail,
      subject: `Απόρριψη αίτησης χορηγίας`,
      html: wrapEmail({
        preheader: `Η αίτησή σας για χορηγία από ${data.companyName} δεν μπόρεσε να εγκριθεί`,
        title: "Απόρριψη αίτησης",
        intro: `Αγαπητέ/ή ${escapeHtmlWithLineBreaks(data.contactName)},`,
        contentHtml: `
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">
            Ευχαριστούμε για το ενδιαφέρον σας να γίνετε χορηγός. Δυστυχώς, η αίτησή σας από την <strong>${escapeHtmlWithLineBreaks(data.companyName)}</strong> δεν μπόρεσε να εγκριθεί αυτή τη στιγμή.
          </p>
          ${data.reason ? `
            <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">
              <strong>Σχόλιο:</strong> ${escapeHtmlWithLineBreaks(data.reason)}
            </p>
          ` : ""}
          <p style="margin:0;font-size:16px;line-height:1.6;color:#111827;">
            Αν έχετε ερωτήσεις, μη διστάσετε να επικοινωνήσετε μαζί μας.
          </p>
        `,
      }),
    });
    return true;
  } catch (error) {
    logger.error("Failed to send sponsor rejection notification email", error);
    return false;
  }
}

