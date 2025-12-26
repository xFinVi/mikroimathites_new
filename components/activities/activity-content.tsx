"use client";

import { Activity, ActivityStep } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { DRASTIRIOTITES_CONSTANTS } from "@/lib/constants/drastiriotites";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { useEffect } from "react";
import { ActivityCarousel } from "./activity-carousel";

interface ActivityContentProps {
  activity: Activity;
  secondaryImageUrl?: string | null;
}

/**
 * Type guard to check if steps are in the new structured format
 */
function isStructuredStep(step: unknown): step is ActivityStep {
  if (!step || typeof step !== "object") return false;
  const stepObj = step as { _type?: string };
  return stepObj._type === "activityStep";
}

/**
 * Type guard to check if steps array contains structured steps
 * Returns false if steps is not an array or is empty
 */
function hasStructuredSteps(steps: unknown): steps is ActivityStep[] {
  if (!Array.isArray(steps) || steps.length === 0) return false;
  
  // Check if first item is a structured step
  // If it is, assume all are structured
  return isStructuredStep(steps[0]);
}

// Custom components for PortableText (same as article content)
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      const imageUrl = generateImageUrl(
        value,
        DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.width,
        DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.height
      );
      if (!imageUrl) return null;
      return (
        <div className="my-6 sm:my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background-light">
            <Image
              src={imageUrl}
              alt={value.alt || "Activity image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-sm text-text-medium text-center mt-3">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: any }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href || "#"}
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

/**
 * Renders a single structured step with optional image
 */
function StructuredStepCard({ step, stepNumber }: { step: ActivityStep; stepNumber: number }) {
  const stepImageUrl = generateImageUrl(
    step.image,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.width,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.height
  );

  return (
    <div className="bg-background-white rounded-lg border border-border/50 p-6 space-y-4">
      {/* Step Header */}
      <div className="flex items-start gap-4">
        {/* Step Number Badge */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-pink/10 text-primary-pink font-bold text-lg flex items-center justify-center border-2 border-primary-pink/20">
          {stepNumber}
        </div>
        
        {/* Step Title */}
        {step.title && (
          <h4 className="text-xl font-semibold text-text-dark pt-1.5">
            {String(step.title)}
          </h4>
        )}
      </div>

      {/* Step Image - Display above content if available */}
      {stepImageUrl && (
        <div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background-light border border-border/30">
            <Image
              src={stepImageUrl}
              alt={(step.image as { alt?: string })?.alt || (step.title ? String(step.title) : `Step ${stepNumber} image`)}
              fill
              className="object-cover"
            />
          </div>
          {(step.image as { caption?: string })?.caption && (
            <p className="text-sm text-text-medium text-center mt-3 px-2">
              {(step.image as { caption?: string }).caption}
            </p>
          )}
        </div>
      )}

      {/* Step Content */}
      {(() => {
        const content = step.content;
        if (!content) return null;
        
        // Check if content is an array (PortableText format)
        if (Array.isArray(content) && content.length > 0) {
          return (
            <div className="prose prose-lg max-w-none">
              <PortableText
                value={content as PortableTextBlock[]}
                components={portableTextComponents as any}
              />
            </div>
          );
        }
        
        // Debug in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Step content is not in expected format:', {
            step,
            content,
            contentType: typeof content,
            isArray: Array.isArray(content),
          });
        }
        
        return null;
      })()}
    </div>
  );
}

export function ActivityContent({ activity, secondaryImageUrl }: ActivityContentProps) {
  const hasSidebar = (activity.goals && activity.goals.length > 0) || (activity.materials && activity.materials.length > 0);
  const isStructured = activity.steps && hasStructuredSteps(activity.steps);
  const structuredSteps = isStructured ? (activity.steps as ActivityStep[]) : null;
  
  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && activity.steps) {
      console.log('Activity Steps Data:', {
        isStructured,
        steps: activity.steps,
        firstStep: Array.isArray(activity.steps) ? activity.steps[0] : null,
        firstStepContent: Array.isArray(activity.steps) && activity.steps[0] ? (activity.steps[0] as any).content : null,
      });
    }
  }, [activity.steps, isStructured]);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Instructions */}
        <div className={`${hasSidebar ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {activity.steps && (Array.isArray(activity.steps) ? activity.steps.length > 0 : Boolean(activity.steps)) ? (
            <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
              <h3 className="text-2xl font-bold text-text-dark mb-6">Οδηγίες</h3>
              
              {/* Secondary Image - Display before instructions if available (only for legacy format) */}
              {secondaryImageUrl && !isStructured && (
                <div className="mb-6">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background-light">
                    <Image
                      src={secondaryImageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Render structured steps */}
              {isStructured && structuredSteps ? (
                <div className="space-y-6">
                  {structuredSteps.map((step, index) => (
                    <StructuredStepCard
                      key={step._key || `step-${index}`}
                      step={step}
                      stepNumber={index + 1}
                    />
                  ))}
                </div>
              ) : (
                /* Legacy PortableText format */
                <div className="prose prose-lg max-w-none">
                  <PortableText
                    value={activity.steps as PortableTextBlock[]}
                    components={portableTextComponents as any}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Sidebar - Goals & Materials */}
        {hasSidebar && (
          <div className="lg:col-span-1 space-y-6">
            {/* Goals */}
            {activity.goals && activity.goals.length > 0 && (
              <div className="bg-accent-green/10 border-l-4 border-accent-green rounded-r-lg p-5 sticky top-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Στόχοι</h3>
                <ul className="space-y-2">
                  {activity.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-text-dark">
                      <span className="text-accent-green mt-1 flex-shrink-0">✓</span>
                      <span className="text-sm leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials */}
            {activity.materials && activity.materials.length > 0 && (
              <div className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 sticky top-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Υλικά</h3>
                <ul className="space-y-2">
                  {activity.materials.map((material, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-text-dark">
                      <span className="text-primary-pink mt-1 flex-shrink-0">•</span>
                      <span className="text-sm leading-relaxed">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Notes - Full Width Below */}
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

      {/* Image Carousel - Full Width Below */}
      {activity.enableCarousel && activity.carouselImages && activity.carouselImages.length >= 3 && (
        <ActivityCarousel
          images={activity.carouselImages}
          title="Περισσότερες Φωτογραφίες"
        />
      )}
    </div>
  );
}

