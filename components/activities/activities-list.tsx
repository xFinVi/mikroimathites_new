"use client";

import { Activity, Printable } from "@/lib/content";
import { ActivityCard } from "./activity-card";
import Image from "next/image";
import Link from "next/link";
import { getContentUrl } from "@/lib/utils/content";

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
            
            const handleDownloadClick = async (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (printable.file) {
                try {
                  // Fetch file URL from API
                  const response = await fetch(`/api/printables/${printable.slug}/download`);
                  if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                      // Create a temporary link and trigger download
                      const link = document.createElement('a');
                      link.href = data.url;
                      link.download = `${printable.slug}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  } else {
                    // Fallback to detail page
                    window.location.href = getContentUrl("printable", printable.slug);
                  }
                } catch (error) {
                  // Fallback to detail page on error
                  window.location.href = getContentUrl("printable", printable.slug);
                }
              }
            };

            return (
              <div
                key={printable._id}
                className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-lg transition-shadow group"
              >
                <Link
                  href={getContentUrl("printable", printable.slug)}
                  className="block"
                >
                  {imageUrl ? (
                    <div className="relative w-full h-48 bg-background-light">
                      <Image
                        src={imageUrl}
                        alt={printable.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-xs text-text-medium font-medium">No Image</div>
                      </div>
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-primary-pink">Εκτυπώσιμο</div>
                      {printable.file && (
                        <button
                          onClick={handleDownloadClick}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-primary-pink/10 hover:bg-primary-pink/20 text-primary-pink"
                          aria-label="Κατέβασμα PDF"
                          title="Κατέβασμα PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-text-dark line-clamp-2 leading-tight">
                      {printable.title}
                    </h3>
                    {printable.summary && (
                      <p className="text-text-medium text-sm line-clamp-3 leading-relaxed">
                        {printable.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center">
                      {printable.ageGroups && printable.ageGroups.length > 0 && (
                        <span className="px-2.5 py-1 bg-accent-yellow/25 text-text-dark rounded-full text-xs font-medium border border-accent-yellow/30">
                          {printable.ageGroups.map((ag) => ag.title).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}

