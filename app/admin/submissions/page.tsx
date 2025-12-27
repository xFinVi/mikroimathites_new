import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/pages/page-header";
import { SubmissionsAdmin } from "@/components/admin/submissions-admin";
import { Suspense } from "react";

export default function AdminSubmissionsPage() {
  return (
      <Container className="py-10 sm:py-14 md:py-16">
        <Suspense fallback={<div className="text-center py-8">Φόρτωση...</div>}>
          <SubmissionsAdmin />
        </Suspense>
      </Container>
  );
}

