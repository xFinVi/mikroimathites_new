"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Article, Activity, Printable, AgeGroup, Recipe, FeaturedBanner } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { FeaturedBanner as FeaturedBannerComponent } from "@/components/home/featured-banner";
import { VideoSneakPeek } from "@/components/home/video-sneak-peek";
import { BackgroundVideoSection } from "@/components/home/background-video-section";
import { VideoHeroSection } from "@/components/home/video-hero-section";
import { User } from "lucide-react";
import { HOME_PAGE_LIMITS } from "@/lib/constants/home-page";
import { getAgeGroupColor, filterAgeGroups } from "@/lib/utils/age-groups";

// Deterministic randomness functions for consistent server/client rendering
function hashStringToSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const heroSlides = [
  {
    id: "welcome",
    title: "Πρακτικές συμβουλές για γονείς",
    subtitle: "Parent Hub για παιδιά 0-6 ετών",
    description:
      "Καλώς ήρθατε! Εδώ θα βρείτε χρήσιμες πληροφορίες, δραστηριότητες και εκτυπώσιμα για την ανατροφή των παιδιών σας.",
    ctaText: "Ξεκινήστε ανά ηλικία",
    ctaLink: "#age-cards",
    secondaryCtaText: "Δείτε δραστηριότητες",
    secondaryCtaLink: "/drastiriotites",
  },
  {
    id: "christmas",
    badge: "Χριστουγεννιάτικη περίοδος",
    title: "Χριστουγεννιάτικες δραστηριότητες",
    subtitle: "Ειδικό περιεχόμενο για τις γιορτές",
    description:
      "Ανακαλύψτε χριστουγεννιάτικες δραστηριότητες, συνταγές και ιδέες για να περάσετε όμορφα με τα παιδιά σας.",
    ctaText: "Δείτε τις δραστηριότητες",
    ctaLink: "/drastiriotites",
    secondaryCtaText: "Χριστουγεννιάτικες συνταγές",
    secondaryCtaLink: "/gia-goneis",
  },
  {
    id: "new-content",
    badge: "Νέο",
    title: "Νέο περιεχόμενο προστέθηκε",
    subtitle: "Ελέγξτε τα τελευταία μας άρθρα",
    description:
      "Νέα άρθρα για ύπνο, διατροφή και ανάπτυξη. Ενημερωθείτε με τις τελευταίες συμβουλές από τους ειδικούς μας.",
    ctaText: "Δείτε τα άρθρα",
    ctaLink: "/gia-goneis",
    secondaryCtaText: "Εγγραφείτε στο Newsletter",
    secondaryCtaLink: "#newsletter",
  },
  {
    id: "youtube",
    badge: "YouTube",
    title: "Νέα βίντεο στο κανάλι μας",
    subtitle: "Watch Together με τα παιδιά σας",
    description:
      "Επισκεφτείτε το YouTube κανάλι μας για νέα βίντεο, δραστηριότητες και παιχνίδια που βοηθούν στην ανάπτυξη.",
    ctaText: "Δείτε το κανάλι",
    ctaLink: "https://youtube.com",
    secondaryCtaText: "Στείλτε ιδέα για βίντεο",
    secondaryCtaLink: "/epikoinonia",
  },
  {
    id: "community",
    badge: "Κοινότητα",
    title: "Η γνώμη σας μετράει",
    subtitle: "Μοιραστείτε τις ιδέες σας",
    description:
      "Στείλτε μας ερωτήσεις, ιδέες για βίντεο ή feedback. Χτίζουμε μαζί μια κοινότητα που στηρίζει τους γονείς.",
    ctaText: "Στείλτε μήνυμα",
    ctaLink: "/epikoinonia",
    secondaryCtaText: "Δείτε τα Q&A",
    secondaryCtaLink: "/epikoinonia",
  },
];

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
  featuredBanner?: FeaturedBanner;
  featuredContent?: FeaturedContentItem[];
  featuredArticles?: (Article & { imageUrl?: string | null })[];
  featuredActivities?: (Activity & { imageUrl?: string | null })[];
  featuredPrintables?: (Printable & { imageUrl?: string | null })[];
  ageGroups?: AgeGroup[];
}

export function HomePage({
  featuredBanner,
  featuredContent = [],
  featuredArticles = [],
  featuredActivities = [],
  featuredPrintables = [],
  ageGroups = [],
}: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Generate deterministic star positions for carousel section
  const carouselStars = useMemo(() => {
    const seed = hashStringToSeed("carousel-stars");
    const rnd = seededRand(seed);
    return Array.from({ length: 20 }).map((_, i) => ({
      key: `carousel-star-${i}`,
      left: `${(rnd() * 100).toFixed(6)}%`,
      top: `${(rnd() * 100).toFixed(6)}%`,
      animationDelay: `${(rnd() * 3).toFixed(6)}s`,
      animationDuration: `${(2 + rnd() * 2).toFixed(6)}s`,
    }));
  }, []);

  return (
    <PageWrapper mainClassName="bg-[#0d1330]">
      {/* Section 1: Video Sneak Peek (Landing Section) */}
      {/* 
        TODO: Configure your videos here!
        
        Option 1: YouTube Videos (Recommended)
        - Get video IDs from your YouTube URLs (e.g., from "https://youtube.com/watch?v=VIDEO_ID", use "VIDEO_ID")
        - Replace the placeholder IDs below with your actual video IDs
        
        Option 2: Local Videos
        - Add 3 short videos (10-15 seconds) to public/videos/
        - Uncomment the local video examples below
        - Optimize videos: MP4 format, max 5MB each, 1080p or 720p
      */}
      <VideoSneakPeek
        videos={[
          {
            type: "youtube",
            url: "Irrr-yMZADw",
            title: "Τα Ζωάκια της Φάρμας, Μαθαίνω με την Βικτωρία",
            startTime: 121, // Starts at 2:01
          },
          {
            type: "youtube",
            url: "Wial0HtS1dE",
            title: "Καλά Χριστούγεννα με την Κυρία Βικτωρία, την Ίριδα και Μπρούνο στο Λονδίνο",
            startTime: 313, // Starts at 5:13
          },
          {
            type: "youtube",
            url: "g3RUY8tkkbY",
            title: "Μαθαίνω με την Κυρία Βικτωρία επεισόδιο με την Bluey",
            startTime: 425, // Starts at 7:05
          },
        ]}
        title="Sneak Peek από το κανάλι μας"
        subtitle="Δείτε τι μπορείτε να δείτε στο YouTube μας - 3 σύντομα βίντεο που δείχνουν το περιεχόμενο μας"
        youtubeChannelUrl="https://www.youtube.com/@MikroiMathites"
      />

      {/* Section 2: Interactive Hero Section with Background Image */}
      <section 
        ref={heroRef}
        className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ΧΡΙστουγεννα.png"
            alt="Χριστουγεννιάτικο Banner"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </div>

        {/* Animated Background Elements (subtle, on top of image) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-pink/5 rounded-full blur-3xl animate-pulse" />
          <div 
            className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-secondary-blue/5 rounded-full blur-3xl animate-pulse" 
            style={{ animationDelay: '1s' }} 
          />
        </div>

        <Container className="relative z-10 mb-auto mt-8">
          <div className="flex flex-col items-center justify-start max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-pink/30 via-secondary-blue/30 to-accent-yellow/30 backdrop-blur-md text-white rounded-full text-sm font-bold shadow-2xl border border-white/30">
              <span className="text-2xl">✨</span>
              <span>Καλώς ήρθατε</span>
              <span className="text-2xl">✨</span>
            </div>
            
            {/* <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white  drop-shadow-2xl">
              Γονείς & Παιδιά
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/95  leading-relaxed drop-shadow-lg">
              Πρακτικές συμβουλές, δραστηριότητες και εκτυπώσιμα για την ανατροφή των παιδιών σας
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/drastiriotites"
                className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-blue hover:from-primary-pink/90 hover:to-secondary-blue/90 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg backdrop-blur-sm"
              >
                Δραστηριότητες
              </Link>
              <Link
                href="/gia-goneis"
                className="px-8 py-4 bg-white/30 backdrop-blur-md hover:bg-white/40 text-white rounded-lg font-semibold transition-all border border-white/40 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
              >
                Άρθρα για Γονείς
              </Link>
              <Link
                href="#age-cards"
                className="px-8 py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg font-semibold transition-all border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
              >
                Επιλέξτε Ηλικία
              </Link>
            </div> */}
          </div>
        </Container>
      </section>

      {/* Section 3: Featured Banner (Flexible - YouTube, Article, Custom) */}
      {featuredBanner && (
        <FeaturedBannerComponent banner={featuredBanner} />
      )}

      {/* Section 4: Carousel (Moved one place below with creative redesign) */}
      <section className="relative bg-gradient-to-br from-[#0d1330] via-[#1a1f3a] to-[#0d1330] py-20 md:py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-yellow/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>

        {/* Floating Stars Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {carouselStars.map((star) => (
            <div
              key={star.key}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 backdrop-blur-md text-white rounded-full text-sm font-bold shadow-2xl border border-white/20 mb-6 animate-pulse">
              <span className="text-2xl">✨</span>
              <span>Νέο περιεχόμενο</span>
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-pink/90 to-white bg-clip-text text-transparent">
              Ενημερωθείτε
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Νέο περιεχόμενο, συμβουλές και ενημερώσεις για γονείς - Όλα σε ένα μέρος
            </p>
          </div>

          {/* Carousel with Enhanced Styling */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10 shadow-2xl">
              <Carousel slides={heroSlides} autoPlay={true} autoPlayInterval={4000} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Featured Content Grid - Standalone Section */}
      {featuredContent.length > 0 && (
        <section className="relative bg-[#E8F4F8] pb-16 md:pb-20 overflow-hidden w-full">
          {/* Dark Blue Header Section */}
          <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  Προτεινόμενο
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                  Συμβουλές για γονείς, ιδέες για παιδιά και πρακτικό περιεχόμενο
                </p>
              </div>
            </Container>
          </div>
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[400px]">
              {featuredContent.map((item) => {
                // Use pre-generated image URL from server (no client-side generation)
                const imageUrl = item.imageUrl || null;
                // All items are articles now
                const href = `/gia-goneis/${item.slug}`;
                
                return (
                  <Link
                    key={item._id}
                    href={href}
                    className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full block"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    
                    {/* White Text Section Below Image */}
                    <div className="p-5 bg-white flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
                        {item.title}
                      </h3>
                      
                      {/* Author */}
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
      )}

      {/* Section 6: Age Cards with Featured Content Preview */}
      <section id="age-cards" className="relative bg-[#FFF4E6] py-16 md:py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark mb-4">
              Επιλέξτε ανά ηλικία
            </h2>
            <p className="text-lg text-text-medium max-w-2xl mx-auto">
              Βρείτε περιεχόμενο προσαρμοσμένο στην ηλικία του παιδιού σας
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {ageGroups.length > 0 ? (
              filterAgeGroups(ageGroups).map((ageGroup) => (
                <Link
                  key={ageGroup._id}
                  href={`/age/${ageGroup.slug}`}
                  className={`${getAgeGroupColor(ageGroup.slug)} rounded-card p-8 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl block`}
                >
                  <h3 className="text-3xl font-bold mb-3">{ageGroup.title}</h3>
                  <p className="text-white/90 text-lg mb-4">Δείτε περιεχόμενο</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>Εξερευνήστε →</span>
                  </div>
                </Link>
              ))
            ) : (
              [
                { age: "0-2", label: "0-2 έτη", slug: "0-2" },
                { age: "2-4", label: "2-4 έτη", slug: "2-4" },
                { age: "4-6", label: "4-6 έτη", slug: "4-6" },
              ].map((item) => (
                <Link
                  key={item.age}
                  href={`/age/${item.slug}`}
                  className={`${getAgeGroupColor(item.slug)} rounded-card p-8 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl block`}
                >
                  <h3 className="text-3xl font-bold mb-3">{item.label}</h3>
                  <p className="text-white/90 text-lg mb-4">Δείτε περιεχόμενο</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>Εξερευνήστε →</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* Section 7: Featured Articles / Parent Tips */}
      <section className="relative bg-[#E0F2FE] py-16 md:py-20 overflow-hidden">
        {/* Dark Header Section */}
        <div className="bg-[#1a1f3a] py-12 md:py-16 mb-12">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                  Συμβουλές για Γονείς
                </h2>
                <p className="text-lg text-white/90">
                  Πρακτικές συμβουλές και ιδέες για την καθημερινότητα
                </p>
              </div>
              <Link
                href="/gia-goneis"
                className="text-secondary-blue hover:text-secondary-blue/80 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
              >
                Δείτε όλα τα άρθρα
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Container>
        </div>
        <Container className="relative z-10">
          {featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {featuredArticles.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES).map((article) => (
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
                Δραστηριότητες & Εκτυπώσιμα
              </h2>
              <p className="text-lg text-text-medium">
                Διασκεδαστικές δραστηριότητες και δωρεάν εκτυπώσιμα
              </p>
            </div>
            <Link
              href="/drastiriotites"
              className="text-primary-pink hover:text-primary-pink/80 font-semibold text-lg transition-colors flex items-center gap-2 whitespace-nowrap bg-primary-pink/10 hover:bg-primary-pink/20 px-4 py-2 rounded-lg"
            >
              Δείτε όλες
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {(featuredActivities.length > 0 || featuredPrintables.length > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredActivities.slice(0, HOME_PAGE_LIMITS.FEATURED_ACTIVITIES).map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
              {featuredPrintables.slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES).map((printable) => {
                // Use pre-generated image URL from server (no client-side generation)
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
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-medium text-lg">
                Δεν υπάρχουν διαθέσιμες δραστηριότητες αυτή τη στιγμή. Ελέγξτε σύντομα!
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
