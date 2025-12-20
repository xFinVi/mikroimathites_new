import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { SubmissionsAdmin } from "@/components/admin/submissions-admin";

export default function AdminSubmissionsPage() {
  return (
    <PageWrapper>
      <Container className="py-10 sm:py-14 md:py-16">
        <PageHeader
          eyebrow="Admin"
          title="Submissions Management"
          description="View and manage user submissions (video ideas, feedback, Q&A)"
        />
        <SubmissionsAdmin />
      </Container>
    </PageWrapper>
  );
}

