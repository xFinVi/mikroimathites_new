import { Container } from "@/components/ui/container";
import { DashboardStats } from "@/components/admin/dashboard-stats";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Container className="py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Πίνακας Ελέγχου</h1>
          <p className="text-text-medium">Επισκόπηση υποβολών και δραστηριοτήτων</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />
      </Container>
    </div>
  );
}

