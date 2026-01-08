"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface BecomeSponsorCardProps {
  href?: string;
}

export function BecomeSponsorCard({ href = "/epikoinonia" }: BecomeSponsorCardProps) {
  return (
    <Link
      href={href}
      className="bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 rounded-[20px] overflow-hidden border-2 border-primary-pink/30 hover:shadow-lg hover:border-primary-pink/50 transition-all duration-300 cursor-pointer group flex items-center justify-center h-[180px] w-full relative"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-pink/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary-blue/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Content */}
      <div className="p-6 flex flex-col items-center justify-center gap-3 relative z-10 text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-primary-pink to-secondary-blue rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Star className="w-7 h-7 text-white" fill="currentColor" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-text-dark group-hover:text-primary-pink transition-colors">
            Γίνετε Χορηγός
          </h3>
          <p className="text-xs text-text-medium">
            Επικοινωνήστε μαζί μας
          </p>
        </div>
      </div>
    </Link>
  );
}

