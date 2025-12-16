import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("epikoinonia");

export default function EpikoinoniaPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Επικοινωνία background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              eyebrow="Support / Contact"
              title="Επικοινωνία"
              description="Η γνώμη σας μετράει - Στείλτε ιδέα για βίντεο, feedback ή ερώτηση"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-10">
        {/* Tabs placeholder */}
        <section className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-text-dark">Φόρμες (CMS/DB ready):</span>
            {["Ιδέα για βίντεο", "Feedback", "Ερώτηση (Q&A)"].map((label) => (
              <div
                key={label}
                className="px-3 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm"
              >
                {label}
              </div>
            ))}
          </div>
          <p className="text-text-medium text-sm">
            Οι φόρμες θα συνδεθούν με Supabase (submissions) + Sanity (δημοσίευση Q&A).
          </p>
        </section>

        {/* Placeholder form blocks */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Ιδέα για βίντεο", note: "Αποθήκευση σε Supabase, status workflow." },
            { title: "Feedback", note: "Καταγραφή + αξιολόγηση (1-5)." },
            { title: "Ερώτηση (Q&A)", note: "Έγκριση πριν δημοσίευση (Sanity Q&A)." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 space-y-2"
            >
              <h3 className="text-lg font-semibold text-text-dark">{item.title}</h3>
              <p className="text-text-medium text-sm">{item.note}</p>
              <div className="text-xs text-text-light">Σύντομα διαθέσιμο</div>
            </div>
          ))}
        </section>

        {/* CTA to newsletter/support */}
        <section className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-text-dark">Χρειάζεστε κάτι συγκεκριμένο;</h3>
            <p className="text-text-medium">
              Γράψτε μας ή αφήστε τα στοιχεία σας — θα συνδεθεί με Supabase submissions.
            </p>
          </div>
          <Link
            href="/epikoinonia"
            className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-5 py-3 text-white hover:bg-primary-pink/90 transition"
          >
            Μετάβαση στη φόρμα
          </Link>
        </section>
      </Container>
    </PageWrapper>
  );
}

