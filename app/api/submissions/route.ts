import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

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
  child_age_group?: "0-2" | "2-4" | "4-6" | "other";
  topic?: "sleep" | "speech" | "food" | "emotions" | "screens" | "routines" | "other";
  source_page?: string;
  content_slug?: string;
  publish_consent?: boolean; // For Q&A form
}

function normalizeType(type: IncomingType): "video_idea" | "feedback" | "question" | "review" {
  if (type === "video-idea") return "video_idea";
  if (type === "question") return "question";
  if (type === "review" || type === "rating") return "review";
  // suggestion/other -> treat as feedback
  return "feedback";
}

function normalizeAgeGroup(age?: string): "0_2" | "2_4" | "4_6" | "other" | null {
  if (!age) return null;
  const normalized = age.replace("-", "_");
  if (["0_2", "2_4", "4_6", "other"].includes(normalized)) {
    return normalized as "0_2" | "2_4" | "4_6" | "other";
  }
  return null;
}

function normalizeTopic(topic?: string): "sleep" | "speech" | "food" | "emotions" | "screens" | "routines" | "other" | null {
  if (!topic) return null;
  const normalized = topic.replace("-", "_");
  if (["sleep", "speech", "food", "emotions", "screens", "routines", "other"].includes(normalized)) {
    return normalized as "sleep" | "speech" | "food" | "emotions" | "screens" | "routines" | "other";
  }
  return null;
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

  const { type, name, email, message, rating, child_age_group, topic, source_page, content_slug, publish_consent } = body;
  if (!type || !message) {
    return NextResponse.json({ error: "Missing required fields: type, message" }, { status: 400 });
  }

  const dbType = normalizeType(type);
  const dbRating = rating ? Math.max(1, Math.min(5, Math.round(rating))) : null;
  const dbAgeGroup = normalizeAgeGroup(child_age_group);
  const dbTopic = normalizeTopic(topic);
  
  // Get source page from request headers if not provided
  const referer = req.headers.get("referer");
  const finalSourcePage = source_page || referer || null;

  const { error } = await supabaseAdmin
    .from("submissions")
    .insert({
      type: dbType,
      name: name || null,
      email: email || null,
      message,
      rating: dbRating,
      child_age_group: dbAgeGroup,
      topic: dbTopic,
      source_page: finalSourcePage,
      content_slug: content_slug || null,
      is_approved: publish_consent || false,
      status: "new",
    });

  if (error) {
    logger.error("Supabase insert error", error);
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

