import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { ContentCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DrastiriotitesLoading() {
  return (
    <PageWrapper>
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Search and Filters skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-card" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>

        {/* Content grid skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ContentCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

