import { Container } from "@/components/ui/container";
import { SponsorsAdmin } from "@/components/admin/sponsors-admin";
import { Suspense } from "react";

export default function AdminSponsorsPage() {
  return (
    <Container className="py-10 sm:py-14 md:py-16">
      <Suspense fallback={<div className="text-center py-8">Φόρτωση...</div>}>
        <SponsorsAdmin />
      </Suspense>
    </Container>
  );
}

