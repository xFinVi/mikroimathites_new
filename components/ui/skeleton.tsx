import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Reusable skeleton component with shimmer effect
 * Use for loading states throughout the app
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-background-light",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for content cards (articles, activities, recipes, printables)
 */
export function ContentCardSkeleton() {
  return (
    <div className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white shadow-subtle">
      {/* Image skeleton */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-background-light">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-5 md:p-6 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-6 w-24 rounded-full" />
        
        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        
        {/* Excerpt */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 pt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for article/activity detail pages
 */
export function ContentDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero image skeleton */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-background-light rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-full" /> {/* Category */}
        <Skeleton className="h-10 w-3/4" /> {/* Title line 1 */}
        <Skeleton className="h-10 w-2/3" /> {/* Title line 2 */}
        <Skeleton className="h-6 w-full max-w-2xl" /> {/* Excerpt */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4 max-w-4xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className={i % 3 === 0 ? "h-4 w-5/6" : "h-4 w-full"} />
          </div>
        ))}
      </div>
    </div>
  );
}

