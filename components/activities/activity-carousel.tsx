"use client";

import { useState } from "react";
import Image from "next/image";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { DRASTIRIOTITES_CONSTANTS } from "@/lib/constants/drastiriotites";

interface CarouselImage {
  asset?: unknown;
  alt?: string;
  caption?: string;
}

interface ActivityCarouselProps {
  images: CarouselImage[];
  title?: string;
}

export function ActivityCarousel({ images, title }: ActivityCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];
  const currentImageUrl = generateImageUrl(
    currentImage?.asset,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.width,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.height
  );

  if (!currentImageUrl) return null;

  return (
    <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
      {title && (
        <h3 className="text-2xl font-bold text-text-dark mb-6">{title}</h3>
      )}
      
      <div className="relative">
        {/* Main Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background-light mb-4">
          <Image
            src={currentImageUrl}
            alt={currentImage?.alt || `Image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-dark p-2 rounded-full shadow-lg transition-all z-10"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-dark p-2 rounded-full shadow-lg transition-all z-10"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {currentImage?.caption && (
          <p className="text-sm text-text-medium text-center mb-4">
            {currentImage.caption}
          </p>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto pb-2">
            {images.map((image, index) => {
              const thumbUrl = generateImageUrl(
                image?.asset,
                100,
                100
              );
              if (!thumbUrl) return null;
              
              return (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary-pink shadow-md scale-105"
                      : "border-border/30 hover:border-border/60 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={thumbUrl}
                    alt={image?.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-center text-sm text-text-medium mt-2">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

