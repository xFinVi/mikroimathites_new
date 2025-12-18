import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: true, message: "No secret set; revalidate skipped." });
  }

  const url = new URL(req.url || "");
  const requestSecret = url.searchParams.get("secret") || (await req.json().catch(() => ({})))?.secret;

  if (requestSecret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // For now, revalidate everything coarse-grained; can be refined per payload
  try {
    revalidatePath("/", "page"); // main landing
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: "Failed to revalidate", details: String(err) }, { status: 500 });
  }
}

