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
} as const;

