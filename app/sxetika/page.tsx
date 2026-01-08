import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getAuthors, type Author } from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { SXETIKA_CONSTANTS, CONTACT_CONSTANTS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("sxetika");

// ISR revalidation - page doesn't use dynamic APIs, so ISR is safe
export const revalidate = 600; // 10 minutes, same as other content pages

// Explicit type for authors with image URLs
type AuthorWithImageUrl = Author & { imageUrl: string | null };

export default async function SxetikaPage() {
  // Error handling for authors (non-critical data)
  let authors: Author[] = [];
  try {
    authors = await getAuthors();
  } catch (error) {
    // Log error for debugging (logger is safe in server components)
    logger.error("Failed to fetch authors for Sxetika page:", error);
    // Page continues to render - team section just won't show (graceful degradation)
  }
  
  // Pre-generate image URLs on server to avoid hydration mismatches
  const authorsWithImageUrls: AuthorWithImageUrl[] = authors.map(author => ({
    ...author,
    imageUrl: author.profilePicture 
      ? generateImageUrl(
          author.profilePicture,
          SXETIKA_CONSTANTS.IMAGE_SIZES.AUTHOR_PROFILE.width,
          SXETIKA_CONSTANTS.IMAGE_SIZES.AUTHOR_PROFILE.height
        )
      : null,
  }));

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src={CONTACT_CONSTANTS.BACKGROUND_IMAGE_PATH}
            alt="Σχετικά background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Σχετικά"
              description="Γεια σας! Είμαστε οι Μικροί Μαθητές - μια κοινότητα που στηρίζει τους γονείς με πρακτικό, φιλικό περιεχόμενο"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-16">
        {/* Mission Section - Redesigned with Playful Design */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-dark">
              Η αποστολή μας
            </h2>
            <p className="text-lg sm:text-xl text-text-medium max-w-3xl mx-auto leading-relaxed">
              Να στηρίζουμε τους γονείς με απλές, πρακτικές ιδέες που κάνουν την καθημερινότητα πιο εύκολη.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1: Mission */}
            <div className="group relative bg-gradient-to-br from-primary-pink/10 via-primary-pink/5 to-white rounded-3xl py-6 px-4 sm:py-8 sm:px-5 shadow-lg hover:shadow-2xl border-2 border-primary-pink/20 hover:border-primary-pink/40 transition-all duration-300 transform hover:-translate-y-2">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary-pink/10 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary-pink/5 rounded-full blur-xl opacity-30" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-pink to-primary-pink/70 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    🎯
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-dark">Η αποστολή μας</h3>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-text-dark leading-relaxed font-medium">
                    Να στηρίζουμε τους γονείς με απλές, πρακτικές ιδέες που κάνουν την καθημερινότητα πιο εύκολη.
                  </p>
                  <p className="text-xs sm:text-sm text-text-medium leading-relaxed">
                    Ξέρουμε από πρώτο χέρι πόσο πιεστική μπορεί να είναι μια μέρα για έναν γονέα και πόσο δύσκολο είναι να κρατήσεις ισορροπία με την τεχνολογία. Γι' αυτό δημιουργούμε κάτι διασκεδαστικό αλλά και εκπαιδευτικό για τα παιδιά μας.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-text-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-pink mt-1">✓</span>
                      <span>Πρακτικές τεχνικές που χρησιμοποιούνται σε σχολεία και νηπιαγωγεία</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-pink mt-1">✓</span>
                      <span>Χωρίς κρίση μόνο κατανόηση</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-pink mt-1">✓</span>
                      <span>Χτίζουμε μια κοινότητα που στηρίζει</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2: Why We Started */}
            <div className="group relative bg-gradient-to-br from-secondary-blue/10 via-secondary-blue/5 to-white rounded-3xl py-6 px-4 sm:py-8 sm:px-5 shadow-lg hover:shadow-2xl border-2 border-secondary-blue/20 hover:border-secondary-blue/40 transition-all duration-300 transform hover:-translate-y-2">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-secondary-blue/10 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary-blue/5 rounded-full blur-xl opacity-30" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-blue to-secondary-blue/70 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    💡
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-dark">Γιατί ξεκινήσαμε</h3>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-text-dark leading-relaxed font-medium">
                    Με τον ερχομό της κόρης μας, ως Έλληνες στο εξωτερικό ξέραμε ότι τα Αγγλικά θα της βγουν φυσικά. Αυτό που θέλαμε όμως ήταν να κρατήσει και τα Ελληνικά όχι μόνο σαν λέξεις, αλλά και με σωστή προφορά,όσο πιο κοντά γίνεται στη φυσική προφορά ενός Έλληνα.
                  </p>
                  <p className="text-xs sm:text-sm text-text-medium leading-relaxed">
                    Ψάξαμε για κάτι αντίστοιχο και δεν το βρήκαμε: ελληνικό περιεχόμενο με έναν επαγγελματία μπροστά στην κάμερα, χωρίς υπερβολικά cartoons και animations. Έτσι αποφασίσαμε να κάνουμε το πρώτο βήμα για τη δική μας οικογένεια.
                  </p>
                  <p className="text-xs sm:text-sm text-text-medium leading-relaxed">
                    Στην πορεία είδαμε τη στήριξη κι από άλλους γονείς και αυτό μας έδωσε δύναμη να συνεχίσουμε. Ακούσαμε τις ανάγκες και τις δυσκολίες σας και προσαρμόζουμε τα βίντεο ώστε να βοηθούν παιδιά και γονείς σαν εμάς στο εξωτερικό, αλλά και οικογένειες στην Ελλάδα.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-text-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-blue mt-1">✓</span>
                      <span>Ελληνικά για παιδιά 0–6, με έμφαση σε γλώσσα & προφορά</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-blue mt-1">✓</span>
                      <span>Επαγγελματική παρουσία, καθαρό και απλό περιεχόμενο</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-blue mt-1">✓</span>
                      <span>Περιεχόμενο που εξελίσσεται με βάση τις ανάγκες της κοινότητας</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 3: What You'll Find */}
            <div className="group relative bg-gradient-to-br from-accent-yellow/10 via-accent-yellow/5 to-white rounded-3xl py-6 px-4 sm:py-8 sm:px-5 shadow-lg hover:shadow-2xl border-2 border-accent-yellow/20 hover:border-accent-yellow/40 transition-all duration-300 transform hover:-translate-y-2">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-accent-yellow/10 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-accent-yellow/5 rounded-full blur-xl opacity-30" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-yellow/70 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    📚
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-dark">Τι θα βρείτε εδώ</h3>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-text-dark leading-relaxed font-medium">
                    Μια προσπάθεια να δημιουργήσουμε μια κοινότητα που συνδέει γονείς με επαγγελματίες και ακαδημαϊκή έρευνα, με στόχο την ουσιαστική στήριξη του κάθε γονέα.
                  </p>
                  <p className="text-xs sm:text-sm text-text-medium leading-relaxed">
                    Όλα είναι φτιαγμένα ώστε να είναι εύκολα στην ανάγνωση και άμεσα εφαρμόσιμα: απλοποιημένες ακαδημαϊκές έρευνες, υγιεινές συνταγές, πρακτικές συμβουλές και ιδέες για δραστηριότητες που φέρνουν γονείς και παιδιά ένα βήμα πιο κοντά.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-text-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-yellow mt-1">✓</span>
                      <span>Απλοποιημένες ακαδημαϊκές έρευνες & πρακτική γνώση</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-yellow mt-1">✓</span>
                      <span>Υγιεινές συνταγές και ιδέες για την καθημερινότητα</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-yellow mt-1">✓</span>
                      <span>Δραστηριότητες που ενισχύουν τη σύνδεση γονέα παιδιού</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {authorsWithImageUrls && authorsWithImageUrls.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark text-center">Η ομάδα</h2>
            <div className="flex  justify-center gap-6">
              {authorsWithImageUrls.map((author) => {
                // Use pre-generated image URL from server (no client-side generation)
                const imageUrl = author.imageUrl || null;
                return (
                  <div
                    key={author._id}
                    className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-4 text-center w-full sm:max-w-sm"
                  >
                    {imageUrl ? (
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary-pink/20 shadow-lg">
                        <Image
                          src={imageUrl}
                          alt={author.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-background-light flex items-center justify-center text-4xl ring-4 ring-primary-pink/20 shadow-lg">
                        👤
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark mb-1">{author.name}</h3>
                      {author.role && (
                        <p className="text-sm text-primary-pink font-medium mb-2">
                          {author.role === "editor" && "Συντάκτης"}
                          {author.role === "expert" && "Ειδικός"}
                          {author.role === "contributor" && "Συνεργάτης"}
                        </p>
                      )}
                      {author.bio && (
                        <p className="text-text-medium text-sm">{author.bio}</p>
                      )}
                      {author.socialLinks && (
                        <div className="flex justify-center gap-3 mt-3">
                          {author.socialLinks.instagram && (
                            <a
                              href={author.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-pink hover:text-primary-pink/80 transition-colors"
                              aria-label={`${author.name} Instagram`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {author.socialLinks.youtube && (
                            <a
                              href={author.socialLinks.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-pink hover:text-primary-pink/80 transition-colors"
                              aria-label={`${author.name} YouTube`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </a>
                          )}
                          {author.socialLinks.facebook && (
                            <a
                              href={author.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-pink hover:text-primary-pink/80 transition-colors"
                              aria-label={`${author.name} Facebook`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </a>
                          )}
                          {author.socialLinks.twitter && (
                            <a
                              href={author.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-pink hover:text-primary-pink/80 transition-colors"
                              aria-label={`${author.name} Twitter`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Values Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Οι αξίες μας</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent-green/10 border-l-4 border-accent-green rounded-r-lg p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-2">Απλότητα</h3>
              <p className="text-text-medium text-sm">
                Πιστεύουμε ότι οι καλύτερες λύσεις είναι απλές. Προσπαθούμε να κάνουμε τα πράγματα
                εύκολα και κατανοητά, χωρίς περιττή πολυπλοκότητα.
              </p>
            </div>
            <div className="bg-secondary-blue/10 border-l-4 border-secondary-blue rounded-r-lg p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-2">Πρακτικότητα</h3>
              <p className="text-text-medium text-sm">
                Όλα τα περιεχόμενα μας είναι σχεδιασμένα να μπορούν να εφαρμοστούν αμέσως. Δεν
                θέλουμε θεωρία, θέλουμε πράξη.
              </p>
            </div>
            <div className="bg-primary-pink/10 border-l-4 border-primary-pink rounded-r-lg p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-2">Κοινότητα</h3>
              <p className="text-text-medium text-sm">
                Χτίζουμε μια κοινότητα που στηρίζει τους γονείς. Η γνώμη σας μετράει, και
                προσπαθούμε να ακούμε και να βελτιώνουμε.
              </p>
            </div>
            <div className="bg-accent-yellow/10 border-l-4 border-accent-yellow rounded-r-lg p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-2">Ασφάλεια</h3>
              <p className="text-text-medium text-sm">
                Η ασφάλεια των παιδιών είναι προτεραιότητα. Όλες οι δραστηριότητες και οι
                συμβουλές μας είναι σχεδιασμένες με ασφάλεια ως βασική αρχή.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background-white rounded-card p-8 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-text-dark">Θέλετε να επικοινωνήσετε;</h3>
              <p className="text-text-medium">
                Στείλτε μας ιδέα, ερώτηση, ή feedback. Η γνώμη σας είναι πολύτιμη για εμάς.
              </p>
            </div>
            <Link
              href="/epikoinonia"
              className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-6 py-3 text-white hover:bg-primary-pink/90 transition text-lg font-semibold"
            >
              Επικοινωνήστε μαζί μας
            </Link>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}
