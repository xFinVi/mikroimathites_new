"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SponsorsCarousel } from "./sponsors-carousel";
import { SponsorsSkeleton } from "./sponsors-skeleton";
import { Sponsor } from "./sponsor-card";

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
  title?: string;
  subtitle?: string;
  showBecomeSponsor?: boolean;
  isLoading?: boolean;
  headerColor?: 'pink' | 'green' | 'purple' | 'orange' | 'cyan';
}

export function SponsorsSection({
  sponsors = [],
  title = "Οι Χορηγοί μας",
  subtitle = "Υποστηρίζοντας την κοινότητά μας",
  showBecomeSponsor = true,
  isLoading = false,
  headerColor = 'green',
}: SponsorsSectionProps) {
  // Map header color to Tailwind classes
  const headerColorMap = {
    pink: 'bg-pink-400',
    green: 'bg-green-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
    cyan: 'bg-cyan-400',
  };

  const headerBg = headerColorMap[headerColor] || 'bg-green-400';

  // Filter active sponsors
  const activeSponsors = sponsors.filter((sponsor) => sponsor.isActive !== false);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Playful Header Section */}
      <div className={`${headerBg} py-12 md:py-16 mb-12`}>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6">
            {/* Empty spacer on left (hidden on mobile) */}
            <div className="hidden sm:block"></div>
            
            {/* Centered Text */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                {title}
              </h2>
              <p className="text-lg text-white/95">
                {subtitle}
              </p>
            </div>
            
            {/* Button pushed to the end */}
            {showBecomeSponsor && (
              <div className="flex justify-center sm:justify-end">
                <Link
                  href="/gine-xorigos"
                  className="text-white hover:text-white/90 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg"
                >
                  Γίνετε Χορηγός
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Container>
          <SponsorsSkeleton />
        </Container>
      )}

      {/* Empty State */}
      {!isLoading && activeSponsors.length === 0 && !showBecomeSponsor && (
        <Container>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-text-medium text-lg mb-4">
              Δεν υπάρχουν χορηγοί αυτή τη στιγμή
            </p>
            <Link
              href="/gine-xorigos"
              className="inline-flex items-center gap-2 text-primary-pink hover:text-primary-pink/80 font-semibold"
            >
              Γίνετε ο πρώτος χορηγός μας
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      )}

      {/* Content - Carousel - Full Width */}
      {!isLoading && activeSponsors.length > 0 && (
        <div className="w-full overflow-hidden">
          <SponsorsCarousel sponsors={activeSponsors} />
        </div>
      )}
    </section>
  );
}

