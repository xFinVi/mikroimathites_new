import { Article } from "@/lib/content";
import { format } from "date-fns";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image-url";
import Link from "next/link";

interface ArticleMetaProps {
  article: Article;
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d MMMM yyyy")
    : null;

  const readingTime = article.readingTime
    ? `${article.readingTime} λεπτά ανάγνωσης`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-medium">
      {article.author && (
        <div className="flex items-center gap-3">
          {article.author.profilePicture && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={urlFor(article.author.profilePicture).width(40).height(40).url()}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <Link
              href={`/authors/${article.author.slug}`}
              className="font-semibold text-text-dark hover:text-primary-pink transition"
            >
              {article.author.name}
            </Link>
          </div>
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

      {readingTime && (
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
          <span>{readingTime}</span>
        </div>
      )}

      {article.ageGroups && article.ageGroups.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {article.ageGroups.map((ageGroup) => (
            <Link
              key={ageGroup._id}
              href={`/gia-goneis?age=${ageGroup.slug}`}
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

