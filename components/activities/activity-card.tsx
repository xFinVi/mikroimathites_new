import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityCardProps {
  activity: Activity & { imageUrl?: string | null };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  // Use pre-generated imageUrl from server, or fallback to null
  const imageUrl = activity.imageUrl || null;

  // Fallback image if coverImage is missing
  const hasImage = !!imageUrl;

  return (
    <Link href={`/drastiriotites/${activity.slug}`}>
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
          <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
            {activity.title}
          </h3>
          {activity.summary && (
            <p className="text-text-medium text-sm line-clamp-3">
              {activity.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            {activity.ageGroups && activity.ageGroups.length > 0 && (
              <span className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full text-xs">
                {activity.ageGroups.map((ag) => ag.title).join(", ")}
              </span>
            )}
            {activity.category && (
              <span className="px-2 py-1 bg-secondary-blue/20 text-secondary-blue rounded-full text-xs">
                {activity.category.title}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


