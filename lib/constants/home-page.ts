/**
 * Constants for the home page content limits and image dimensions
 * These values control how many items are displayed in each section
 */

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

