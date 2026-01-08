/**
 * Kid-friendly color palette for printable pages
 * Soft, playful colors that are easy on the eyes
 */

export const kidColors = [
  // Soft pastels for page backgrounds
  { bg: "from-pink-100 to-pink-50", text: "text-pink-800", accent: "pink-200" },
  { bg: "from-blue-100 to-blue-50", text: "text-blue-800", accent: "blue-200" },
  { bg: "from-yellow-100 to-yellow-50", text: "text-yellow-800", accent: "yellow-200" },
  { bg: "from-green-100 to-green-50", text: "text-green-800", accent: "green-200" },
  { bg: "from-purple-100 to-purple-50", text: "text-purple-800", accent: "purple-200" },
  { bg: "from-orange-100 to-orange-50", text: "text-orange-800", accent: "orange-200" },
  { bg: "from-cyan-100 to-cyan-50", text: "text-cyan-800", accent: "cyan-200" },
  { bg: "from-rose-100 to-rose-50", text: "text-rose-800", accent: "rose-200" },
  { bg: "from-lime-100 to-lime-50", text: "text-lime-800", accent: "lime-200" },
  { bg: "from-indigo-100 to-indigo-50", text: "text-indigo-800", accent: "indigo-200" },
  { bg: "from-teal-100 to-teal-50", text: "text-teal-800", accent: "teal-200" },
  { bg: "from-amber-100 to-amber-50", text: "text-amber-800", accent: "amber-200" },
] as const;

/**
 * Bright, vibrant colors for headers and prominent elements
 * Eye-catching colors that kids love
 * Colors: pink, red, yellow, green, orange, purple
 */
export const brightHeaderColors = [
  { bg: "bg-pink-400", text: "text-white", hover: "hover:bg-pink-500" },
  { bg: "bg-red-400", text: "text-white", hover: "hover:bg-red-500" },
  { bg: "bg-yellow-400", text: "text-white", hover: "hover:bg-yellow-500" },
  { bg: "bg-green-400", text: "text-white", hover: "hover:bg-green-500" },
  { bg: "bg-orange-400", text: "text-white", hover: "hover:bg-orange-500" },
  { bg: "bg-purple-400", text: "text-white", hover: "hover:bg-purple-500" },
] as const;

/**
 * Get a random kid-friendly color based on slug (deterministic)
 * This ensures the same printable always gets the same color
 */
export function getColorForSlug(slug: string): typeof kidColors[number] {
  // Use slug to generate a consistent index
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % kidColors.length;
  return kidColors[index];
}

/**
 * Get a truly random color (different each visit)
 */
export function getRandomColor(): typeof kidColors[number] {
  const index = Math.floor(Math.random() * kidColors.length);
  return kidColors[index];
}

/**
 * Get a random bright header color (different each visit)
 * Perfect for title headers and prominent elements
 */
export function getRandomHeaderColor(): typeof brightHeaderColors[number] {
  const index = Math.floor(Math.random() * brightHeaderColors.length);
  return brightHeaderColors[index];
}

