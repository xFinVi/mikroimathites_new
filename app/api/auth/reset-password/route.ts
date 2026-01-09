import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/auth/reset-password
 * Reset password using Supabase recovery token
 * 
 * Flow:
 * 1. Verify the recovery token using public client
 * 2. Get user ID from verified token
 * 3. Update password using admin API
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, type, password } = body;

    if (!token || !type || !password) {
      return NextResponse.json(
        { error: "Token, type και password είναι υποχρεωτικά" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Το password πρέπει να έχει τουλάχιστον 8 χαρακτήρες" },
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    if (!supabaseUrl) {
      logger.error("NEXT_PUBLIC_SUPABASE_URL not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      // We need anon key to verify the recovery token
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
      
      if (!supabaseAnonKey) {
        logger.error("NEXT_PUBLIC_SUPABASE_ANON_KEY not configured - required for password reset");
        return NextResponse.json(
          { 
            error: "Server configuration error: Missing Supabase anon key. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables." 
          },
          { status: 500 }
        );
      }

      // Use public client to verify the recovery token
      const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
      
      // Verify the recovery token
      // Supabase recovery tokens can be verified using verifyOtp
      const { data: verifyData, error: verifyError } = 
        await supabasePublic.auth.verifyOtp({
          token_hash: token,
          type: type as "recovery",
        });

      if (verifyError || !verifyData.user) {
        logger.warn("Invalid or expired recovery token", { 
          error: verifyError,
          hasToken: !!token,
          type 
        });
        return NextResponse.json(
          { error: "Μη έγκυρος ή ληγμένος σύνδεσμος επαναφοράς. Παρακαλώ ζητήστε νέο σύνδεσμο." },
          { status: 400 }
        );
      }

      const userId = verifyData.user.id;

      if (!userId) {
        logger.error("No user ID from verified token");
        return NextResponse.json(
          { error: "Δεν ήταν δυνατή η επαλήθευση του token" },
          { status: 400 }
        );
      }

      // Verify user is admin before allowing password reset
      // Use auth.users instead of public.users table (same approach as forgot-password)
      const { data: authUserData, error: getUserError } = 
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (getUserError || !authUserData.user) {
        logger.warn("User not found during password reset", { userId, error: getUserError });
        return NextResponse.json(
          { error: "Ο χρήστης δεν βρέθηκε" },
          { status: 404 }
        );
      }

      // Check if user is admin (check user_metadata, same as lib/auth/config.ts)
      const isAdmin = authUserData.user.user_metadata?.role === "admin" || 
                      authUserData.user.user_metadata?.isAdmin === true;

      if (!isAdmin) {
        logger.warn("Non-admin user attempted password reset", { userId });
        return NextResponse.json(
          { error: "Μη έγκυρος σύνδεσμος" },
          { status: 403 }
        );
      }

      // Update password using admin API
      const { data: updateData, error: updateError } = 
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
        });

      if (updateError) {
        logger.error("Failed to update password", updateError);
        return NextResponse.json(
          { error: "Αποτυχία ενημέρωσης password" },
          { status: 500 }
        );
      }

      logger.info("Password reset successful", { userId, email: updateData.user?.email });

      return NextResponse.json({
        message: "Το password άλλαξε επιτυχώς",
      });
    } catch (error) {
      logger.error("Password reset error", error);
      return NextResponse.json(
        { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά." },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Reset password error", error);
    return NextResponse.json(
      { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}

