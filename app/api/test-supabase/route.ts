import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Test endpoint to verify Supabase connection
 * Visit: http://localhost:3000/api/test-supabase
 */
export async function GET() {
  // Check if Supabase is configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase not configured",
        message: "Check your .env.local file for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 500 }
    );
  }

  try {
    // Test 1: Try to query the submissions table
    const { data, error, count } = await supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .limit(1);

    if (error) {
      // Check if table doesn't exist
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        return NextResponse.json({
          success: false,
          error: "Table 'submissions' does not exist",
          message: "Please run the SQL schema in Supabase SQL Editor",
          sqlFile: "supabase/schema-submissions.sql",
          steps: [
            "1. Go to Supabase dashboard → SQL Editor",
            "2. Open supabase/schema-submissions.sql",
            "3. Copy and paste into SQL Editor",
            "4. Click Run",
          ],
        });
      }

      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      });
    }

    // Test 2: Try inserting a test record
    const testInsert = await supabaseAdmin
      .from("submissions")
      .insert({
        type: "feedback",
        message: "Connection test - can be deleted",
        status: "new",
      })
      .select()
      .single();

    if (testInsert.error) {
      return NextResponse.json({
        success: false,
        error: "Insert test failed",
        details: testInsert.error.message,
      });
    }

    // Test 3: Clean up test record
    await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("id", testInsert.data.id);

    return NextResponse.json({
      success: true,
      message: "Supabase connection is working! ✅",
      tests: {
        connection: "✅ Passed",
        tableExists: "✅ Passed",
        canInsert: "✅ Passed",
        canDelete: "✅ Passed",
      },
      tableCount: count || 0,
      nextSteps: [
        "✅ Database is ready",
        "✅ Forms should work at /epikoinonia",
        "✅ Check Supabase dashboard → Table Editor to see submissions",
      ],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: "Unexpected error",
      message: err.message,
    });
  }
}

