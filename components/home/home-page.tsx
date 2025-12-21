"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Article, Activity, Printable, AgeGroup, Recipe, FeaturedBanner } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { FeaturedBanner as FeaturedBannerComponent } from "@/components/home/featured-banner";
import { urlFor } from "@/lib/sanity/image-url";
import { User } from "lucide-react";

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
  category?: {
    _id: string;
    title: string;
    slug: string;
  };
}

interface HomePageProps {
  featuredBanner?: FeaturedBanner;
  featuredContent?: FeaturedContentItem[];
  featuredArticles?: Article[];
  featuredActivities?: Activity[];
  featuredPrintables?: Printable[];
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
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !backgroundRef.current) return;

      const scrolled = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const parallaxSpeed = 0.5;

      if (scrolled < heroHeight) {
        const scale = 1 + scrolled * 0.0005;
        backgroundRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${scale})`;
      } else {
        const maxScale = 1 + heroHeight * 0.0005;
        backgroundRef.current.style.transform = `translateY(${heroHeight * parallaxSpeed}px) scale(${maxScale})`;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PageWrapper mainClassName="bg-[#0d1330]">
      {/* Section 1: Hero Image with Parallax */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center justify-center pt-20 sm:pt-24"
      >
        <div ref={backgroundRef} className="absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/ΧΡΙστουγεννα.png"
            alt="Χριστουγεννιάτικο Banner"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
        </div>
        <div className="relative z-10 text-center">
          {/* Future: Video player will go here */}
        </div>
      </section>

      {/* Section 2: Featured Banner (Flexible - YouTube, Article, Custom) */}
      {featuredBanner && (
        <FeaturedBannerComponent banner={featuredBanner} />
      )}

      {/* Section 3: Carousel */}
      <section className="relative bg-[#0d1330] py-16 md:py-20 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <Carousel slides={heroSlides} autoPlay={true} autoPlayInterval={3000} />
          </div>
        </Container>
      </section>

      {/* Section 4: Featured Content Grid - Standalone Section */}
      {featuredContent.length > 0 && (
        <section className="relative bg-[#E8F4F8] py-16 md:py-20 overflow-hidden w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12" style={{ minHeight: '400px' }}>
              {featuredContent.map((item) => {
                // Use pre-generated image URL from server, fallback to generating on client if needed
                const imageUrl = item.imageUrl || (item.coverImage
                  ? urlFor(item.coverImage).width(600).height(400).url()
                  : null);
                // All items are articles now
                const href = `/gia-goneis/${item.slug}`;
                
                return (
                  <Link
                    key={item._id}
                    href={href}
                    className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    style={{ display: 'block' }}
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
                      {(item as any).author?.name && (
                        <div className="flex items-center gap-1.5 mt-auto">
                          <User className="w-3 h-3 text-text-medium flex-shrink-0" />
                          <p className="text-xs text-text-medium">
                            {(item as any).author.name}
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

      {/* Section 5: Age Cards with Featured Content Preview */}
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
              ageGroups
                .filter((ageGroup) => {
                  const slug = ageGroup.slug.toLowerCase();
                  return !slug.includes("abroad") && !slug.includes("greek") && !slug.includes("εξωτερικό");
                })
                .map((ageGroup) => {
                  const getColor = (slug: string) => {
                    if (slug.includes("0") || slug === "0-2" || slug === "0_2") return "bg-primary-pink";
                    if (slug.includes("2") && !slug.includes("4") || slug === "2-4" || slug === "2_4") return "bg-secondary-blue";
                    if (slug.includes("4") || slug === "4-6" || slug === "4_6") return "bg-accent-yellow";
                    return "bg-primary-pink";
                  };

                  return (
                    <Link
                      key={ageGroup._id}
                      href={`/age/${ageGroup.slug}`}
                      className={`${getColor(ageGroup.slug)} rounded-card p-8 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl block`}
                    >
                      <h3 className="text-3xl font-bold mb-3">{ageGroup.title}</h3>
                      <p className="text-white/90 text-lg mb-4">Δείτε περιεχόμενο</p>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <span>Εξερευνήστε →</span>
                      </div>
                    </Link>
                  );
                })
            ) : (
              [
                { age: "0-2", label: "0-2 έτη", color: "bg-primary-pink", slug: "0-2" },
                { age: "2-4", label: "2-4 έτη", color: "bg-secondary-blue", slug: "2-4" },
                { age: "4-6", label: "4-6 έτη", color: "bg-accent-yellow", slug: "4-6" },
              ].map((item) => (
                <Link
                  key={item.age}
                  href={`/age/${item.slug}`}
                  className={`${item.color} rounded-card p-8 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl block`}
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

      {/* Section 6: Featured Articles / Parent Tips */}
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
              {featuredArticles.slice(0, 6).map((article) => (
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

      {/* Section 7: Activities & Printables */}
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
              {featuredActivities.slice(0, 4).map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
              {featuredPrintables.slice(0, 4).map((printable) => {
                const imageUrl = printable.coverImage
                  ? urlFor(printable.coverImage).width(400).height(250).url()
                  : null;
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
      <section className="relative bg-[#EDE9FE] py-16 md:py-20 overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto">
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
