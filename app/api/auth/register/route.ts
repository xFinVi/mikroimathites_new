import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/auth/register
 * Register a new admin user
 * Hidden endpoint - only accessible via direct URL
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email και password είναι υποχρεωτικά" },
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

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin users
      user_metadata: {
        role: "admin",
        isAdmin: true,
        name: name || email.split("@")[0],
      },
    });

    if (error) {
      logger.error("Failed to create admin user", error);
      
      // Handle duplicate email
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "Αυτό το email είναι ήδη καταχωρημένο" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Αποτυχία δημιουργίας λογαριασμού" },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Αποτυχία δημιουργίας χρήστη" },
        { status: 500 }
      );
    }

    // The trigger should automatically create a user record in the users table
    // But we'll verify and update the role to admin if needed
    const { data: userRecord, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, role")
      .eq("id", data.user.id)
      .single();

    if (userError || !userRecord) {
      // If trigger didn't create the record, create it manually
      const { error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: name || data.user.email?.split("@")[0] || "Admin",
          role: "admin",
        });

      if (insertError) {
        logger.error("Failed to create user record in users table", insertError);
        // Don't fail the registration, but log the error
      }
    } else if (userRecord.role !== "admin") {
      // Update role to admin if it's not already set
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ role: "admin" })
        .eq("id", data.user.id);

      if (updateError) {
        logger.error("Failed to update user role to admin", updateError);
      }
    }

    logger.info("Admin user created successfully", { 
      email: data.user.email,
      userId: data.user.id 
    });

    return NextResponse.json({
      success: true,
      message: "Ο λογαριασμός δημιουργήθηκε επιτυχώς",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    logger.error("Registration error", error);
    return NextResponse.json(
      { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}

