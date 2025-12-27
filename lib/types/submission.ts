/**
 * TypeScript types for submission data
 */

export interface Submission {
  id: string;
  type: "question" | "feedback" | "video_idea" | "review";
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  child_age_group: string | null;
  topic: string | null;
  status: "new" | "in_progress" | "answered" | "published" | "archived";
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  source_page?: string | null;
  admin_reply?: string | null;
  admin_notes?: string | null;
  admin_reply_sent_at?: string | null;
  published_to_sanity?: boolean;
  sanity_qa_item_id?: string | null;
}

export interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


