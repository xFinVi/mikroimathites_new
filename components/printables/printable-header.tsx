"use client";

import { useState, useEffect } from "react";
import { getRandomHeaderColor, brightHeaderColors } from "@/lib/utils/kid-colors";
import Link from "next/link";

interface PrintableHeaderProps {
  title: string;
}

export function PrintableHeader({ title }: PrintableHeaderProps) {
  const [headerColor, setHeaderColor] = useState<ReturnType<typeof getRandomHeaderColor> | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only generate random color on client side to avoid hydration mismatch
    setIsMounted(true);
    setHeaderColor(getRandomHeaderColor());
  }, []);

  // Ensure we always have a color (fallback to pink if somehow undefined)
  const bgColor = headerColor?.bg || "bg-pink-400";
  const textColor = headerColor?.text || "text-white";

  // Map Tailwind classes to actual hex colors as fallback
  const colorMap: Record<string, string> = {
    "bg-pink-400": "#f472b6",
    "bg-red-400": "#f87171",
    "bg-yellow-400": "#facc15",
    "bg-green-400": "#4ade80",
    "bg-orange-400": "#fb923c",
    "bg-purple-400": "#a78bfa",
  };

  // Show default color during SSR and initial render to avoid hydration mismatch
  if (!isMounted || !headerColor) {
    return (
      <div 
        className="w-full bg-pink-400 transition-colors duration-500 py-8 sm:py-10 md:py-12 shadow-lg relative mt-20"
        style={{ 
          backgroundColor: "#f472b6",
          marginTop: '5rem'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/drastiriotites"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition mb-4 sm:mb-6 relative z-10 cursor-pointer py-2 px-3 -ml-3 rounded-lg hover:bg-white/20 group backdrop-blur-sm"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium text-sm sm:text-base">Επιστροφή στα εκτυπώσιμα</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-lg text-center">
            {title}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full ${bgColor} transition-colors duration-500 py-8 sm:py-10 md:py-12 shadow-lg relative mt-20`}
      style={{ 
        backgroundColor: colorMap[bgColor] || colorMap["bg-pink-400"],
        marginTop: '5rem'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/drastiriotites"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white transition mb-4 sm:mb-6 relative z-10 cursor-pointer py-2 px-3 -ml-3 rounded-lg hover:bg-white/20 group backdrop-blur-sm"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium text-sm sm:text-base">Επιστροφή στα εκτυπώσιμα</span>
        </Link>

        {/* Title - Centered */}
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black ${textColor} leading-tight drop-shadow-lg text-center`}>
          {title}
        </h1>
      </div>
    </div>
  );
}

