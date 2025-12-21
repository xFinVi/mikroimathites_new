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

  // Revalidate paths asynchronously to avoid React flushSync warnings
  try {
    // Revalidate main pages
    revalidatePath("/", "page");
    revalidatePath("/gia-goneis", "page");
    revalidatePath("/drastiriotites", "page");
    revalidatePath("/epikoinonia", "page");
    revalidatePath("/sxetika", "page");
    
    // Revalidate dynamic routes (layout-level)
    revalidatePath("/gia-goneis", "layout");
    revalidatePath("/drastiriotites", "layout");
    revalidatePath("/age", "layout");
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      paths: ["/", "/gia-goneis", "/drastiriotites", "/epikoinonia", "/sxetika", "/age"]
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ 
      error: "Failed to revalidate", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

