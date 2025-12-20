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
      const imageUrl = urlFor(value).width(800).height(600).url();
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "Article image"}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-text-medium text-center mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: any }) => {
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
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-3xl font-bold text-text-dark mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-2xl font-bold text-text-dark mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-xl font-semibold text-text-dark mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary-pink pl-4 py-2 my-4 italic text-text-medium bg-background-white rounded-r-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-text-dark leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-text-dark">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-text-dark">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="ml-4">{children}</li>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <li className="ml-4">{children}</li>
    ),
  },
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content">
      <PortableText value={content as PortableTextBlock[]} components={portableTextComponents} />
    </div>
  );
}

