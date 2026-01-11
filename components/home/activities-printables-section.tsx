/**
 * Activities & Printables Section Component
 * 
 * Displays activities and printables in a grid layout.
 * Extracted from home-page.tsx for lazy loading optimization.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { HOME_PAGE_LIMITS } from "@/lib/constants";
import { Activity, Printable } from "@/lib/content";
import { getContentUrl } from "@/lib/utils/content";

// Type guards
function isActivity(item: Activity | Printable): item is Activity {
  return 'instructions' in item || 'steps' in item || 'materials' in item;
}

interface ActivitiesPrintablesSectionProps {
  activitiesPrintablesSection?: {
    title?: string;
    subtitle?: string;
    viewAllText?: string;
    viewAllLink?: string;
    items?: Array<(Activity | Printable) & { imageUrl?: string | null; _contentType?: 'activity' | 'printable' }>;
  };
}

export default function ActivitiesPrintablesSection({ 
  activitiesPrintablesSection 
}: ActivitiesPrintablesSectionProps) {
  return (
    <section className="relative bg-[#E8F4F8] py-16 md:py-20 overflow-hidden">
      {/* Playful Header Section */}
      <div className="bg-yellow-400 py-12 md:py-16 mb-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6">
            {/* Empty spacer on left (hidden on mobile) */}
            <div className="hidden sm:block"></div>
            
            {/* Centered Text */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                {activitiesPrintablesSection?.title || "Δραστηριότητες & Εκτυπώσιμα"}
              </h2>
              <p className="text-lg text-white/95">
                {activitiesPrintablesSection?.subtitle || "Διασκεδαστικές δραστηριότητες και δωρεάν εκτυπώσιμα"}
              </p>
            </div>
            
            {/* Button pushed to the end */}
            <div className="flex justify-center sm:justify-end">
              <Link
                href={activitiesPrintablesSection?.viewAllLink || "/drastiriotites"}
                className="text-white hover:text-white/90 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg"
              >
                {activitiesPrintablesSection?.viewAllText || "Δείτε όλες"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[400px]">
          {activitiesPrintablesSection?.items && activitiesPrintablesSection.items.length > 0 ? (
            activitiesPrintablesSection.items.slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES).map((item) => {
              const imageUrl = item.imageUrl || null;
              const href = getContentUrl(item._contentType || (isActivity(item) ? 'activity' : 'printable'), item.slug);
              
              return (
                <Link
                  key={item._id}
                  href={href}
                  className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full block"
                >
                  <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0 aspect-[4/3]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-xs text-text-medium font-medium">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-white flex-1 flex flex-col gap-3">
                    {/* Category */}
                    {item.category && (
                      <div className="text-xs font-semibold text-primary-pink uppercase tracking-wide">
                        {item.category.title}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base font-bold text-text-dark line-clamp-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
                      {item.title}
                    </h3>

                    {/* Author with Profile Picture */}
                    {item.author?.name && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/20 mt-auto">
                        {item.author.profilePicture ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-border/30 flex-shrink-0">
                            <Image
                              src={generateImageUrl(item.author.profilePicture, 24, 24) || ""}
                              alt={item.author.name}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-primary-pink/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-pink">
                              {item.author.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-text-medium font-medium">
                          {item.author.name}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-medium text-lg">
                Δεν υπάρχουν διαθέσιμες δραστηριότητες ή εκτυπώσιμα αυτή τη στιγμή. Ελέγξτε σύντομα!
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
