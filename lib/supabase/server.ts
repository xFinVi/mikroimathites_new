import { createClient } from "@supabase/supabase-js";

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

// Better error messages
if (!supabaseUrl) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty in .env.local"
  );
}

if (!supabaseServiceKey) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY is missing or empty in .env.local"
  );
}

if (supabaseUrl && !isValidUrl(supabaseUrl)) {
  console.error(
    `❌ NEXT_PUBLIC_SUPABASE_URL is invalid: "${supabaseUrl}"\n` +
    `   Expected format: https://your-project.supabase.co`
  );
}

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
 * The client is created as a singleton for efficiency, but each API route
 * call gets a fresh HTTP request to Supabase's REST API.
 */
export const supabaseAdmin = 
  supabaseUrl && 
  supabaseServiceKey && 
  isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,      // Don't persist session (server-side only)
          autoRefreshToken: false,     // Don't auto-refresh (service role doesn't expire)
          detectSessionInUrl: false,   // Don't detect session in URL (server-side)
        },
      })
    : null;

