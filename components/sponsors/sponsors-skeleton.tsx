"use client";

export function SponsorsSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
        >
          <div className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white min-h-[200px] animate-pulse">
            {/* Logo Skeleton */}
            <div className="w-full h-32 bg-background-light" />
            
            {/* Content Skeleton */}
            <div className="p-6 space-y-3">
              <div className="h-5 bg-background-light rounded w-3/4" />
              <div className="h-4 bg-background-light rounded w-full" />
              <div className="h-4 bg-background-light rounded w-2/3" />
              <div className="pt-2 border-t border-border/20">
                <div className="h-4 bg-background-light rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

