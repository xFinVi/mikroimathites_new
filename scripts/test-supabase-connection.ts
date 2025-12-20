/**
 * Test Supabase Connection
 * 
 * Run this script to verify your Supabase connection is working:
 * npx tsx scripts/test-supabase-connection.ts
 * 
 * Or use: npm run test:supabase (if added to package.json)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables!");
  console.error("Make sure .env.local has:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log("🔍 Testing Supabase connection...\n");
  console.log(`📍 URL: ${supabaseUrl}\n`);

  try {
    // Test 1: Check if we can query the submissions table
    console.log("1️⃣ Testing table access...");
    const { data, error } = await supabase
      .from("submissions")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.error("   ❌ Table 'submissions' does not exist!");
        console.error("   📝 Please run the SQL schema in Supabase SQL Editor");
        console.error("   📄 File: supabase/schema-submissions.sql\n");
        return false;
      }
      throw error;
    }

    console.log("   ✅ Table access working!\n");

    // Test 2: Try inserting a test record
    console.log("2️⃣ Testing insert capability...");
    const { data: insertData, error: insertError } = await supabase
      .from("submissions")
      .insert({
        type: "feedback",
        message: "Test connection - can be deleted",
        status: "new",
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log("   ✅ Insert working!");
    console.log(`   📝 Test record ID: ${insertData.id}\n`);

    // Test 3: Clean up test record
    console.log("3️⃣ Cleaning up test record...");
    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", insertData.id);

    if (deleteError) {
      console.warn("   ⚠️  Could not delete test record (not critical)");
    } else {
      console.log("   ✅ Test record deleted\n");
    }

    console.log("✅ All tests passed! Supabase is connected and working.\n");
    return true;
  } catch (error: any) {
    console.error("❌ Connection test failed!\n");
    console.error("Error:", error.message);
    if (error.code) {
      console.error("Code:", error.code);
    }
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your .env.local file");
    console.error("   2. Verify Supabase project is active");
    console.error("   3. Make sure you ran the SQL schema");
    console.error("   4. Check Supabase dashboard → Logs for errors\n");
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });

