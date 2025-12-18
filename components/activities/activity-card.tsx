import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const imageUrl = activity.coverImage
    ? urlFor(activity.coverImage).width(400).height(250).url()
    : null;

  return (
    <Link href={`/drastiriotites/${activity.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {imageUrl && (
          <div className="relative w-full h-48 bg-background-light">
            <Image
              src={imageUrl}
              alt={activity.title}
              fill
              className="object-cover"
            />
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

