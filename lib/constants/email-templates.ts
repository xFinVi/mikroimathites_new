/**
 * Email templates for admin replies
 * Admins can click to insert these templates and customize them
 */

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject?: string;
  body: string;
  category: "question" | "feedback" | "video_idea" | "review" | "general";
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "question-answer",
    name: "Απάντηση σε Ερώτηση",
    description: "Τυπική απάντηση για ερωτήσεις",
    category: "question",
    body: `Γεια σας {name},

Σας ευχαριστούμε για την ερώτησή σας:

"{question}"

{answer}

Εάν έχετε περαιτέρω ερωτήσεις, μην διστάσετε να επικοινωνήσετε μαζί μας.

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
  {
    id: "question-published",
    name: "Ερώτηση Δημοσιεύτηκε",
    description: "Όταν μια ερώτηση δημοσιεύεται στο Q&A",
    category: "question",
    body: `Γεια σας {name},

Σας ενημερώνουμε ότι η ερώτησή σας έχει δημοσιευτεί στη σελίδα Q&A μας!

Μπορείτε να τη δείτε εδώ: {siteUrl}/epikoinonia

Ευχαριστούμε για τη συμβολή σας!

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
  {
    id: "feedback-thank-you",
    name: "Ευχαριστώ για Feedback",
    description: "Ευχαριστήριο μήνυμα για feedback",
    category: "feedback",
    body: `Γεια σας {name},

Σας ευχαριστούμε πολύ για το feedback σας:

"{message}"

Η γνώμη σας είναι πολύτιμη για εμάς και μας βοηθά να βελτιώσουμε το περιεχόμενο μας.

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
  {
    id: "video-idea-acknowledgment",
    name: "Επιβεβαίωση Ιδέας Βίντεο",
    description: "Όταν κάποιος προτείνει ιδέα για βίντεο",
    category: "video_idea",
    body: `Γεια σας {name},

Ευχαριστούμε για την ιδέα βίντεο που προτείνατε:

"{message}"

Θα την εξετάσουμε προσεκτικά και θα σας ενημερώσουμε αν την υλοποιήσουμε!

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
  {
    id: "review-thank-you",
    name: "Ευχαριστώ για Αξιολόγηση",
    description: "Ευχαριστήριο μήνυμα για αξιολογήσεις",
    category: "review",
    body: `Γεια σας {name},

Σας ευχαριστούμε για την αξιολόγησή σας!

Η γνώμη σας μας βοηθά να κατανοήσουμε καλύτερα τι λειτουργεί και τι μπορούμε να βελτιώσουμε.

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
  {
    id: "general-response",
    name: "Γενική Απάντηση",
    description: "Γενικό μήνυμα απάντησης",
    category: "general",
    body: `Γεια σας {name},

Σας ευχαριστούμε για το μήνυμά σας:

"{message}"

{answer}

Εάν χρειάζεστε κάτι άλλο, μην διστάσετε να επικοινωνήσετε μαζί μας.

Με εκτίμηση,
Η ομάδα των Μικρών Μαθητών`,
  },
];

/**
 * Replace template variables with actual values
 */
export function replaceTemplateVariables(
  template: string,
  variables: {
    name?: string | null;
    question?: string;
    message?: string;
    answer?: string;
    siteUrl?: string;
  }
): string {
  let result = template;
  
  result = result.replace(/{name}/g, variables.name || "Αγαπητέ/ή χρήστη");
  result = result.replace(/{question}/g, variables.question || "");
  result = result.replace(/{message}/g, variables.message || "");
  result = result.replace(/{answer}/g, variables.answer || "");
  result = result.replace(/{siteUrl}/g, variables.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr");
  
  return result;
}

/**
 * Get templates filtered by category
 */
export function getTemplatesByCategory(category?: string): EmailTemplate[] {
  if (!category || category === "all") {
    return EMAIL_TEMPLATES;
  }
  return EMAIL_TEMPLATES.filter((t) => t.category === category || t.category === "general");
}

