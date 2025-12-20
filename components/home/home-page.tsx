"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { FeedbackForm } from "@/components/feedback-form";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Article, Activity, Printable } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { urlFor } from "@/lib/sanity/image-url";

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

interface HomePageProps {
  featuredArticles?: Article[];
  featuredActivities?: Activity[];
  featuredPrintables?: Printable[];
}

export function HomePage({ featuredArticles = [], featuredActivities = [], featuredPrintables = [] }: HomePageProps) {
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
    <PageWrapper mainClassName="bg-background-light">
      {/* Hero Section - Simple Background Only */}
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

      {/* Carousel Section - Moved below hero */}
      <section className="bg-gradient-to-b from-background-light to-background-white py-12 md:py-16 overflow-hidden">
        <Container>
          <div className="max-w-5xl mx-auto w-full">
            <Carousel slides={heroSlides} autoPlay={true} autoPlayInterval={6000} />
          </div>
        </Container>
      </section>

      {/* Age Cards Section */}
      <section id="age-cards" className="bg-background-light py-16">
        <Container>
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12">
            Επιλέξτε ανά ηλικία
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { age: "0-2", label: "0-2 έτη", color: "bg-primary-pink" },
              { age: "2-4", label: "2-4 έτη", color: "bg-secondary-blue" },
              { age: "4-6", label: "4-6 έτη", color: "bg-accent-yellow" },
              { age: "abroad", label: "Ελληνικά στο εξωτερικό", color: "bg-accent-green" },
            ].map((item) => (
              <div
                key={item.age}
                className={`${item.color} rounded-card p-6 text-white hover:scale-105 transition-transform cursor-pointer shadow-subtle`}
              >
                <h3 className="text-2xl font-bold mb-2">{item.label}</h3>
                <p className="text-white/90">Δείτε περιεχόμενο</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Preview Sections - For Parents */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-background-white">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-text-dark">Για Γονείς</h2>
              <Link
                href="/gia-goneis"
                className="text-secondary-blue hover:text-secondary-blue/80 font-semibold text-lg transition-colors"
              >
                Δείτε όλα →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Activities & Creations Section */}
      <section className="py-16 bg-gradient-to-b from-background-white to-background-light">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4 sm:mb-0">
              Δραστηριότητες και δημιουργίες
            </h2>
            <Link
              href="/drastiriotites"
              className="text-secondary-blue hover:text-secondary-blue/80 font-semibold text-lg transition-colors flex items-center gap-2"
            >
              Δείτε όλες
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
            {featuredPrintables.map((printable) => {
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
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-b from-background-light to-background-white">
        <Container>
          <div className="max-w-2xl mx-auto">
            <NewsletterSection />
          </div>
        </Container>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 bg-background-light">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">
                Η γνώμη σας μετράει
              </h2>
              <p className="text-lg text-text-medium max-w-2xl mx-auto">
                Η γνώμη σας είναι πολύτιμη για εμάς. Μοιραστείτε τις ιδέες σας,
                στείλτε feedback ή προτάσεις για βελτίωση. Μαζί χτίζουμε μια
                καλύτερη κοινότητα για τους γονείς.
              </p>
            </div>
            <div className="bg-background-white rounded-card p-6 sm:p-8 md:p-12 shadow-subtle">
              <FeedbackForm />
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}

