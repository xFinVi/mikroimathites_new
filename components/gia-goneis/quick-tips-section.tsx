import Image from "next/image";
import Link from "next/link";
import { CuratedCollection } from "@/lib/content";
import { getContentUrl, type ContentType, getContentTypeLabel } from "@/lib/utils/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
import { EmptyState } from "@/components/ui/empty-state";

interface QuickTipsSectionProps {
  quickTips: CuratedCollection | null;
}

/**
 * Quick Tips Section Component
 * 
 * Follows "data in, UI out" pattern - receives data as props, only renders UI
 * Handles empty states and fallback content internally
 */
export function QuickTipsSection({ quickTips }: QuickTipsSectionProps) {
  // Helper to determine content type from item
  const getContentType = (item: { _type: string }): ContentType => {
    if (item._type === "article") return "article";
    if (item._type === "recipe") return "recipe";
    if (item._type === "activity") return "activity";
    if (item._type === "printable") return "printable";
    return "article"; // Default fallback
  };

  // Filter valid items
  const validItems =
    quickTips?.items?.filter((item) => item && item.slug && item.title) || [];

  // Only show section if we have items (more than 0)
  if (!quickTips || validItems.length === 0) {
    return null;
  }

  // Render Quick Tips grid
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
          {quickTips.title || "Γρήγορες λύσεις (5')"}
        </h2>
      </div>
      {quickTips.description && (
        <p className="text-text-medium">{quickTips.description}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {validItems.map((item, idx) => {
          // Build the correct URL based on content type using shared utility
          const contentType = getContentType(item);
          const href = item.slug ? getContentUrl(contentType, item.slug) : "#";

          // Get image URL using shared helper
          const imageUrl = generateImageUrl(
            item.coverImage,
            GIA_GONEIS_CONSTANTS.IMAGE_SIZES.QUICK_TIP.width,
            GIA_GONEIS_CONSTANTS.IMAGE_SIZES.QUICK_TIP.height
          );

          // Use color variants from constants
          const colorClass =
            GIA_GONEIS_CONSTANTS.QUICK_TIPS_COLOR_VARIANTS[
              idx % GIA_GONEIS_CONSTANTS.QUICK_TIPS_COLOR_VARIANTS.length
            ];

          // Get emoji for content type
          const getContentEmoji = (type: ContentType): string => {
            switch (type) {
              case "recipe":
                return "🍳";
              case "activity":
                return "🎨";
              case "printable":
                return "🖨️";
              default:
                return "📄";
            }
          };

          return (
            <Link
              key={item._id || `item-${idx}`}
              href={href}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary-pink/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
            >
              {/* Number Badge */}
              <div className="absolute top-3 left-3 z-10 bg-primary-pink text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                {idx + 1}
              </div>

              {/* Image Section */}
              <div
                className={`relative w-full h-48 bg-gradient-to-br ${colorClass} overflow-hidden`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">
                        {getContentEmoji(contentType)}
                      </div>
                    </div>
                  </div>
                )}
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col bg-white">
                <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors">
                  {item.title}
                </h3>

                {/* Content Type Badge */}
                <div className="mt-auto pt-3 border-t border-border/30">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-medium">
                    {getContentTypeLabel(contentType)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

