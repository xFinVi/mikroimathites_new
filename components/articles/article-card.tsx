import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(400).height(250).url()
    : null;

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d MMM yyyy")
    : null;

  return (
    <Link href={`/gia-goneis/${article.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {imageUrl && (
          <div className="relative w-full h-48 bg-background-light">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardContent className="p-5 space-y-3">
          {article.category && (
            <div className="text-xs font-semibold text-primary-pink">
              {article.category.title}
            </div>
          )}
          <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-text-medium text-sm line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center text-xs text-text-light">
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
        </CardContent>
      </Card>
    </Link>
  );
}

