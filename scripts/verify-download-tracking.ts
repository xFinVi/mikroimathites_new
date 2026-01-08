/**
 * Script to verify download tracking setup
 * Run with: npx tsx scripts/verify-download-tracking.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDownloadTracking() {
  console.log('🔍 Verifying download tracking setup...\n');

  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('content_downloads')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('not found')) {
        console.log('❌ Table "content_downloads" does NOT exist');
        console.log('\n📋 To fix this, run the migration in Supabase Dashboard:');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Copy contents of: supabase/migrations/create-content-downloads.sql');
        console.log('   3. Paste and run the SQL');
        console.log('\n   Or use the Supabase CLI:');
        console.log('   supabase migration up');
        return;
      }
      throw error;
    }

    console.log('✅ Table "content_downloads" exists');

    // Get download count
    const { count, error: countError } = await supabase
      .from('content_downloads')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    console.log(`📊 Total downloads tracked: ${count || 0}`);

    // Check recent downloads
    const { data: recent, error: recentError } = await supabase
      .from('content_downloads')
      .select('content_slug, downloaded_at')
      .order('downloaded_at', { ascending: false })
      .limit(5);

    if (recentError) {
      throw recentError;
    }

    if (recent && recent.length > 0) {
      console.log('\n📥 Recent downloads:');
      recent.forEach((dl, idx) => {
        console.log(`   ${idx + 1}. ${dl.content_slug} - ${new Date(dl.downloaded_at).toLocaleString()}`);
      });
    } else {
      console.log('\n📥 No downloads tracked yet');
    }

    console.log('\n✅ Download tracking is properly configured!');

  } catch (error: any) {
    console.error('❌ Error verifying download tracking:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    process.exit(1);
  }
}

verifyDownloadTracking();

