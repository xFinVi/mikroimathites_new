import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { resend, wrapEmail } from "@/lib/email/resend";
import { escapeHtmlWithLineBreaks } from "@/lib/utils/forms";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Send password reset email to admin user
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Το email είναι υποχρεωτικό" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      logger.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Check if user exists and is admin
    // Use auth.users instead of public.users table (more reliable, no migration needed)
    // This matches the approach in lib/auth/config.ts
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      logger.error("Failed to list users", listError);
      return NextResponse.json(
        { error: "Server error" },
        { status: 500 }
      );
    }

    // Find user by email
    const user = authUsers.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      logger.warn("Password reset requested for non-existent user", { email });
      return NextResponse.json({
        message:
          "Αν το email υπάρχει στο σύστημα, θα λάβετε email με οδηγίες.",
      });
    }

    // Check if user is admin (check user_metadata, same as lib/auth/config.ts)
    const isAdmin = user.user_metadata?.role === "admin" || 
                    user.user_metadata?.isAdmin === true;

    if (!isAdmin) {
      // Don't reveal that user exists but isn't admin
      logger.warn("Password reset requested for non-admin user", { email });
      return NextResponse.json({
        message:
          "Αν το email υπάρχει στο σύστημα, θα λάβετε email με οδηγίες.",
      });
    }

    // Use Supabase's password reset to generate a proper reset link
    // This generates a secure recovery token that expires in 1 hour
    const { data: resetData, error: resetError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: email.toLowerCase(),
      });

    if (resetError || !resetData) {
      logger.error("Failed to generate password reset link", resetError);
      return NextResponse.json(
        { error: "Αποτυχία δημιουργίας reset link" },
        { status: 500 }
      );
    }

    // Extract the reset token from the URL
    // Supabase's generateLink returns a full URL with token in hash or query params
    const resetLink = resetData.properties.action_link;
    
    // Parse the URL to extract token
    let token: string | null = null;
    let type: string | null = null;
    
    try {
      const resetUrl = new URL(resetLink);
      // Token might be in hash (#access_token=...) or query params (?token=...)
      const hashParams = new URLSearchParams(resetUrl.hash.substring(1));
      token = hashParams.get("access_token") || resetUrl.searchParams.get("token");
      type = hashParams.get("type") || resetUrl.searchParams.get("type") || "recovery";
      
      // If still no token, try to extract from the full URL
      if (!token) {
        // Supabase recovery links sometimes have token in the path or hash
        const hashMatch = resetLink.match(/[#&]access_token=([^&]+)/);
        if (hashMatch) {
          token = hashMatch[1];
        }
      }
    } catch (urlError) {
      logger.error("Failed to parse reset link URL", urlError);
    }

    // Build reset URL
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    
    let customResetUrl: string;
    if (!token) {
      logger.error("No token found in reset link", { resetLink });
      // Fallback: use the full Supabase link (will redirect to our page)
      customResetUrl = resetLink;
    } else {
      // Build our custom reset URL
      customResetUrl = `${siteUrl}/auth/reset-password?token=${encodeURIComponent(token)}&type=${type || "recovery"}`;
    }

    // Send email via Resend
    if (!resend) {
      logger.error("Resend not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const runtimeSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    const runtimeIsDevelopment =
      runtimeSiteUrl.includes("localhost") ||
      runtimeSiteUrl.includes("127.0.0.1");
    // In development, Resend test domain only allows sending to verified account email
    // In production, send to the actual user's email
    const verifiedResendEmail = "philterzidis@hotmail.com"; // Verified Resend account email
    
    const activeEmailFrom = runtimeIsDevelopment
      ? "Mikroi Mathites <onboarding@resend.dev>"
      : process.env.RESEND_FROM_EMAIL ||
        "Mikroi Mathites <noreply@mikroimathites.gr>";

    // In development, send to verified Resend account email (required for test domain)
    // In production, send to the actual user's email
    const recipientEmail = runtimeIsDevelopment
      ? verifiedResendEmail
      : email.toLowerCase();

    try {
      logger.info("Sending password reset email", {
        from: activeEmailFrom,
        to: recipientEmail,
        isDevelopment: runtimeIsDevelopment,
        resetUrl: customResetUrl.substring(0, 50) + "...",
      });

      const emailResult = await resend.emails.send({
        from: activeEmailFrom,
        to: recipientEmail,
        subject: "Επαναφορά Password - Μικροί Μαθητές",
        html: wrapEmail({
          preheader: "Οδηγίες για την επαναφορά του password σας",
          title: "Επαναφορά Password",
          intro: "Γεια σας,",
          contentHtml: `
            <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#111827;">
              Έχετε ζητήσει επαναφορά του password σας. Κάντε κλικ στο παρακάτω κουμπί για να ορίσετε νέο password.
            </p>
            <p style="margin:0 0 16px 0;font-size:14px;color:#6b7280;line-height:1.6;">
              ⚠️ <strong>Σημαντικό:</strong> Αυτός ο σύνδεσμος θα λήξει σε 1 ώρα.
            </p>
            <p style="margin:0 0 16px 0;font-size:14px;color:#6b7280;line-height:1.6;">
              Αν δεν ζητήσατε εσείς αυτή την επαναφορά, μπορείτε να αγνοήσετε αυτό το email.
            </p>
          `,
          cta: {
            label: "Επαναφορά Password",
            href: customResetUrl,
          },
          footerNote:
            "Αυτός ο σύνδεσμος λήγει σε 1 ώρα. Αν δεν λειτουργεί, αντιγράψτε τον και επικολλήστε τον στον browser σας.",
        }),
      });

      if (emailResult.error) {
        logger.error("Resend API error", {
          error: emailResult.error,
          recipient: recipientEmail,
          isDevelopment: runtimeIsDevelopment,
        });
        
        // In development, if it's a validation error (test domain restriction),
        // log it but don't throw - user will get generic success message anyway
        if (runtimeIsDevelopment && emailResult.error.statusCode === 403) {
          logger.warn("Email send failed in development due to Resend test domain restriction", {
            message: emailResult.error.message,
            suggestion: "In development, emails are sent to RESEND_ACCOUNT_EMAIL. Make sure it matches your verified Resend account email.",
          });
          // Still return success to user (security best practice)
          return NextResponse.json({
            message:
              "Αν το email υπάρχει στο σύστημα, θα λάβετε email με οδηγίες.",
          });
        }
        
        // For other errors or in production, throw to be caught by outer catch
        throw new Error(`Email send failed: ${JSON.stringify(emailResult.error)}`);
      }

      logger.info("Password reset email sent successfully", {
        email: email.toLowerCase(),
        recipient: recipientEmail,
        emailId: emailResult.data?.id,
      });
    } catch (emailError) {
      logger.error("Failed to send password reset email", {
        error: emailError,
        recipient: recipientEmail,
        from: activeEmailFrom,
      });
      // Still return success to user (don't reveal if email failed)
      return NextResponse.json({
        message:
          "Αν το email υπάρχει στο σύστημα, θα λάβετε email με οδηγίες.",
      });
    }

    return NextResponse.json({
      message:
        "Αν το email υπάρχει στο σύστημα, θα λάβετε email με οδηγίες.",
    });
  } catch (error) {
    logger.error("Forgot password error", error);
    return NextResponse.json(
      { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}
