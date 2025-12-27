"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface DonateButtonProps {
  paypalUrl: string;
}

export function DonateButton({ paypalUrl }: DonateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={paypalUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-[65vw] max-w-3xl mx-auto bg-white/80 backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3 rounded-lg border border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 whitespace-nowrap"
      aria-label="Στηρίξτε μας μέσω PayPal"
    >
      {/* Logo */}
      <div className="relative w-[100px] h-[50px] sm:w-[140px] sm:h-[68px] md:w-[176px] md:h-[86px] flex-shrink-0">
        <Image
          src="/images/logo.png"
          alt="Μικροί Μαθητές"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 176px"
        />
      </div>

      {/* Text Content - All on one line */}
      <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-700 group-hover:text-primary-pink transition-colors duration-200">
        Στηρίξτε μας μέσω PayPal
      </span>

      {/* Arrow Icon */}
      <svg
        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-primary-pink transition-all duration-200 flex-shrink-0 ${
          isHovered ? "translate-x-1" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </Link>
  );
}


