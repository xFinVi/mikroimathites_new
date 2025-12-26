/**
 * Utility functions for displaying user-friendly labels for submission data
 */

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

