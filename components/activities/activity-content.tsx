"use client";

import { Activity } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";

interface ActivityContentProps {
  activity: Activity;
}

// Custom components for PortableText (same as article content)
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(800).height(600).url();
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "Activity image"}
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
};

export function ActivityContent({ activity }: ActivityContentProps) {
  return (
    <div className="space-y-8">
      {/* Goals */}
      {activity.goals && activity.goals.length > 0 && (
        <div className="bg-accent-green/10 border-l-4 border-accent-green rounded-r-lg p-6">
          <h3 className="text-lg font-semibold text-text-dark mb-3">Στόχοι</h3>
          <ul className="space-y-2">
            {activity.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-text-dark">
                <span className="text-accent-green mt-1">✓</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Materials */}
      {activity.materials && activity.materials.length > 0 && (
        <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <h3 className="text-lg font-semibold text-text-dark mb-3">Υλικά</h3>
          <ul className="space-y-2">
            {activity.materials.map((material, idx) => (
              <li key={idx} className="flex items-start gap-2 text-text-dark">
                <span className="text-primary-pink mt-1">•</span>
                <span>{material}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps / Instructions */}
      {activity.steps && (
        <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <h3 className="text-2xl font-bold text-text-dark mb-4">Οδηγίες</h3>
          <div className="prose prose-lg max-w-none">
            <PortableText
              value={activity.steps as PortableTextBlock[]}
              components={portableTextComponents}
            />
          </div>
        </div>
      )}

      {/* Safety Notes */}
      {activity.safetyNotes && (
        <div className="bg-secondary-blue/10 border-l-4 border-secondary-blue rounded-r-lg p-6">
          <h3 className="text-lg font-semibold text-text-dark mb-2 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Σημειώσεις Ασφάλειας
          </h3>
          <p className="text-text-dark">{activity.safetyNotes}</p>
        </div>
      )}
    </div>
  );
}

