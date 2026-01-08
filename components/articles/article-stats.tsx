"use client";

import { calculateArticleStats, formatWordCount, estimateReadingTime } from "@/lib/utils/content";
import type { Article } from "@/lib/content";

interface ArticleStatsProps {
  article: Article;
}

export function ArticleStats({ article }: ArticleStatsProps) {
  if (!article.body) return null;

  const stats = calculateArticleStats(article.body, !!article.coverImage);
  const estimatedReadingTime = estimateReadingTime(stats.wordCount);
  const actualReadingTime = article.readingTime || estimatedReadingTime;

  return (
    <div className="bg-gradient-to-br from-primary-pink/5 to-secondary-blue/5 rounded-xl p-6 border border-primary-pink/10 mb-8">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {/* Word Count */}
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="font-semibold text-text-dark">{formatWordCount(stats.wordCount)}</span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-secondary-blue"
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
          <span className="font-semibold text-text-dark">
            ~{actualReadingTime} {actualReadingTime === 1 ? "λεπτό" : "λεπτά"} ανάγνωσης
          </span>
        </div>

        {/* Image Count */}
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-semibold text-text-dark">
            {stats.totalImages} {stats.totalImages === 1 ? "εικόνα" : "εικόνες"}
            {stats.imageCount > 0 && (
              <span className="text-text-medium font-normal ml-1">
                ({stats.imageCount} στο περιεχόμενο)
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

