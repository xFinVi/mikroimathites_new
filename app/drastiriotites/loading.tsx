import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";

export default function DrastiriotitesLoading() {
  return (
    <PageWrapper>
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="h-12 bg-background-white/50 rounded-lg w-3/4 animate-pulse" />
            <div className="h-6 bg-background-white/50 rounded-lg w-1/2 animate-pulse" />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Search and Filters skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-background-white rounded-card animate-pulse" />
          <div className="h-20 bg-background-white rounded-card animate-pulse" />
        </div>

        {/* Content grid skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-background-white/50 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 h-[400px] animate-pulse"
              >
                <div className="w-full h-48 bg-background-light" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-background-light rounded w-3/4" />
                  <div className="h-5 bg-background-light rounded w-1/2" />
                  <div className="h-4 bg-background-light rounded w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

