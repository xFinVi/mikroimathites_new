import { RelatedContentItem } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import Link from "next/link";

interface RelatedArticlesProps {
  relatedContent: RelatedContentItem[];
}

function getContentUrl(item: RelatedContentItem): string {
  switch (item._type) {
    case "article":
      return `/gia-goneis/${item.slug}`;
    case "activity":
      return `/drastiriotites/${item.slug}`;
    case "printable":
      return `/drastiriotites/printables/${item.slug}`;
    case "recipe":
      return `/gia-goneis/recipes/${item.slug}`;
    default:
      return "#";
  }
}

function getContentTypeLabel(type: string): string {
  switch (type) {
    case "article":
      return "Άρθρο";
    case "activity":
      return "Δραστηριότητα";
    case "printable":
      return "Εκτυπώσιμο";
    case "recipe":
      return "Συνταγή";
    default:
      return "Περιεχόμενο";
  }
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
          const imageUrl = item.coverImage
            ? urlFor(item.coverImage).width(400).height(250).url()
            : null;

          return (
            <Link
              key={item._id}
              href={getContentUrl(item)}
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
                  {getContentTypeLabel(item._type)}
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

