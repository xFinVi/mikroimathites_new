import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { CONTACT_CONSTANTS } from "@/lib/constants";
import Image from "next/image";

export const metadata = generateMetadataFor("terms");

export default function TermsPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Όροι & Προϋποθέσεις background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Όροι & Προϋποθέσεις"
              description="Οι όροι χρήσης του ιστότοπου Μικροί Μαθητές"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <p className="text-text-medium leading-relaxed">
              Καλώς ήρθατε στον ιστότοπο <strong>Μικροί Μαθητές</strong>. Με την πρόσβαση και τη
              χρήση αυτού του ιστότοπου, αποδέχεστε τους παρακάτω όρους και προϋποθέσεις. Αν δεν
              συμφωνείτε με αυτούς τους όρους, παρακαλώ μην χρησιμοποιείτε τον ιστότοπο.
            </p>
            <p className="text-sm text-text-light mt-4">
              <strong>Τελευταία ενημέρωση:</strong> {new Date().toLocaleDateString("el-GR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>

          {/* Acceptance */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              1. Αποδοχή των όρων
            </h2>
            <p className="text-text-medium">
              Με την πρόσβαση στον ιστότοπο, αποδέχεστε αυτούς τους όρους και τις προϋποθέσεις.
              Αν δεν συμφωνείτε, παρακαλώ σταματήστε τη χρήση του ιστότοπου αμέσως.
            </p>
          </section>

          {/* Use of Content */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">2. Χρήση περιεχομένου</h2>
            <div className="space-y-4 text-text-medium">
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">Άδεια χρήσης</h3>
                <p>
                  Το περιεχόμενο του ιστότοπου (άρθρα, δραστηριότητες, εκτυπώσιμα, συνταγές) είναι
                  προς προσωπική, μη εμπορική χρήση. Μπορείτε να:
                </p>
                <ul className="space-y-2 ml-4 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">✓</span>
                    <span>Εκτυπώσετε περιεχόμενο για προσωπική χρήση</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">✓</span>
                    <span>Μοιραστείτε συνδέσμους προς το περιεχόμενο</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">✓</span>
                    <span>Χρησιμοποιήσετε τις δραστηριότητες με τα παιδιά σας</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">Περιορισμοί</h3>
                <p className="mb-2">Δεν επιτρέπεται να:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Αναπαράγετε, διανέμετε ή πουλήσετε το περιεχόμενο χωρίς άδεια</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Χρησιμοποιήσετε το περιεχόμενο για εμπορικούς σκοπούς</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Τροποποιήσετε ή δημιουργήσετε παράγωγα έργα χωρίς άδεια</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Αφαιρέσετε πνευματικά δικαιώματα ή πηγές</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Submissions */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              3. Υποβολές χρηστών
            </h2>
            <div className="space-y-4 text-text-medium">
              <p>
                Όταν υποβάλλετε περιεχόμενο (Q&A, feedback, ιδέες), δίνετε την άδεια στον ιστότοπο
                να:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    Χρησιμοποιήσει, αναπαράγει και δημοσιεύσει το περιεχόμενο (μόνο με τη συναίνεση
                    δημοσίευσης που επιλέγετε)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    Τροποποιήσει ή επεξεργαστεί το περιεχόμενο για σκοπούς δημοσίευσης
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    Χρησιμοποιήσει το περιεχόμενο για βελτίωση της υπηρεσίας (ακόμη και αν δεν
                    δημοσιευτεί)
                  </span>
                </li>
              </ul>
              <p className="text-sm text-text-light">
                <strong>Σημαντικό:</strong> Δεν δημοσιεύουμε προσωπικές πληροφορίες για παιδιά. Όλες
                οι Q&A δημοσιεύονται μόνο μετά από έγκριση και αφαίρεση προσωπικών στοιχείων.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">4. Αποποιήσεις</h2>
            <div className="space-y-4 text-text-medium">
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                  Ιατρικές/Επαγγελματικές συμβουλές
                </h3>
                <p>
                  <strong>
                    Το περιεχόμενο του ιστότοπου δεν αποτελεί ιατρική, ψυχολογική ή επαγγελματική
                    συμβουλή.
                  </strong>{" "}
                  Όλες οι πληροφορίες παρέχονται για γενικούς σκοπούς πληροφόρησης. Για σοβαρές
                  ανησυχίες σχετικά με την υγεία ή την ανάπτυξη του παιδιού σας, συμβουλευτείτε
                  πάντα έναν επαγγελματία (παιδίατρο, ψυχολόγο, κλπ.).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">Ασφάλεια</h3>
                <p>
                  Όλες οι δραστηριότητες και οι συμβουλές μας είναι σχεδιασμένες με ασφάλεια ως
                  βασική αρχή. Ωστόσο, <strong>εσείς είστε υπεύθυνοι</strong> για την επίβλεψη
                  των παιδιών σας κατά τη διάρκεια των δραστηριοτήτων. Ο ιστότοπος δεν φέρει
                  ευθύνη για τυχόν ατυχήματα ή ζημιές.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">Ακρίβεια</h3>
                <p>
                  Προσπαθούμε να διατηρούμε το περιεχόμενο ακριβές και ενημερωμένο, αλλά δεν
                  εγγυόμαστε την πληρότητα ή την ακρίβεια όλων των πληροφοριών. Ο ιστότοπος
                  παρέχεται "ως έχει" χωρίς εγγυήσεις.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              5. Πνευματικά δικαιώματα
            </h2>
            <p className="text-text-medium">
              Όλο το περιεχόμενο του ιστότοπου (κείμενα, εικόνες, λογότυπα, σχέδια) είναι
              προστατευμένο από πνευματικά δικαιώματα και ανήκει στον ιστότοπο{" "}
              <strong>Μικροί Μαθητές</strong> ή στους αντίστοιχους δημιουργούς. Η μη εξουσιοδοτημένη
              χρήση αποτελεί παραβίαση των πνευματικών δικαιωμάτων και μπορεί να οδηγήσει σε
              νομικές ενέργειες.
            </p>
          </section>

          {/* Links to Third Parties */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              6. Σύνδεσμοι προς τρίτους
            </h2>
            <p className="text-text-medium">
              Ο ιστότοπος μπορεί να περιέχει συνδέσμους προς εξωτερικούς ιστότοπους. Δεν φέρουμε
              ευθύνη για το περιεχόμενο, τις πολιτικές απορρήτου ή τις πρακτικές αυτών των
              ιστότοπων. Συνιστούμε να διαβάζετε τους όρους χρήσης και τις πολιτικές απορρήτου
              κάθε εξωτερικού ιστότοπου που επισκέπτεστε.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              7. Περιορισμός ευθύνης
            </h2>
            <p className="text-text-medium">
              Ο ιστότοπος <strong>Μικροί Μαθητές</strong> δεν φέρει ευθύνη για:
            </p>
            <ul className="space-y-2 ml-4 mt-3 text-text-medium">
              <li className="flex items-start gap-2">
                <span className="text-primary-pink mt-1">•</span>
                <span>Ζημιές που προκύπτουν από τη χρήση ή την αδυναμία χρήσης του ιστότοπου</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-pink mt-1">•</span>
                <span>Απώλεια δεδομένων ή πληροφοριών</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-pink mt-1">•</span>
                <span>Ζημιές από τη χρήση των δραστηριοτήτων ή συμβουλών</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-pink mt-1">•</span>
                <span>Τεχνικά προβλήματα ή διακοπές λειτουργίας</span>
              </li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              8. Αλλαγές στους όρους
            </h2>
            <p className="text-text-medium">
              Διατηρούμε το δικαίωμα να τροποποιούμε αυτούς τους όρους ανά πάσα στιγμή. Οι
              αλλαγές θα δημοσιεύονται σε αυτή τη σελίδα. Η συνεχής χρήση του ιστότοπου μετά από
              αλλαγές σημαίνει ότι αποδέχεστε τους ενημερωμένους όρους.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">9. Εφαρμοστέο δίκαιο</h2>
            <p className="text-text-medium">
              Αυτοί οι όροι διέπονται από το ελληνικό δίκαιο. Οποιαδήποτε διαφορά που προκύπτει
              από ή σχετίζεται με αυτούς τους όρους θα επιλύεται στα ελληνικά δικαστήρια.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">10. Επικοινωνία</h2>
            <p className="text-text-medium mb-4">
              Για ερωτήσεις σχετικά με αυτούς τους όρους, επικοινωνήστε μαζί μας:
            </p>
            <div className="space-y-2 text-text-medium">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${CONTACT_CONSTANTS.EMAIL}`}
                  className="text-primary-pink hover:underline"
                >
                  {CONTACT_CONSTANTS.EMAIL}
                </a>
              </p>
              <p>
                <strong>Ιστότοπος:</strong>{" "}
                <a href="/epikoinonia" className="text-primary-pink hover:underline">
                  /epikoinonia
                </a>
              </p>
            </div>
          </section>
        </div>
      </Container>
    </PageWrapper>
  );
}

