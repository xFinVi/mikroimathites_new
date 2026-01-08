"use client";

import { PortableText } from "@portabletext/react";
import { generateImageUrl } from "@/lib/sanity/image-url";
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
      
      // Use generateImageUrl for reliable image rendering
      const imageUrl = generateImageUrl(value, 1200, 800);
      if (!imageUrl) return null;
      
      return (
        <figure className="my-8 md:my-12">
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt={value.alt || "Article image"}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              sizes="100vw"
              quality={90}
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm md:text-base text-text-medium text-center mt-4 italic max-w-3xl mx-auto px-4">
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
          className="text-secondary-blue hover:text-secondary-blue/80 underline decoration-2 underline-offset-2 transition-colors font-medium"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-text-dark">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark mt-20 mb-6 first:mt-0 scroll-mt-8 relative">
        <span className="absolute -left-4 md:-left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-pink to-accent-yellow rounded-full opacity-60"></span>
        <span className="relative pl-6 md:pl-8">{children}</span>
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-dark mt-16 mb-5 scroll-mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-text-dark mt-12 mb-4 scroll-mt-8">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary-pink pl-6 pr-4 py-6 my-8 italic text-text-medium bg-gradient-to-r from-primary-pink/10 via-primary-pink/5 to-transparent rounded-r-xl shadow-sm relative">
        <div className="absolute top-4 left-4 text-4xl opacity-20">"</div>
        <div className="relative z-10">{children}</div>
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-7 text-text-dark leading-relaxed text-lg md:text-xl max-w-[70ch]">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-none mb-8 space-y-4 text-text-dark">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-none mb-8 space-y-4 text-text-dark counter-reset-[list-counter]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-8 relative leading-relaxed text-lg md:text-xl before:absolute before:left-0 before:top-0.5 before:w-2 before:h-2 before:bg-primary-pink before:rounded-full before:mt-3">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-8 relative leading-relaxed text-lg md:text-xl before:absolute before:left-0 before:top-0 before:text-primary-pink before:font-bold before:text-xl before:content-[counter(list-counter)] before:counter-increment-[list-counter] before:mt-1">
        {children}
      </li>
    ),
  },
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content">
      {/* Professional blog styling */}
      <style jsx global>{`
        .article-content {
          /* Optimal reading experience */
          font-size: 1.125rem;
          line-height: 1.85;
          color: #1a1a1a;
        }
        
        /* Professional typography */
        .article-content p {
          max-width: 70ch;
          margin-bottom: 1.75rem;
          font-size: 1.125rem;
          line-height: 1.85;
        }
        
        /* Better heading hierarchy */
        .article-content h2 {
          scroll-margin-top: 3rem;
          position: relative;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        
        .article-content h2:first-child {
          margin-top: 0;
        }
        
        .article-content h3 {
          scroll-margin-top: 2.5rem;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        
        .article-content h4 {
          scroll-margin-top: 2rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        
        /* Enhanced spacing after headings */
        .article-content h2 + p,
        .article-content h3 + p,
        .article-content h4 + p {
          margin-top: 0.75rem;
        }
        
        /* Professional list styling */
        .article-content ul,
        .article-content ol {
          max-width: 65ch;
          margin-left: 0;
        }
        
        .article-content ul li,
        .article-content ol li {
          margin-bottom: 1rem;
        }
        
        /* Enhanced blockquote */
        .article-content blockquote {
          margin: 2rem 0;
          padding: 1.5rem 1.5rem 1.5rem 2rem;
          font-size: 1.125rem;
          line-height: 1.75;
        }
        
        .article-content blockquote p {
          margin-bottom: 0.75rem;
          max-width: 100%;
        }
        
        .article-content blockquote p:last-child {
          margin-bottom: 0;
        }
        
        /* Better image presentation */
        .article-content figure {
          margin: 3rem 0;
          break-inside: avoid;
        }
        
        /* Link styling */
        .article-content a {
          transition: all 0.2s ease;
        }
        
        .article-content a:hover {
          text-decoration-thickness: 3px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .article-content {
            font-size: 1rem;
            line-height: 1.75;
          }
          
          .article-content p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .article-content h2 {
            font-size: 1.875rem;
            margin-top: 3rem;
          }
          
          .article-content h3 {
            font-size: 1.5rem;
            margin-top: 2.5rem;
          }
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
