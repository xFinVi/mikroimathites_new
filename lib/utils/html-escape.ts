/**
 * HTML escaping utilities for preventing XSS attacks
 * Used for sanitizing user content before inserting into HTML templates
 */

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

