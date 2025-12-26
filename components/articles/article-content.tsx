"use client";

import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";

interface ArticleContentProps {
  content: unknown; // PortableText content
}

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(1200).height(800).quality(85).url();
      return (
        <figure className="my-12 md:my-16">
          <div className="relative w-full aspect-video md:aspect-[16/10] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageUrl}
            alt={value.alt || "Article image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-text-medium text-center mt-4 italic max-w-2xl mx-auto">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: any }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-secondary-blue hover:text-secondary-blue/80 underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-text-dark mt-16 mb-8 first:mt-0 scroll-mt-8 border-b-2 border-primary-pink/20 pb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl md:text-3xl font-bold text-text-dark mt-12 mb-6 scroll-mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl md:text-2xl font-semibold text-text-dark mt-8 mb-4 scroll-mt-8">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary-pink pl-6 pr-4 py-4 my-6 italic text-text-medium bg-gradient-to-r from-primary-pink/5 to-transparent rounded-r-lg shadow-sm">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-6 text-text-dark leading-relaxed max-w-[65ch]">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-outside mb-6 ml-6 space-y-3 text-text-dark marker:text-primary-pink">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-outside mb-6 ml-6 space-y-3 text-text-dark marker:font-bold marker:text-primary-pink">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
  },
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content text-lg leading-relaxed text-text-dark">
      {/* Enhanced styling for long-form content */}
      <style jsx global>{`
        .article-content {
          /* Better readability for long articles */
          font-size: 1.125rem;
          line-height: 1.75;
        }
        
        /* Optimal reading width */
        .article-content p {
          max-width: 65ch;
        }
        
        /* Better spacing for very long articles */
        .article-content h2 + p,
        .article-content h3 + p,
        .article-content h4 + p {
          margin-top: 0.5rem;
        }
        
        /* Visual section breaks for long content */
        .article-content h2 {
          scroll-margin-top: 2rem;
          position: relative;
        }
        
        /* Better list spacing for readability */
        .article-content ul,
        .article-content ol {
          max-width: 60ch;
        }
        
        /* Enhanced blockquote for callouts */
        .article-content blockquote p {
          margin-bottom: 0.5rem;
        }
        
        .article-content blockquote p:last-child {
          margin-bottom: 0;
        }
        
        /* Better image spacing in long articles */
        .article-content img {
          break-inside: avoid;
        }
        
        /* Print-friendly */
        @media print {
          .article-content h2 {
            page-break-after: avoid;
          }
          .article-content img {
            page-break-inside: avoid;
          }
        }
      `}</style>
      <PortableText value={content as PortableTextBlock[]} components={portableTextComponents} />
    </div>
  );
}

