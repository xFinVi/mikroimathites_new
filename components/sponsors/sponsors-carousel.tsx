"use client";

import { useRef } from "react";
import { Sponsor, SponsorCard } from "./sponsor-card";

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
}

export function SponsorsCarousel({
  sponsors,
}: SponsorsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container - Full Width */}
      <div className="relative overflow-hidden w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8 justify-center"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {sponsors.map((sponsor) => (
            <div
              key={sponsor._id}
              className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <SponsorCard sponsor={sponsor} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

