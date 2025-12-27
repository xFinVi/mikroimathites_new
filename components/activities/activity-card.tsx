import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { getContentUrl } from "@/lib/utils/content";

interface ActivityCardProps {
  activity: Activity & { imageUrl?: string | null };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  // Use pre-generated imageUrl from server, or fallback to null
  const imageUrl = activity.imageUrl || null;

  // Fallback image if coverImage is missing
  const hasImage = !!imageUrl;

  return (
    <Link href={getContentUrl("activity", activity.slug)}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {hasImage ? (
          <div className="relative w-full h-48 bg-background-light">
            <Image
              src={imageUrl!}
              alt={activity.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-xs text-text-medium font-medium">No Image</div>
            </div>
          </div>
        )}
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xl font-semibold text-text-dark line-clamp-2 leading-tight">
            {activity.title}
          </h3>
          {activity.summary && (
            <p className="text-text-medium text-sm line-clamp-3 leading-relaxed">
              {activity.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center pt-1">
            {activity.ageGroups && activity.ageGroups.length > 0 && (
              <span className="px-2.5 py-1 bg-accent-yellow/25 text-text-dark rounded-full text-xs font-medium border border-accent-yellow/30">
                {activity.ageGroups.map((ag) => ag.title).join(", ")}
              </span>
            )}
            {activity.category && (
              <span className="px-2.5 py-1 bg-secondary-blue/20 text-secondary-blue rounded-full text-xs font-medium">
                {activity.category.title}
              </span>
            )}
            {activity.duration && (
              <span className="px-2.5 py-1 bg-background-light text-text-medium rounded-full text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activity.duration}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


