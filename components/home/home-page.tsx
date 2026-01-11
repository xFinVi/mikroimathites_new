/**
 * HomePage Component - Main homepage layout with featured content sections
 * 
 * Renders the homepage with hero section, featured content carousel, "For Parents"
 * section, activities/printables section, newsletter signup, and sponsors.
 * Client component for interactivity (carousel, expandable sections).
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Article, Activity, Printable } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { type Sponsor } from "@/components/sponsors/sponsor-card";
// Import only needed icons from lucide-react to reduce bundle size
import { User, ChevronDown } from "lucide-react";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { HOME_PAGE_LIMITS, YOUTUBE_VIDEO_IDS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// Lazy load non-critical components for better initial page load
// Use loading placeholder to prevent layout shift
// Wrapped with LazyWrapper to defer loading until visible
const NewsletterSection = dynamic(
  () => import("@/components/newsletter/newsletter-section").then(mod => ({ default: mod.NewsletterSection })),
  { 
    ssr: false,
    loading: () => <div className="min-h-[400px]" aria-label="Loading newsletter section" />
  }
);

// Lazy load VideoSneakPeek - heavy YouTube iframe, load only when visible
// Reserve space to prevent CLS (600px height matches component)
const VideoSneakPeek = dynamic(
  () => import("@/components/home/video-sneak-peek").then(mod => ({ default: mod.VideoSneakPeek })),
  { 
    ssr: false,
    loading: () => (
      <section 
        className="relative w-screen h-[600px] overflow-hidden mt-[8rem] mb-8 bg-black" 
        style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
        aria-label="Loading video section"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/60">Φόρτωση βίντεο...</div>
        </div>
      </section>
    )
  }
);

const SponsorsSection = dynamic(
  () => import("@/components/sponsors/sponsors-section").then(mod => ({ default: mod.SponsorsSection })),
  { 
    ssr: false,
    loading: () => <div className="min-h-[200px]" aria-label="Loading sponsors section" />
  }
);

// Lazy load Activities & Printables section (below the fold) - reduces initial JS bundle
// Type assertion needed because dynamic import types aren't inferred immediately
const ActivitiesPrintablesSection = dynamic(
  () => import("@/components/home/activities-printables-section"),
  { 
    ssr: false,
    loading: () => (
      <section className="relative bg-[#E8F4F8] py-16 md:py-20 overflow-hidden">
        <div className="bg-yellow-400 py-12 md:py-16 mb-12">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                Δραστηριότητες & Εκτυπώσιμα
              </h2>
            </div>
          </Container>
        </div>
        <Container>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-text-medium">Φόρτωση...</p>
          </div>
        </Container>
      </section>
    )
  }
) as React.ComponentType<{
  activitiesPrintablesSection?: {
    title?: string;
    subtitle?: string;
    viewAllText?: string;
    viewAllLink?: string;
    items?: Array<(Activity | Printable) & { imageUrl?: string | null; _contentType?: 'activity' | 'printable' }>;
  };
}>;

// Type guards for content items
function isActivity(item: Activity | Printable): item is Activity {
  return 'instructions' in item || 'steps' in item || 'materials' in item;
}

function isPrintable(item: Activity | Printable): item is Printable {
  return 'file' in item || 'previewImages' in item;
}

import { getContentUrl } from "@/lib/utils/content";

interface FeaturedContentItem {
  _id: string;
  _contentType: 'article' | 'activity' | 'recipe' | 'printable';
  title: string;
  slug: string;
  coverImage?: unknown;
  secondaryImage?: unknown;
  imageUrl?: string | null; // Pre-generated image URL from server
  summary?: string;
  excerpt?: string;
  author?: {
    _id: string;
    name: string;
    slug?: string;
    profilePicture?: unknown;
  };
  category?: {
    _id: string;
    title: string;
    slug: string;
  };
}

interface HomePageProps {
  homeHeroImage?: string | null;
  featuredContent?: FeaturedContentItem[];
  featuredContentSection?: {
    title?: string;
    subtitle?: string;
  };
  forParentsSection?: {
    title?: string;
    subtitle?: string;
    viewAllText?: string;
    viewAllLink?: string;
    articles?: (Article & { imageUrl?: string | null })[];
  };
  activitiesPrintablesSection?: {
    title?: string;
    subtitle?: string;
    viewAllText?: string;
    viewAllLink?: string;
    items?: Array<(Activity | Printable) & { imageUrl?: string | null; _contentType?: 'activity' | 'printable' }>;
  };
  sponsors?: Sponsor[];
}

// Featured Content Section Component
function FeaturedContentSection({ 
  featuredContent,
  title = "Προτεινόμενο",
  subtitle = "Συμβουλές για γονείς, ιδέες για παιδιά και πρακτικό περιεχόμενο"
}: { 
  featuredContent: FeaturedContentItem[];
  title?: string;
  subtitle?: string;
}) {
  const [mobileItemsToShow, setMobileItemsToShow] = useState(3);
  const MOBILE_INITIAL = 3;
  const MOBILE_LOAD_MORE = 3;
  const TABLET_AND_ABOVE = 6; // Show 6 on tablets (767px+) and above

  const handleLoadMore = () => {
    setMobileItemsToShow((prev) => Math.min(prev + MOBILE_LOAD_MORE, featuredContent.length));
  };

  const hasMoreToLoad = mobileItemsToShow < featuredContent.length;

  return (
    <section className="relative bg-[#E8F4F8] pb-16 md:pb-20 overflow-hidden w-full">
      {/* Playful Header Section */}
      <div className="bg-pink-400 py-12 md:py-16 mb-12">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </Container>
      </div>
      <Container>
        {/* Mobile: Show 3 initially, can load more */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-10 min-h-[400px]">
            {featuredContent.slice(0, mobileItemsToShow).map((item) => {
              const imageUrl = item.imageUrl || null;
              const href = getContentUrl(item._contentType, item.slug);
              
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
                        sizes="100vw"
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
            })}
          </div>
          {hasMoreToLoad && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-6 py-3 bg-white hover:bg-primary-pink hover:text-white border-2 border-primary-pink text-primary-pink font-semibold rounded-lg transition-all"
              >
                <span>Φόρτωση Περισσότερων</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Tablet and Above: Show 6 items */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[400px]">
          {featuredContent.slice(0, TABLET_AND_ABOVE).map((item) => {
            const imageUrl = item.imageUrl || null;
            const href = getContentUrl(item._contentType, item.slug);
            
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
          })}
        </div>
      </Container>
    </section>
  );
}

export function HomePage({
  homeHeroImage,
  featuredContent = [],
  featuredContentSection,
  forParentsSection,
  activitiesPrintablesSection,
  sponsors = [],
}: HomePageProps) {
  return (
    <PageWrapper mainClassName="bg-[#0d1330]">
      {/* Section 1: Video Sneak Peek - Primary landing component (swapped back) */}
      <VideoSneakPeek
        videos={YOUTUBE_VIDEO_IDS.map((video) => ({
          type: "youtube" as const,
          url: video.id,
          title: video.title,
          startTime: video.startTime,
        }))}
        title="Sneak Peek από το κανάλι μας"
        subtitle="Δείτε τι μπορείτε να δείτε στο YouTube μας - 3 σύντομα βίντεο που δείχνουν το περιεχόμενο μας"
        youtubeChannelUrl="https://www.youtube.com/@MikroiMathites"
      />

      {/* Section 2: Home Hero Image (from Sanity) - Below video */}
      {/* Reduced height from 90vh to 70vh for faster LCP and better above-the-fold performance */}
      <section 
        className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 w-full h-full">
          {homeHeroImage ? (
            <>
              <Image
                src={homeHeroImage}
                alt="Home Hero"
                fill
                className="object-cover object-center"
                priority={false}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-pink/10 via-secondary-blue/10 to-accent-yellow/10" />
          )}
        </div>
      </section>

      {/* Section 3: Featured Content Grid - Standalone Section */}
      {featuredContent.length > 0 ? (
        <FeaturedContentSection 
          featuredContent={featuredContent}
          title={featuredContentSection?.title}
          subtitle={featuredContentSection?.subtitle}
        />
      ) : (
        // Empty state for featured content - always show section
        <section className="relative bg-[#E8F4F8] pb-16 md:pb-20 overflow-hidden w-full">
          <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  {featuredContentSection?.title || "Προτεινόμενο"}
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                  {featuredContentSection?.subtitle || "Συμβουλές για γονείς, ιδέες για παιδιά και πρακτικό περιεχόμενο"}
                </p>
              </div>
            </Container>
          </div>
          <Container>
            <div className="text-center py-12">
              <p className="text-text-medium text-lg">
                Δεν υπάρχει διαθέσιμο προτεινόμενο περιεχόμενο αυτή τη στιγμή. Ελέγξτε σύντομα!
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* Section 4: Featured Articles / Parent Tips */}
      <section className="relative bg-[#E0F2FE] py-16 md:py-20 overflow-hidden">
        {/* Playful Header Section */}
        <div className="bg-cyan-400 py-12 md:py-16 mb-12">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* Empty spacer on left (hidden on mobile) */}
              <div className="hidden sm:block"></div>
              
              {/* Centered Text */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                  {forParentsSection?.title || "Συμβουλές για Γονείς"}
                </h2>
                <p className="text-lg text-white/95">
                  {forParentsSection?.subtitle || "Πρακτικές συμβουλές και ιδέες για την καθημερινότητα"}
                </p>
              </div>
              
              {/* Button pushed to the end */}
              <div className="flex justify-center sm:justify-end">
                <Link
                  href={forParentsSection?.viewAllLink || "/gia-goneis"}
                  className="text-white hover:text-white/90 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg"
                >
                  {forParentsSection?.viewAllText || "Δείτε όλα τα άρθρα"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </Container>
        </div>
        <Container className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[400px]">
            {forParentsSection?.articles && forParentsSection.articles.length > 0 ? (
              forParentsSection.articles.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES).map((article) => (
                <ArticleCard key={article._id} article={article} compact={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-text-medium text-lg">
                  Δεν υπάρχουν διαθέσιμα άρθρα αυτή τη στιγμή. Ελέγξτε σύντομα!
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Section 5: Activities & Printables - Lazy loaded (below the fold) */}
      {/* Note: Already lazy-loaded via dynamic() import, no need for LazyWrapper */}
      <ActivitiesPrintablesSection activitiesPrintablesSection={activitiesPrintablesSection} />

      {/* Section 6: Newsletter - Separate Section - Already lazy-loaded via dynamic() */}
      <section id="newsletter" className="relative py-20 md:py-24 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <NewsletterSection />
          </div>
        </Container>
      </section>

      {/* Section 7: Sponsors - Already lazy-loaded via dynamic() */}
      <SponsorsSection
        sponsors={sponsors || []}
        headerColor="purple"
        showBecomeSponsor={true}
      />

      {/* Section 8: Community CTA */}
      <section className="relative bg-[#0d1330] py-16 md:py-20 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Η γνώμη σας μετράει
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                Η γνώμη σας είναι πολύτιμη για εμάς. Μοιραστείτε τις ιδέες σας,
                στείλτε feedback ή προτάσεις για βελτίωση. Μαζί χτίζουμε μια
                καλύτερη κοινότητα για τους γονείς.
              </p>
              <Link
                href="/epikoinonia"
                className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-8 py-4 text-white hover:bg-primary-pink/90 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                Στείλτε μας μήνυμα
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
