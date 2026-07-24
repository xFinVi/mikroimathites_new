import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/utils/logger";

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
 * The client is created lazily on first access to avoid build-time errors
 * when environment variables aren't available during Docker build.
 */
let _supabaseAdmin: ReturnType<typeof createClient> | null | undefined = undefined;
let _configChecked = false;

function getSupabaseAdmin() {
  // Return cached value if already computed (including null)
  if (_supabaseAdmin !== undefined) return _supabaseAdmin;
  
  // Get and trim environment variables (remove any whitespace)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  
  // Log config errors only once (not during build time)
  if (!_configChecked) {
    _configChecked = true;
    
    if (!supabaseUrl) {
      logger.error(
        "❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty in .env.local"
      );
    }

    if (!supabaseServiceKey) {
      logger.error(
        "❌ SUPABASE_SERVICE_ROLE_KEY is missing or empty in .env.local"
      );
    }

    if (supabaseUrl && !isValidUrl(supabaseUrl)) {
      logger.error(
        `❌ NEXT_PUBLIC_SUPABASE_URL is invalid: "${supabaseUrl}"\n` +
        `   Expected format: https://your-project.supabase.co`
      );
    }
  }
  
  // Return null if config is invalid
  if (!supabaseUrl || !supabaseServiceKey || !isValidUrl(supabaseUrl)) {
    _supabaseAdmin = null;
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

// Export as lazy getter - only creates client on first access, not at module load time
// This prevents build-time errors when environment variables aren't available
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient> | null, {
  get(target, prop) {
    const client = getSupabaseAdmin();
    if (!client) return undefined;
    const value = client[prop as keyof typeof client];
    return typeof value === 'function' ? value.bind(client) : value;
  }
}) as ReturnType<typeof createClient> | null;

