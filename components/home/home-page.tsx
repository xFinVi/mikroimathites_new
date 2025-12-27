"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Article, Activity, Printable } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { VideoSneakPeek } from "@/components/home/video-sneak-peek";
import { User, ChevronDown } from "lucide-react";
import { HOME_PAGE_LIMITS, YOUTUBE_VIDEO_IDS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// Type guards for content items
function isActivity(item: Activity | Printable): item is Activity {
  return 'instructions' in item || 'steps' in item || 'materials' in item;
}

function isPrintable(item: Activity | Printable): item is Printable {
  return 'file' in item || 'previewImages' in item;
}

import { getContentUrl } from "@/lib/utils/content-url";

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
      {/* Dark Blue Header Section */}
      <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
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
                  <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="100vw"
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
                  <div className="p-5 bg-white flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
                      {item.title}
                    </h3>
                    {item.author?.name && (
                      <div className="flex items-center gap-1.5 mt-auto">
                        <User className="w-3 h-3 text-text-medium flex-shrink-0" />
                        <p className="text-xs text-text-medium">
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
                <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1200px) 50vw, 33vw"
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
                <div className="p-5 bg-white flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
                    {item.title}
                  </h3>
                  {item.author?.name && (
                    <div className="flex items-center gap-1.5 mt-auto">
                      <User className="w-3 h-3 text-text-medium flex-shrink-0" />
                      <p className="text-xs text-text-medium">
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
}: HomePageProps) {
  return (
    <PageWrapper mainClassName="bg-[#0d1330]">
      {/* Section 1: Video Sneak Peek (Landing Section) */}
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

      {/* Section 2: Home Hero Image (from Sanity) */}
      {homeHeroImage && (
        <section 
          className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={homeHeroImage}
              alt="Home Hero"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
          </div>
        </section>
      )}

      {/* Section 3: Featured Content Grid - Standalone Section */}
      {featuredContent.length > 0 ? (
        <FeaturedContentSection 
          featuredContent={featuredContent}
          title={featuredContentSection?.title}
          subtitle={featuredContentSection?.subtitle}
        />
      ) : (
        // Empty state for featured content - section still shows but with message
        featuredContentSection && (
          <section className="relative bg-[#E8F4F8] pb-16 md:pb-20 overflow-hidden w-full">
            <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
              <Container>
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                    {featuredContentSection.title || "Προτεινόμενο"}
                  </h2>
                  <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                    {featuredContentSection.subtitle || "Συμβουλές για γονείς, ιδέες για παιδιά και πρακτικό περιεχόμενο"}
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
        )
      )}

      {/* Section 4: Featured Articles / Parent Tips */}
      <section className="relative bg-[#E0F2FE] py-16 md:py-20 overflow-hidden">
        {/* Dark Header Section */}
        <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                  {forParentsSection?.title || "Συμβουλές για Γονείς"}
                </h2>
                <p className="text-lg text-white/90">
                  {forParentsSection?.subtitle || "Πρακτικές συμβουλές και ιδέες για την καθημερινότητα"}
                </p>
              </div>
              <Link
                href={forParentsSection?.viewAllLink || "/gia-goneis"}
                className="text-secondary-blue hover:text-secondary-blue/80 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
              >
                {forParentsSection?.viewAllText || "Δείτε όλα τα άρθρα"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Container>
        </div>
        <Container className="relative z-10">
          {forParentsSection?.articles && forParentsSection.articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {forParentsSection.articles.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES).map((article) => (
                <ArticleCard key={article._id} article={article} compact={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-medium text-lg">
                Δεν υπάρχουν διαθέσιμα άρθρα αυτή τη στιγμή. Ελέγξτε σύντομα!
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Section 8: Activities & Printables */}
      <section className="relative bg-[#FCE7F3] py-16 md:py-20 overflow-hidden">
        <Container className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark mb-3">
                {activitiesPrintablesSection?.title || "Δραστηριότητες & Εκτυπώσιμα"}
              </h2>
              <p className="text-lg text-text-medium">
                {activitiesPrintablesSection?.subtitle || "Διασκεδαστικές δραστηριότητες και δωρεάν εκτυπώσιμα"}
              </p>
            </div>
            <Link
              href={activitiesPrintablesSection?.viewAllLink || "/drastiriotites"}
              className="text-primary-pink hover:text-primary-pink/80 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-primary-pink/10 hover:bg-primary-pink/20 px-4 py-2 rounded-lg"
            >
              {activitiesPrintablesSection?.viewAllText || "Δείτε όλες"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {activitiesPrintablesSection?.items && activitiesPrintablesSection.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activitiesPrintablesSection.items.slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES).map((item) => {
                  // Use type guard to determine content type
                  if (item._contentType === 'activity' || (!item._contentType && isActivity(item))) {
                    return <ActivityCard key={item._id} activity={item} />;
                  } else if (item._contentType === 'printable' || isPrintable(item)) {
                    const printable = item;
                    const imageUrl = printable.imageUrl || null;
                    return (
                      <Link
                        key={printable._id}
                        href={`/drastiriotites/printables/${printable.slug}`}
                        className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-lg transition-shadow"
                      >
                        {imageUrl && (
                          <div className="relative w-full h-48 bg-background-light">
                            <Image
                              src={imageUrl}
                              alt={printable.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-5 space-y-3">
                          <div className="text-xs font-semibold text-primary-pink">Εκτυπώσιμο</div>
                          <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
                            {printable.title}
                          </h3>
                          {printable.summary && (
                            <p className="text-text-medium text-sm line-clamp-2">
                              {printable.summary}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  }
                  return null;
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-medium text-lg">
                Δεν υπάρχουν διαθέσιμες δραστηριότητες ή εκτυπώσιμα αυτή τη στιγμή. Ελέγξτε σύντομα!
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Section 8: Newsletter */}
      <section id="newsletter" className="relative bg-[#EDE9FE] py-16 md:py-20 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <NewsletterSection />
          </div>
        </Container>
      </section>

      {/* Section 9: Community CTA */}
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
