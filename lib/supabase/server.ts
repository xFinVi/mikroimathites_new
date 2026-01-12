import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/utils/logger";

// Get and trim environment variables (remove any whitespace)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// Validate URL format
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Server-side Supabase admin client using service_role key.
 * 
 * This client uses the REST API (not direct DB connection), so connection pooling
 * is handled automatically by Supabase. Perfect for Next.js serverless functions.
 * 
 * According to Supabase docs:
 * - For serverless/edge functions: Use Supabase JS client (what we're doing)
 * - For persistent servers: Could use direct connection, but not needed here
 * 
 * The client is created lazily - only when actually used, not at module load time.
 * This prevents build-time errors when env vars aren't available.
 */
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;

  // Lazy validation - only check when actually used
  if (!supabaseUrl) {
    logger.error(
      "❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty in .env.local"
    );
    return null;
  }

  if (!supabaseServiceKey) {
    logger.error(
      "❌ SUPABASE_SERVICE_ROLE_KEY is missing or empty in .env.local"
    );
    return null;
  }

  if (!isValidUrl(supabaseUrl)) {
    logger.error(
      `❌ NEXT_PUBLIC_SUPABASE_URL is invalid: "${supabaseUrl}"\n` +
      `   Expected format: https://your-project.supabase.co`
    );
    return null;
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,      // Don't persist session (server-side only)
      autoRefreshToken: false,     // Don't auto-refresh (service role doesn't expire)
      detectSessionInUrl: false,   // Don't detect session in URL (server-side)
    },
  });

  return _supabaseAdmin;
}

export const supabaseAdmin = getSupabaseAdmin();

