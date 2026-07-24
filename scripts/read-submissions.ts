/**
 * Read-only: dump all submissions so we can see the real is_approved state.
 * Run with: npx tsx scripts/read-submissions.ts
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

async function main() {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, name, message, rating, is_approved, status, admin_notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Query failed:", error.message);
    process.exit(1);
  }

  console.log(`Total rows: ${data?.length ?? 0}\n`);
  for (const row of data ?? []) {
    console.log(
      [
        `approved=${row.is_approved}`.padEnd(16),
        `type=${row.type}`.padEnd(18),
        `rating=${row.rating ?? "-"}`.padEnd(10),
        `name=${row.name ?? "-"}`.padEnd(24),
        `status=${row.status}`,
      ].join(" ")
    );
    console.log(`   id: ${row.id}`);
    console.log(`   msg: ${(row.message ?? "").replace(/\s+/g, " ").slice(0, 100)}`);
    if (row.admin_notes) console.log(`   notes: ${row.admin_notes}`);
    console.log();
  }
}

main();
