/**
 * Forms & Submission Utilities
 * 
 * CLIENT-SAFE: All functions are pure
 * 
 * SECURITY NOTE: escapeHtml is for OUTPUT ESCAPING, not input sanitization.
 * Use for email templates and displaying user content.
 * DO NOT use as a substitute for proper HTML sanitization if you need to allow markup.
 */

// ============================================================================
// LABEL MAPPING
// Used in: components/admin/*, app/api/admin/*
// ============================================================================

/**
 * Get Greek label for topic/category
 */
export function getTopicLabel(topic: string | null): string {
  if (!topic) return "-";
  
  const topicLabels: Record<string, string> = {
    sleep: "Ύπνος & Ρουτίνες",
    speech: "Ομιλία & Λεξιλόγιο",
    food: "Διατροφή & Δυσκολίες",
    emotions: "Συναισθήματα & Συμπεριφορά",
    screens: "Οθόνες & Ψηφιακή Ασφάλεια",
    routines: "Καθημερινές Ρουτίνες",
    other: "Άλλο",
  };
  
  return topicLabels[topic] || topic;
}

/**
 * Get Greek label for age group
 */
export function getAgeGroupLabel(ageGroup: string | null): string {
  if (!ageGroup) return "-";
  
  const ageGroupLabels: Record<string, string> = {
    "0_2": "0-2 ετών",
    "2_4": "2-4 ετών",
    "4_6": "4-6 ετών",
    other: "Άλλο",
  };
  
  return ageGroupLabels[ageGroup] || ageGroup;
}

/**
 * Get Greek label for submission type
 */
export function getTypeLabel(type: string): string {
  const typeLabels: Record<string, string> = {
    question: "Ερώτηση",
    feedback: "Feedback",
    video_idea: "Ιδέα βίντεο",
    review: "Αξιολόγηση",
  };
  
  return typeLabels[type] || type;
}

/**
 * Get Greek label for status
 */
export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    new: "Νέα",
    in_progress: "Σε εξέλιξη",
    answered: "Απαντημένη",
    published: "Δημοσιευμένη",
    archived: "Αρχειοθετημένη",
  };
  
  return statusLabels[status] || status;
}

// ============================================================================
// HTML ESCAPING (for safe output rendering)
// Used in: lib/email/resend.ts, app/api/admin/submissions/[id]/send-reply/route.ts
// 
// PURPOSE: Escape user-provided text for safe insertion into HTML templates (emails)
// NOT FOR: Input sanitization or allowing HTML markup
// ============================================================================

/**
 * Escape HTML special characters to prevent XSS
 * Converts <, >, &, ", ' to their HTML entity equivalents
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Escape HTML but preserve line breaks (convert \n to <br>)
 * Useful for preserving formatting in email templates
 */
export function escapeHtmlWithLineBreaks(text: string): string {
  if (!text) return "";
  
  const escaped = escapeHtml(text);
  // Convert newlines to <br> tags for email display
  return escaped.replace(/\n/g, "<br>");
}

/**
 * Sanitize text for use in HTML attributes
 * Escapes quotes and other special characters
 */
export function escapeHtmlAttribute(text: string): string {
  if (!text) return "";
  
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

