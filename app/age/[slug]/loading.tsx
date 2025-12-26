import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { ContentCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function AgeGroupLoading() {
  return (
    <PageWrapper>
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-background-light min-h-[300px] sm:min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/50 via-background-light/70 to-background-light" />
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Featured section skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <ContentCardSkeleton key={idx} />
            ))}
          </div>
        </div>

        {/* Categories skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-28 rounded-full" />
            ))}
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

