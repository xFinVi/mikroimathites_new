import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // shadcn/ui colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          pink: "#FF6B9D", // Custom design system color
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          blue: "#4ECDC4", // Custom design system color
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          yellow: "#FFD93D", // Custom design system color
          green: "#95E1D3", // Custom design system color
          orange: "#FFA07A", // Custom design system color
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom design system colors (additional)
        "background-light": "#F7F7F7",
        "background-white": "#FFFFFF",
        "text-dark": "#2C3E50",
        "text-medium": "#5A6C7D",
        "text-light": "#95A5A6",
        // Navbar colors (Bing-inspired)
        "nav-dark": "#1a1f3a",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "12px",
        button: "8px",
        input: "4px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"],
      },
      spacing: {
        // 4px base scale
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-to-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "backdrop-fade-in": {
          "0%": { opacity: "0", backdropFilter: "blur(0px)" },
          "100%": { opacity: "1", backdropFilter: "blur(8px)" },
        },
        "menu-item-slide": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "hamburger-top": {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(6px) rotate(0deg)" },
          "100%": { transform: "translateY(6px) rotate(45deg)" },
        },
        "hamburger-middle": {
          "0%": { opacity: "1" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "hamburger-bottom": {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(0deg)" },
          "100%": { transform: "translateY(-6px) rotate(-45deg)" },
        },
        "hamburger-reverse-top": {
          "0%": { transform: "translateY(6px) rotate(45deg)" },
          "50%": { transform: "translateY(6px) rotate(0deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        "hamburger-reverse-middle": {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        "hamburger-reverse-bottom": {
          "0%": { transform: "translateY(-6px) rotate(-45deg)" },
          "50%": { transform: "translateY(-6px) rotate(0deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        "rotate-sun": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "cloud-loop-1": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(calc(100vw + 100%))" },
        },
        "cloud-loop-2": {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(calc(100vw + 150%))" },
        },
        "cloud-loop-3": {
          "0%": { transform: "translateX(calc(100vw + 100%))" },
          "100%": { transform: "translateX(-100%)" },
        },
        "house-celebration": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.05)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
        "door-close": {
          "0%": { transform: "translateX(-50%) rotateY(0deg)" },
          "100%": { transform: "translateX(-50%) rotateY(-90deg)" },
        },
        "celebration-sparkle": {
          "0%": { transform: "translateY(0) scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "translateY(-20px) scale(1) rotate(180deg)", opacity: "1" },
          "100%": { transform: "translateY(-40px) scale(0) rotate(360deg)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 107, 157, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255, 107, 157, 0)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) rotate(360deg)", opacity: "0" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-100%) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "jump-celebration": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "25%": { transform: "translateY(-20px) scale(1.1)" },
          "50%": { transform: "translateY(0) scale(1)" },
          "75%": { transform: "translateY(-10px) scale(1.05)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "rainbow-border": {
          "0%": { borderColor: "#FF6B9D" },
          "25%": { borderColor: "#FFD93D" },
          "50%": { borderColor: "#95E1D3" },
          "75%": { borderColor: "#4ECDC4" },
          "100%": { borderColor: "#FF6B9D" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "rocket-fly": {
          "0%": { transform: "translate(-100px, 100vh) rotate(-45deg)" },
          "50%": { transform: "translate(50vw, 20vh) rotate(0deg)" },
          "100%": { transform: "translate(calc(100vw + 100px), -100px) rotate(45deg)" },
        },
        "rocket-up-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "moon-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))" },
          "50%": { filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
        "slide-in-from-top-2": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-left-2": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out-to-right": "slide-out-to-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "backdrop-fade-in": "backdrop-fade-in 0.3s ease-out",
        "menu-item-slide": "menu-item-slide 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "hamburger-top": "hamburger-top 0.3s ease-in-out forwards",
        "hamburger-middle": "hamburger-middle 0.2s ease-in-out forwards",
        "hamburger-bottom": "hamburger-bottom 0.3s ease-in-out forwards",
        "hamburger-reverse-top": "hamburger-reverse-top 0.3s ease-in-out forwards",
        "hamburger-reverse-middle": "hamburger-reverse-middle 0.2s ease-in-out forwards",
        "hamburger-reverse-bottom": "hamburger-reverse-bottom 0.3s ease-in-out forwards",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-gentle": "float-gentle 2.5s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "shake": "shake 0.5s ease-in-out",
        "rotate-sun": "rotate-sun 20s linear infinite",
        "cloud-loop-1": "cloud-loop-1 30s linear infinite",
        "cloud-loop-2": "cloud-loop-2 40s linear infinite",
        "cloud-loop-3": "cloud-loop-3 35s linear infinite",
        "house-celebration": "house-celebration 2s ease-in-out",
        "door-close": "door-close 1s ease-in-out forwards",
        "celebration-sparkle": "celebration-sparkle 2s ease-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "bounce-gentle": "bounce-gentle 1.5s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float-up": "float-up 8s linear infinite",
        "confetti-fall": "confetti-fall 3s linear infinite",
        "jump-celebration": "jump-celebration 0.8s ease-in-out",
        "rainbow-border": "rainbow-border 3s linear infinite",
        "star-twinkle": "star-twinkle 2s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "rocket-fly": "rocket-fly 15s linear infinite",
        "rocket-up-down": "rocket-up-down 3s ease-in-out infinite",
        "moon-glow": "moon-glow 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "shimmer": "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

