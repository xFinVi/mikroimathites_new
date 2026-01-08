/**
 * Application Constants
 * Centralized configuration values for the entire application
 * Organized by feature/page for easy navigation
 */

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

export const ADMIN_CONSTANTS = {
  SUBMISSIONS: {
    PAGE_SIZE: 20,
    SEARCH_DEBOUNCE_MS: 300, // Reduced for more responsive search
  },
  UI: {
    SUCCESS_MESSAGE_TIMEOUT: 3000,
    ERROR_MESSAGE_TIMEOUT: 8000,
  },
} as const;

// ============================================================================
// CONTACT / COMMUNICATION
// ============================================================================

export const CONTACT_CONSTANTS = {
  // Contact email address (used in epikoinonia, privacy, terms pages)
  // Future: Can add env override: process.env.CONTACT_EMAIL ?? "mikrimathites@outlook.com"
  EMAIL: "mikrimathites@outlook.com",
  
  // Background image path (used in multiple pages)
  BACKGROUND_IMAGE_PATH: "/images/background.png",
  
  // Common section styling (used in epikoinonia page)
  // Prevents "tiny drift" where sections get slightly different classes over time
  SECTION_CLASSES: "max-w-4xl mx-auto bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50",
} as const;

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

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

// ============================================================================
// GIA GONEIS (FOR PARENTS)
// ============================================================================

export const GIA_GONEIS_CONSTANTS = {
  // Pagination
  INITIAL_PAGE_SIZE: 9, // Initial items to show
  LOAD_MORE_SIZE: 9, // Items to load per "Load More" action
  PAGE_SIZE: 18, // Keep for backward compatibility

  // Search debounce timeout in milliseconds
  SEARCH_DEBOUNCE_MS: 500,

  // Image dimensions for different use cases
  IMAGE_SIZES: {
    // Card images in content grids
    CARD: { width: 400, height: 250 },
    // Quick Tips section images
    QUICK_TIP: { width: 400, height: 300 },
    // Open Graph / social sharing images
    OG_IMAGE: { width: 1200, height: 630 },
    // Hero images on detail pages
    HERO: { width: 1200, height: 600 },
  },

  // Color variants for Quick Tips cards (rotating through these)
  QUICK_TIPS_COLOR_VARIANTS: [
    "from-pink-100 to-pink-50 border-pink-200",
    "from-blue-100 to-blue-50 border-blue-200",
    "from-yellow-100 to-yellow-50 border-yellow-200",
    "from-green-100 to-green-50 border-green-200",
  ] as const,
} as const;

// ============================================================================
// DRASTIRIOTITES (ACTIVITIES & PRINTABLES)
// ============================================================================

export const DRASTIRIOTITES_CONSTANTS = {
  PAGE_SIZE: 18,
  IMAGE_SIZES: {
    CARD: { width: 400, height: 250 },
    OG_IMAGE: { width: 1200, height: 630 },
    HERO: { width: 1200, height: 600 },
  },
} as const;

// ============================================================================
// SXETIKA (ABOUT)
// ============================================================================

export const SXETIKA_CONSTANTS = {
  // Author profile picture dimensions
  IMAGE_SIZES: {
    AUTHOR_PROFILE: { width: 300, height: 300 },
  },
} as const;

// ============================================================================
// HOME PAGE
// ============================================================================

// Content limits - how many items to show in each section
export const HOME_PAGE_LIMITS = {
  // Featured content section - shows articles
  FEATURED_CONTENT: 6,
  
  // Featured articles section - shows parent tips
  FEATURED_ARTICLES: 6,
  FEATURED_ARTICLES_GRID: 3, // How many to show in the grid (rest are hidden)
  
  // Activities section
  FEATURED_ACTIVITIES: 4,
  
  // Printables section
  FEATURED_PRINTABLES: 4,
} as const;

// Image dimensions for different use cases
export const HOME_PAGE_IMAGE_SIZES = {
  // Featured content grid images (large cards)
  FEATURED_CONTENT: {
    width: 600,
    height: 400,
  },
  
  // Article/Activity cards in grids
  CARD: {
    width: 400,
    height: 250,
  },
  
  // Featured banner images
  BANNER: {
    width: 800,
    height: 600,
  },
  
  // Home hero image dimensions
  HERO: {
    width: 1920,
    height: 1080,
  },
} as const;

// Video player constants
export const VIDEO_CONSTANTS = {
  // Auto-advance interval in milliseconds (15 seconds)
  AUTO_ADVANCE_INTERVAL: 15000,
  
  // Minimum height for video section
  MIN_HEIGHT: 600,
} as const;

// YouTube video IDs for the home page video sneak peek
export const YOUTUBE_VIDEO_IDS = [
  {
    id: "Irrr-yMZADw",
    title: "Τα Ζωάκια της Φάρμας, Μαθαίνω με την Βικτωρία",
    startTime: 121,
  },
  {
    id: "Wial0HtS1dE",
    title: "Καλά Χριστούγεννα με την Κυρία Βικτωρία, την Ίριδα και Μπρούνο στο Λονδίνο",
    startTime: 313,
  },
  {
    id: "g3RUY8tkkbY",
    title: "Μαθαίνω με την Κυρία Βικτωρία επεισόδιο με την Bluey",
    startTime: 425,
  },
] as const;

