/**
 * Testimonials - approved parent reviews from the Supabase `submissions` table.
 *
 * A review appears here only when `is_approved` is true, which is set from the
 * submitter's publish consent (see app/api/submissions/route.ts) and can be
 * toggled by an admin. Reads use the server-only service-role client, so this
 * must never be imported into a client component.
 */

import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export interface Testimonial {
  quote: string;
  firstName: string;
  rating?: number;
  context?: string;
}

type SubmissionRow = {
  name: string | null;
  message: string | null;
  rating: number | null;
};

/**
 * First name only — take the first whitespace-separated token and drop any
 * parenthetical, so "Δήμητρα Τραχανά (μικρή Μυρτώ)" becomes "Δήμητρα".
 */
function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0].replace(/[(),.]/g, "");
}

export async function getApprovedTestimonials(limit = 6): Promise<Testimonial[]> {
  if (!supabaseAdmin) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("name, message, rating")
      .eq("type", "feedback")
      .eq("is_approved", true)
      .not("name", "is", null)
      .not("message", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // Log the real message/code (a raw PostgrestError logs as an unhelpful "{}")
      logger.error(
        `Failed to fetch approved testimonials: ${error.message}${error.code ? ` (${error.code})` : ""}`
      );
      return [];
    }

    return ((data as SubmissionRow[] | null) ?? [])
      .filter((row): row is SubmissionRow & { name: string; message: string } =>
        Boolean(row.name && row.message)
      )
      .map((row) => ({
        quote: row.message.trim(),
        firstName: firstNameOf(row.name),
        rating: row.rating ?? undefined,
      }))
      .filter((testimonial) => testimonial.quote && testimonial.firstName);
  } catch (error) {
    // supabaseAdmin throws here if env vars are missing (e.g. local without keys)
    logger.error("Testimonials query threw", error);
    return [];
  }
}
