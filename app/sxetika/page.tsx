import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("sxetika");

export default function SxetikaPage() {
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
              eyebrow="About"
              title="Σχετικά"
              description="Γεια σας! Είμαστε οι Μικροί Μαθητές"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-10">
        {/* Mission cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Η αποστολή μας", desc: "Υποστήριξη γονέων με απλές, πρακτικές ιδέες." },
            { title: "Γιατί ξεκινήσαμε", desc: "Να φέρουμε περιεχόμενο φιλικό, σύντομο, σε ελληνικά." },
            { title: "Τι θα βρείτε εδώ", desc: "Parent Hub, δραστηριότητες, εκτυπώσιμα, Q&A." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 space-y-2"
            >
              <h3 className="text-lg font-semibold text-text-dark">{item.title}</h3>
              <p className="text-text-medium text-sm">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Team placeholder */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Η ομάδα</h2>
            <span className="text-sm text-text-medium">Θα συνδεθεί με CMS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Victoria", "Iris", "Bruno"].map((name, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 space-y-2 text-center"
              >
                <div className="h-24 w-full rounded-lg bg-background-light animate-pulse" />
                <h3 className="text-lg font-semibold text-text-dark">{name}</h3>
                <p className="text-text-medium text-sm">Σύντομο bio — CMS placeholder</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-text-dark">Θέλετε κάτι να προσθέσουμε;</h3>
            <p className="text-text-medium">
              Στείλτε μας ιδέα ή μήνυμα. Θα συνδεθεί με Supabase submissions και Sanity Q&A.
            </p>
          </div>
          <Link
            href="/epikoinonia"
            className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-5 py-3 text-white hover:bg-primary-pink/90 transition"
          >
            Επικοινωνήστε μαζί μας
          </Link>
        </section>
      </Container>
    </PageWrapper>
  );
}

