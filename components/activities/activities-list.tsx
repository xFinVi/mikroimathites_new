import { Activity, Printable } from "@/lib/content";
import { ActivityCard } from "./activity-card";
import Image from "next/image";
import Link from "next/link";

type ContentItem = (Activity | Printable) & { _contentType: "activity" | "printable"; imageUrl?: string | null };

interface ActivitiesListProps {
  items: ContentItem[];
  title?: string;
}

export function ActivitiesList({ items, title }: ActivitiesListProps) {
  const displayTitle = title || `Δραστηριότητες & Εκτυπώσιμα (${items.length})`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
          {displayTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          if (item._contentType === "activity") {
            return <ActivityCard key={item._id} activity={item as Activity} />;
          } else {
            // Printable card
            const printable = item as Printable & { imageUrl?: string | null };
            // Use pre-generated image URL from server (no client-side generation)
            const imageUrl = printable.imageUrl || null;
            return (
              <Link
                key={printable._id}
                href={`/drastiriotites/printables/${printable.slug}`}
                className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-lg transition-shadow"
              >
                {imageUrl && (
                  <div className="relative w-full h-48 bg-background-light">
                    <Image
                      src={imageUrl}
                      alt={printable.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-primary-pink">Εκτυπώσιμο</div>
                  <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
                    {printable.title}
                  </h3>
                  {printable.summary && (
                    <p className="text-text-medium text-sm line-clamp-3">
                      {printable.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 items-center">
                    {printable.ageGroups && printable.ageGroups.length > 0 && (
                      <span className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full text-xs">
                        {printable.ageGroups.map((ag) => ag.title).join(", ")}
                      </span>
                    )}
                    {/* Printables don't have categories */}
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </section>
  );
}

