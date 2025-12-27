import { RelatedContentItem } from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { getContentUrl, type ContentType, getContentTypeLabel } from "@/lib/utils/content";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

interface RelatedArticlesProps {
  relatedContent: RelatedContentItem[];
}

export function RelatedArticles({ relatedContent }: RelatedArticlesProps) {
  if (!relatedContent || relatedContent.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border/50 pt-8 mt-8">
      <h3 className="text-2xl font-bold text-text-dark mb-6">Σχετικό περιεχόμενο</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedContent.map((item) => {
          // Type guard to safely convert _type to ContentType
          const getContentType = (type: string): ContentType => {
            if (type === "article") return "article";
            if (type === "recipe") return "recipe";
            if (type === "activity") return "activity";
            if (type === "printable") return "printable";
            return "article"; // Default fallback
          };
          const contentType = getContentType(item._type);
          const imageUrl = generateImageUrl(
            item.coverImage,
            GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.width,
            GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.height
          );

          return (
            <Link
              key={item._id}
              href={getContentUrl(contentType, item.slug)}
              className="group bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-md transition-all"
            >
              {imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="text-xs font-semibold text-primary-pink mb-2">
                  {getContentTypeLabel(contentType)}
                </div>
                <h4 className="text-lg font-semibold text-text-dark group-hover:text-primary-pink transition mb-2">
                  {item.title}
                </h4>
                {item.excerpt && (
                  <p className="text-sm text-text-medium line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

