import { Activity } from "@/lib/content";
import { format } from "date-fns";
import Link from "next/link";
import { ViewCount } from "@/components/analytics/view-count";

interface ActivityMetaProps {
  activity: Activity;
}

export function ActivityMeta({ activity }: ActivityMetaProps) {
  const publishedDate = activity.publishedAt
    ? format(new Date(activity.publishedAt), "d MMMM yyyy")
    : null;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-medium">
      {activity.duration && (
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Διάρκεια: {activity.duration}</span>
        </div>
      )}

      {publishedDate && (
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{publishedDate}</span>
        </div>
      )}

      <ViewCount
        content_type="activity"
        content_slug={activity.slug}
        showIcon={true}
      />

      {activity.ageGroups && activity.ageGroups.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activity.ageGroups.map((ageGroup) => (
            <Link
              key={ageGroup._id}
              href={`/drastiriotites?age=${ageGroup.slug}`}
              className="px-3 py-1 rounded-full bg-secondary-blue/10 text-secondary-blue text-xs font-medium hover:bg-secondary-blue/20 transition"
            >
              {ageGroup.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

