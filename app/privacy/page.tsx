import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { CONTACT_CONSTANTS } from "@/lib/constants/contact";
import Image from "next/image";

export const metadata = generateMetadataFor("privacy");

export default function PrivacyPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Απόρρητο background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Πολιτική Απορρήτου"
              description="Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <p className="text-text-medium leading-relaxed">
              Η πολιτική απορρήτου μας περιγράφει πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε
              τα προσωπικά σας δεδομένα όταν χρησιμοποιείτε τον ιστότοπο{" "}
              <strong>Μικροί Μαθητές</strong>. Σεβόμαστε το απόρρητό σας και δεσμευόμαστε να
              προστατεύουμε τα προσωπικά σας δεδομένα.
            </p>
            <p className="text-sm text-text-light mt-4">
              <strong>Τελευταία ενημέρωση:</strong> {new Date().toLocaleDateString("el-GR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>

          {/* Data Collection */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">1. Ποια δεδομένα συλλέγουμε</h2>
            <div className="space-y-4 text-text-medium">
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                  Δεδομένα που παρέχετε εσείς
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Email διεύθυνση:</strong> Όταν εγγράφεστε στο newsletter μας
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Ονόματα και μηνύματα:</strong> Όταν υποβάλλετε φόρμες επικοινωνίας,
                      Q&A, ή feedback
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Συναίνεση δημοσίευσης:</strong> Όταν επιλέγετε να δημοσιευτούν οι
                      ερωτήσεις/απαντήσεις σας
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                  Δεδομένα που συλλέγονται αυτόματα
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Τεχνικά δεδομένα:</strong> IP διεύθυνση, τύπος browser, λειτουργικό
                      σύστημα
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Cookies:</strong> Χρησιμοποιούμε cookies για να βελτιώσουμε την
                      εμπειρία σας (βλέπε ενότητα Cookies)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Αναλυτικά:</strong> Στατιστικά επισκεψιμότητας (Google Analytics) με
                      συναίνεση
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              2. Πώς χρησιμοποιούμε τα δεδομένα σας
            </h2>
            <ul className="space-y-3 text-text-medium">
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Newsletter:</strong> Για να σας στέλνουμε ενημερώσεις για νέο περιεχόμενο,
                  δραστηριότητες και συμβουλές
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Επικοινωνία:</strong> Για να απαντήσουμε στις ερωτήσεις και υποβολές σας
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Βελτίωση υπηρεσίας:</strong> Για να αναλύσουμε τη χρήση του ιστότοπου
                  και να βελτιώσουμε το περιεχόμενο
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Νομικές υποχρεώσεις:</strong> Για να συμμορφωθούμε με τους νόμους και
                  κανονισμούς
                </span>
              </li>
            </ul>
          </section>

          {/* Data Storage */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              3. Πού αποθηκεύουμε τα δεδομένα σας
            </h2>
            <div className="space-y-4 text-text-medium">
              <p>
                Τα δεδομένα σας αποθηκεύονται ασφαλώς σε εξειδικευμένες πλατφόρμες:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    <strong>Supabase:</strong> Για αποθήκευση email subscriptions και form
                    submissions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    <strong>Sanity CMS:</strong> Για διαχείριση περιεχομένου (χωρίς προσωπικά
                    δεδομένα)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>
                    <strong>Google Analytics:</strong> Για στατιστικά (μόνο με συναίνεση)
                  </span>
                </li>
              </ul>
              <p className="text-sm text-text-light">
                Όλες οι πλατφόρμες συμμορφώνονται με τον GDPR και χρησιμοποιούν κρυπτογράφηση για
                την προστασία των δεδομένων.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">4. Τα δικαιώματά σας (GDPR)</h2>
            <p className="text-text-medium mb-4">
              Σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), έχετε τα ακόλουθα
              δικαιώματα:
            </p>
            <ul className="space-y-3 text-text-medium">
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Δικαίωμα πρόσβασης:</strong> Μπορείτε να ζητήσετε αντίγραφο των
                  δεδομένων σας
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Δικαίωμα διόρθωσης:</strong> Μπορείτε να ζητήσετε διόρθωση λανθασμένων
                  δεδομένων
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Δικαίωμα διαγραφής:</strong> Μπορείτε να ζητήσετε διαγραφή των
                  δεδομένων σας
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Δικαίωμα ανάκλησης συναίνεσης:</strong> Μπορείτε να διακόψετε τη
                  συνδρομή στο newsletter ανά πάσα στιγμή
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span>
                  <strong>Δικαίωμα μεταφοράς:</strong> Μπορείτε να ζητήσετε τα δεδομένα σας σε
                  μηχανικά αναγνώσιμη μορφή
                </span>
              </li>
            </ul>
            <p className="text-text-medium mt-4">
              Για να ασκήσετε οποιοδήποτε από αυτά τα δικαιώματα, επικοινωνήστε μαζί μας στο{" "}
              <a
                href={`mailto:${CONTACT_CONSTANTS.EMAIL}`}
                className="text-primary-pink hover:underline font-semibold"
              >
                {CONTACT_CONSTANTS.EMAIL}
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">5. Cookies</h2>
            <div className="space-y-4 text-text-medium">
              <p>
                Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας στον ιστότοπο. Τα
                cookies είναι μικρά αρχεία που αποθηκεύονται στη συσκευή σας.
              </p>
              <div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">Τύποι cookies:</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Αναγκαία cookies:</strong> Απαραίτητα για τη λειτουργία του
                      ιστότοπου
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-pink mt-1">•</span>
                    <span>
                      <strong>Αναλυτικά cookies:</strong> Για στατιστικά (Google Analytics) - μόνο
                      με συναίνεση
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-text-light">
                Μπορείτε να διαχειριστείτε τις προτιμήσεις cookies σας από το footer του
                ιστότοπου.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              6. Προστασία δεδομένων παιδιών
            </h2>
            <div className="space-y-3 text-text-medium">
              <p>
                <strong>Δεν συλλέγουμε σκόπιμα προσωπικά δεδομένα από παιδιά κάτω των 16 ετών.</strong>
              </p>
              <p>
                Όλες οι φόρμες και οι υπηρεσίες μας απευθύνονται σε γονείς και κηδεμόνες. Αν
                ανακαλύψουμε ότι έχουμε συλλέξει δεδομένα από παιδί χωρίς συναίνεση γονέα, θα
                διαγράψουμε αμέσως αυτά τα δεδομένα.
              </p>
              <p className="text-sm text-text-light">
                Αν πιστεύετε ότι έχουμε συλλέξει δεδομένα από παιδί, επικοινωνήστε μαζί μας
                αμέσως.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">
              7. Αλλαγές στην πολιτική απορρήτου
            </h2>
            <p className="text-text-medium">
              Μπορούμε να ενημερώσουμε αυτή την πολιτική απορρήτου περιστασιακά. Θα ειδοποιούμε
              τους χρήστες του newsletter για σημαντικές αλλαγές μέσω email. Η συνεχής χρήση του
              ιστότοπου μετά από αλλαγές σημαίνει ότι αποδέχεστε την ενημερωμένη πολιτική.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <h2 className="text-2xl font-bold text-text-dark mb-4">8. Επικοινωνία</h2>
            <p className="text-text-medium mb-4">
              Για ερωτήσεις σχετικά με την πολιτική απορρήτου ή για να ασκήσετε τα δικαιώματά
              σας, επικοινωνήστε μαζί μας:
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

