import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("gia-goneis");

export default function GiaGoneisPage() {
  return (
    <PageWrapper>
      {/* Hero with background image */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Για Γονείς background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/50 via-background-light/70 to-background-light" />
        </div>

        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              eyebrow="Parent Hub"
              title="Για Γονείς"
              description="Σύντομες συμβουλές & πρακτικές ιδέες για την καθημερινότητα με το παιδί"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* CMS-ready Featured Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Κύριες ενότητες</h2>
            <span className="text-sm text-text-medium">Σύντομα από CMS (Sanity)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Ύπνος & Ρουτίνες", desc: "Τελετουργίες, ύπνος, ηρεμία" },
              { title: "Ομιλία & Λεξιλόγιο", desc: "Γλώσσα, παιχνίδια ομιλίας" },
              { title: "Διατροφή & Επιλογές", desc: "Προτάσεις και ιδέες χωρίς πίεση" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50"
              >
                <div className="text-2xl font-semibold text-text-dark mb-2">{item.title}</div>
                <p className="text-text-medium text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CMS-ready Featured Articles grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Προτεινόμενα άρθρα</h2>
            <span className="text-sm text-text-medium">Θα συνδεθεί με CMS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 space-y-3"
              >
                <div className="h-3 w-24 rounded-full bg-accent-yellow/50" />
                <div className="h-5 w-3/4 rounded bg-text-medium/15" />
                <div className="h-4 w-2/3 rounded bg-text-medium/10" />
                <div className="text-sm text-text-light">CMS placeholder</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips list */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Γρήγορες λύσεις (5’)</h2>
            <span className="text-sm text-text-medium">Σύντομα από CMS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "3 φράσεις για ήρεμες μεταβάσεις",
              "Μικρά παιχνίδια λεξιλογίου",
              "Απαλά όρια χωρίς θυμούς",
              "Ρουτίνα ύπνου σε 4 βήματα",
            ].map((tip, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card p-4 shadow-subtle border border-border/50 flex items-center gap-3"
              >
                <span className="text-lg font-semibold text-primary-pink">{idx + 1}.</span>
                <p className="text-text-dark">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support / CTA */}
        <section className="space-y-4 bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-dark">Στείλτε μας ιδέα ή ερώτηση</h3>
              <p className="text-text-medium">Όλα θα συνδεθούν με την υποβολή στο CMS/Supabase.</p>
            </div>
            <Link
              href="/epikoinonia"
              className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-5 py-3 text-white hover:bg-primary-pink/90 transition"
            >
              Μετάβαση στην υποβολή
            </Link>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}

