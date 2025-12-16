import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <Container className="py-16 text-center space-y-6">
        <h1 className="text-4xl font-bold text-text-dark">Η σελίδα δεν βρέθηκε</h1>
        <p className="text-lg text-text-medium">
          Η σελίδα που αναζητάτε δεν υπάρχει. Δοκιμάστε να επιστρέψετε στην αρχική.
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-6 py-3 text-white hover:bg-primary-pink/90 transition"
          >
            Επιστροφή στην αρχική
          </Link>
        </div>
      </Container>
    </PageWrapper>
  );
}

