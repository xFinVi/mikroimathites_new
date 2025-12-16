"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { FeedbackForm } from "@/components/feedback-form";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";

export const metadata = generateMetadataFor("home");

// Carousel slides data
const heroSlides = [
  {
    id: "welcome",
    title: "Πρακτικές συμβουλές για γονείς",
    subtitle: "Parent Hub για παιδιά 0-6 ετών",
    description: "Καλώς ήρθατε! Εδώ θα βρείτε χρήσιμες πληροφορίες, δραστηριότητες και εκτυπώσιμα για την ανατροφή των παιδιών σας.",
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
    description: "Ανακαλύψτε χριστουγεννιάτικες δραστηριότητες, συνταγές και ιδέες για να περάσετε όμορφα με τα παιδιά σας.",
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
    description: "Νέα άρθρα για ύπνο, διατροφή και ανάπτυξη. Ενημερωθείτε με τις τελευταίες συμβουλές από τους ειδικούς μας.",
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
    description: "Επισκεφτείτε το YouTube κανάλι μας για νέα βίντεο, δραστηριότητες και παιχνίδια που βοηθούν στην ανάπτυξη.",
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
    description: "Στείλτε μας ερωτήσεις, ιδέες για βίντεο ή feedback. Χτίζουμε μαζί μια κοινότητα που στηρίζει τους γονείς.",
    ctaText: "Στείλτε μήνυμα",
    ctaLink: "/epikoinonia",
    secondaryCtaText: "Δείτε τα Q&A",
    secondaryCtaLink: "/epikoinonia",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !backgroundRef.current) return;
      
      const scrolled = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const parallaxSpeed = 0.5;
      
      // Parallax effect: background moves slower than scroll
      if (scrolled < heroHeight) {
        const scale = 1 + scrolled * 0.0005; // Slight scale effect
        backgroundRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${scale})`;
      } else {
        // Reset when scrolled past hero
        const maxScale = 1 + heroHeight * 0.0005;
        backgroundRef.current.style.transform = `translateY(${heroHeight * parallaxSpeed}px) scale(${maxScale})`;
      }
    };

    // Use requestAnimationFrame for smoother performance
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
        {/* Parallax Background Image */}
        <div ref={backgroundRef} className="absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/ΧΡΙστουγεννα.png"
            alt="Χριστουγεννιάτικο Banner"
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
        </div>

        {/* Placeholder for future video content */}
        <div className="relative z-10 text-center">
          {/* Future: Video player will go here */}
        </div>
      </section>

      {/* Carousel Section - Moved below hero */}
      <section className="bg-gradient-to-b from-background-light to-background-white py-12 md:py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
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

      {/* Preview Sections */}
      <section className="py-16 bg-background-white">
        <Container>
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12">
            Για Γονείς
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Ύπνος & Ρουτίνες", icon: "😴" },
              { title: "Ομιλία & Λεξιλόγιο", icon: "💬" },
              { title: "Διατροφή", icon: "🍎" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-background-light rounded-card p-6 hover:shadow-subtle transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-text-medium">Πρακτικές συμβουλές</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

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
            {[
              {
                title: "Χειροτεχνίες",
                description: "Δημιουργικές ιδέες για παιδιά",
                icon: "🎨",
                color: "bg-primary-pink",
                link: "/drastiriotites",
              },
              {
                title: "Εκτυπώσιμα",
                description: "Δωρεάν εκτυπώσιμα φύλλα",
                icon: "📄",
                color: "bg-secondary-blue",
                link: "/drastiriotites",
              },
              {
                title: "Παιχνίδια",
                description: "Εκπαιδευτικά παιχνίδια",
                icon: "🧩",
                color: "bg-accent-yellow",
                link: "/drastiriotites",
              },
              {
                title: "Συνταγές",
                description: "Συνταγές για παιδιά",
                icon: "🍪",
                color: "bg-accent-green",
                link: "/drastiriotites",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group block"
              >
                <div
                  className={`${item.color} rounded-card p-6 text-white hover:scale-105 transition-all duration-300 shadow-subtle hover:shadow-lg h-full flex flex-col`}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm flex-grow">
                    {item.description}
                  </p>
                  <div className="mt-4 text-white/80 group-hover:text-white transition-colors text-sm font-medium">
                    Δείτε περισσότερα →
                  </div>
                </div>
              </Link>
            ))}
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

