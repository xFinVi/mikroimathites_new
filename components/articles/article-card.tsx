import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import { format } from "date-fns";
import { Info, User } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  // Use pre-generated image URL if available (from server), otherwise generate on client
  const imageUrl = (article as any).imageUrl || (article.coverImage
    ? urlFor(article.coverImage).width(400).height(250).url()
    : null);

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d MMM yyyy")
    : null;

  // Fallback image if coverImage is missing
  const hasImage = !!imageUrl;

  // Compact version for featured grid - Bing-style cards with image on top, white text area below
  if (compact) {
    return (
      <Link href={`/gia-goneis/${article.slug}`}>
        <div className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full">
          {/* Image Section */}
          <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
            {hasImage ? (
              <Image
                src={imageUrl!}
                alt={article.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-xs text-text-medium font-medium">No Image</div>
                </div>
              </div>
            )}
          </div>

          {/* White Text Section Below Image */}
          <div className="p-5 bg-white flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
              {article.title}
            </h3>
            
            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-1.5 mt-auto">
                <User className="w-3 h-3 text-text-medium flex-shrink-0" />
                <p className="text-xs text-text-medium">
                  {article.author.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Full version for other pages
  return (
    <Link href={`/gia-goneis/${article.slug}`}>
      <div className="bg-background-white rounded-lg overflow-hidden shadow-sm border border-border/30 hover:shadow-md transition-all duration-300 cursor-pointer group h-full flex flex-col">
        {hasImage ? (
          <div className="relative w-full h-48 bg-background-light overflow-hidden">
            <Image
              src={imageUrl!}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          {article.category && (
            <div className="text-xs font-semibold text-primary-pink uppercase tracking-wide">
              {article.category.title}
            </div>
          )}
          <h3 className="text-lg font-bold text-text-dark line-clamp-2 group-hover:text-primary-pink transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-text-medium text-sm line-clamp-2 flex-1">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center text-xs text-text-light mt-auto">
            {publishedDate && <span>{publishedDate}</span>}
            {article.readingTime && (
              <>
                {publishedDate && <span>•</span>}
                <span>{article.readingTime} λεπτά</span>
              </>
            )}
          </div>
          {article.ageGroups && article.ageGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.ageGroups.map((ageGroup) => (
                <span
                  key={ageGroup._id}
                  className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full text-xs"
                >
                  {ageGroup.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

