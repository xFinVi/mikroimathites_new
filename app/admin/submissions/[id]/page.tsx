import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/pages/page-header";
import { SubmissionDetail } from "@/components/admin/submission-detail";

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Container className="py-10 sm:py-14 md:py-16">
      <PageHeader
        title="Λεπτομέρειες Υποβολής"
        description="Προβολή και διαχείριση λεπτομερειών υποβολής"
      />
      <SubmissionDetail params={params} />
    </Container>
  );
}

