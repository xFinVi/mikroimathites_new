import Link from "next/link";
import { Tag } from "lucide-react";

interface ArticleTag {
  title: string;
  slug: string;
}

interface ArticleTagsProps {
  tags: ArticleTag[];
  currentTag?: string | null;
}

/**
 * ArticleTags component
 * Displays article tags as clickable pills
 * 
 * Features:
 * - Links to /gia-goneis?tag={slug} (resets all other filters)
 * - Shows "Clear filter" option when a tag is active
 * - Uses canonical slugs from Sanity
 */
export function ArticleTags({ tags, currentTag }: ArticleTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 text-text-medium text-sm font-medium">
        <Tag className="w-4 h-4" />
        <span>Ετικέτες:</span>
      </div>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/gia-goneis?tag=${tag.slug}`}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentTag === tag.slug
              ? "bg-primary-pink text-white shadow-md"
              : "bg-gray-100 text-text-dark hover:bg-primary-pink/10 hover:text-primary-pink hover:shadow-sm"
          }`}
        >
          {tag.title}
        </Link>
      ))}
      {currentTag && (
        <Link
          href="/gia-goneis"
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-text-dark hover:bg-gray-300 transition-all"
        >
          ✕ Καθαρισμός
        </Link>
      )}
    </div>
  );
}


