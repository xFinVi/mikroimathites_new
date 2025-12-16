import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

type IncomingType =
  | "video-idea"
  | "feedback"
  | "question"
  | "review"
  | "rating"
  | "suggestion"
  | "other";

interface SubmissionPayload {
  type: IncomingType;
  name?: string;
  email?: string;
  message: string;
  rating?: number;
  source_page?: string;
  content_slug?: string;
}

function normalizeType(type: IncomingType): "video_idea" | "feedback" | "question" | "review" {
  if (type === "video-idea") return "video_idea";
  if (type === "question") return "question";
  if (type === "review" || type === "rating") return "review";
  // suggestion/other -> treat as feedback
  return "feedback";
}

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  let body: SubmissionPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, name, email, message, rating, source_page, content_slug } = body;
  if (!type || !message) {
    return NextResponse.json({ error: "Missing required fields: type, message" }, { status: 400 });
  }

  const dbType = normalizeType(type);
  const dbRating = rating ? Math.max(1, Math.min(5, Math.round(rating))) : null;

  const { error } = await supabaseAdmin
    .from("submissions")
    .insert({
      type: dbType,
      name: name || null,
      email: email || null,
      message,
      rating: dbRating,
      source_page: source_page || null,
      content_slug: content_slug || null,
      is_approved: false,
      status: "new",
    });

  if (error) {
    console.error("Supabase insert error", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Admin listing placeholder (not exposed publicly for security)
export async function GET() {
  return NextResponse.json(
    { error: "Admin listing not exposed. Use Supabase dashboard or add auth-protected admin route." },
    { status: 401 }
  );
}

