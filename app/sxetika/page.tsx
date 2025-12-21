import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getAuthors } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image-url";

export const metadata = generateMetadataFor("sxetika");

export default async function SxetikaPage() {
  const authors = await getAuthors();

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
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
              description="Γεια σας! Είμαστε οι Μικροί Μαθητές"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Mission Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Η αποστολή μας</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-3">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold text-text-dark">Η αποστολή μας</h3>
              <p className="text-text-medium text-sm">
                Να υποστηρίξουμε τους γονείς με απλές, πρακτικές ιδέες που βοηθούν στην καθημερινή
                ζωή με τα παιδιά. Χωρίς πίεση, χωρίς σύγκριση, μόνο υποστήριξη.
              </p>
            </div>
            <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-3">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-lg font-semibold text-text-dark">Γιατί ξεκινήσαμε</h3>
              <p className="text-text-medium text-sm">
                Είδαμε ότι λείπει περιεχόμενο στα ελληνικά για γονείς με παιδιά 0-6 ετών. Θέλαμε να
                φέρουμε περιεχόμενο φιλικό, σύντομο, και πρακτικό που μπορεί να εφαρμοστεί αμέσως.
              </p>
            </div>
            <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-3">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="text-lg font-semibold text-text-dark">Τι θα βρείτε εδώ</h3>
              <p className="text-text-medium text-sm">
                Parent Hub με συμβουλές, δραστηριότητες, εκτυπώσιμα, συνταγές, και Q&A. Όλα
                σχεδιασμένα για να είναι εύκολα, πρακτικά, και χρήσιμα.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {authors && authors.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Η ομάδα</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => {
                const imageUrl = author.profilePicture
                  ? urlFor(author.profilePicture).width(200).height(200).url()
                  : null;
                return (
                  <div
                    key={author._id}
                    className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-4 text-center"
                  >
                    {imageUrl ? (
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-background-light flex items-center justify-center text-4xl">
                        👤
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark mb-1">{author.name}</h3>
                      {author.role && (
                        <p className="text-sm text-primary-pink font-medium mb-2">{author.role}</p>
                      )}
                      {author.bio && (
                        <p className="text-text-medium text-sm">{author.bio}</p>
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
