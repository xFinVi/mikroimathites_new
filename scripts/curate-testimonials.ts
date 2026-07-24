/**
 * Curate homepage testimonials.
 *
 * 1. Restore genuine consent state: revert the 3 reviews that were wrongly
 *    force-approved back to is_approved=false. Georgina stays true (per owner).
 *    Μαριαντζελα is left untouched — her consent is genuine and she's a question.
 * 2. Upsert 3 curated testimonials (Greek, based on real public Facebook reviews,
 *    names anonymized) with is_approved=true.
 *
 * Idempotent — safe to re-run (fixed ids for the curated rows).
 * Run with: npx tsx scripts/curate-testimonials.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);

// Reviews my earlier SQL wrongly flipped — restore to their genuine (false) state.
const REVERT_TO_FALSE = [
  "1188f4d1-bb8b-40fb-bf98-96c627457776", // Κωνσταντίνα
  "a91f85ac-2c72-4dc5-8e46-9a6e072bb265", // Ευαγγελία
  "4611deed-22db-4cd7-bd4a-34c1a8db29f4", // Μαρία παρδαλη
];

const CURATED_NOTE = "Curated from public Facebook review; name anonymized for privacy.";

const CURATED = [
  {
    id: "c0000001-0000-4000-8000-000000000001",
    name: "Ιωάννα",
    message:
      "Τα βίντεο επικεντρώνονται στην εκμάθηση και στην ψυχοκινητική εξέλιξη των παιδιών, με καθαρή και σωστή ομιλία. Ακριβώς αυτό που ψάχναμε για τον μικρό μας.",
    rating: 5,
  },
  {
    id: "c0000002-0000-4000-8000-000000000002",
    name: "Νίκος",
    message:
      "Πανέμορφα εκπαιδευτικά βίντεο για παιδιά στα Ελληνικά! Μέσα σε λίγο διάστημα τα παιδιά την έχουν λατρέψει. Μπράβο κυρία Βικτώρια!",
    rating: 5,
  },
  {
    id: "c0000003-0000-4000-8000-000000000003",
    name: "Ελένη",
    message:
      "Η κόρη μου το ευχαριστιέται πάρα πολύ! Είστε η καλύτερη, συνεχίστε έτσι! ❤️",
    rating: 5,
  },
];

async function main() {
  // 1a. Revert the wrongly-flipped reviews
  const { error: revertError } = await supabase
    .from("submissions")
    .update({ is_approved: false })
    .in("id", REVERT_TO_FALSE);
  if (revertError) throw new Error(`Revert failed: ${revertError.message}`);
  console.log(`✅ Reverted ${REVERT_TO_FALSE.length} reviews to is_approved=false`);

  // 1b. Ensure Georgina stays approved (explicit, idempotent)
  const { error: georginaError } = await supabase
    .from("submissions")
    .update({ is_approved: true })
    .eq("id", "536c7ccd-9105-4be0-9369-2a5ac74432e5");
  if (georginaError) throw new Error(`Georgina update failed: ${georginaError.message}`);
  console.log("✅ Georgina kept is_approved=true");

  // 2. Upsert curated testimonials
  const rows = CURATED.map((c) => ({
    id: c.id,
    type: "feedback",
    name: c.name,
    email: null,
    message: c.message,
    rating: c.rating,
    is_approved: true,
    status: "published",
    source_page: null,
    admin_notes: CURATED_NOTE,
  }));
  const { error: upsertError } = await supabase
    .from("submissions")
    .upsert(rows, { onConflict: "id" });
  if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`);
  console.log(`✅ Upserted ${rows.length} curated testimonials (is_approved=true)`);
}

main().catch((error) => {
  console.error("❌", error.message);
  process.exit(1);
});
