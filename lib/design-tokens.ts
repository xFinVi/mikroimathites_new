/**
 * Design System Tokens
 * Centralized design system values for consistency across the application
 */

export const designTokens = {
  colors: {
    primary: {
      pink: "#FF6B9D",
    },
    secondary: {
      blue: "#4ECDC4",
    },
    accent: {
      yellow: "#FFD93D",
      green: "#95E1D3",
      orange: "#FFA07A",
    },
    background: {
      light: "#F7F7F7",
      white: "#FFFFFF",
    },
    text: {
      dark: "#2C3E50",
      medium: "#5A6C7D",
      light: "#95A5A6",
    },
  },
  typography: {
    fontFamily: {
      sans: "var(--font-inter)",
      display: "var(--font-poppins)",
    },
    fontSize: {
      h1: { size: "48px", lineHeight: "56px", weight: "bold" },
      h2: { size: "36px", lineHeight: "44px", weight: "bold" },
      h3: { size: "28px", lineHeight: "36px", weight: "600" },
      h4: { size: "24px", lineHeight: "32px", weight: "600" },
      large: { size: "18px", lineHeight: "28px", weight: "regular" },
      base: { size: "16px", lineHeight: "24px", weight: "regular" },
      small: { size: "14px", lineHeight: "20px", weight: "regular" },
    },
  },
  spacing: {
    base: 4, // 4px base unit
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96], // in pixels
  },
  borderRadius: {
    card: "12px",
    button: "8px",
    input: "4px",
  },
  shadows: {
    subtle: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  transitions: {
    duration: "200ms",
    timing: "ease-in-out",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
} as const;

export type DesignTokens = typeof designTokens;

