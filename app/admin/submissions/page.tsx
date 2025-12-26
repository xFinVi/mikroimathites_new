import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/pages/page-header";
import { SubmissionsAdmin } from "@/components/admin/submissions-admin";

export default function AdminSubmissionsPage() {
  return (
      <Container className="py-10 sm:py-14 md:py-16">
        <SubmissionsAdmin />
      </Container>
  );
}

