"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function Carousel({ slides, autoPlay = true, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full flex-shrink-0"
            >
              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20">
                {/* Abstract Decorative Shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-blue/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-yellow/10 rounded-full blur-xl" />
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-6 md:space-y-8">
                  {slide.badge && (
                    <div className="inline-block px-4 py-2 bg-primary-pink/20 text-primary-pink rounded-full text-sm font-semibold">
                      {slide.badge}
                    </div>
                  )}
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark leading-tight">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl text-text-medium font-medium">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                  {slide.description && (
                    <p className="text-base sm:text-lg md:text-xl text-text-medium max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  )}
                  {(slide.ctaText || slide.secondaryCtaText) && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      {slide.ctaText && (
                        <Button 
                          size="lg" 
                          className="bg-primary-pink hover:bg-primary-pink/90 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-button shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                          asChild={!!slide.ctaLink}
                        >
                          {slide.ctaLink ? (
                            slide.ctaLink.startsWith("http") ? (
                              <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer">
                                {slide.ctaText}
                              </a>
                            ) : (
                              <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                            )
                          ) : (
                            slide.ctaText
                          )}
                        </Button>
                      )}
                      {slide.secondaryCtaText && (
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="border-2 border-secondary-blue bg-white/50 backdrop-blur-sm text-secondary-blue hover:bg-secondary-blue/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-button shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                          asChild={!!slide.secondaryCtaLink}
                        >
                          {slide.secondaryCtaLink ? (
                            slide.secondaryCtaLink.startsWith("http") ? (
                              <a href={slide.secondaryCtaLink} target="_blank" rel="noopener noreferrer">
                                {slide.secondaryCtaText}
                              </a>
                            ) : (
                              <Link href={slide.secondaryCtaLink}>{slide.secondaryCtaText}</Link>
                            )
                          ) : (
                            slide.secondaryCtaText
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-text-dark" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-text-dark" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 sm:h-3 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 sm:w-10 bg-primary-pink"
                : "w-2 sm:w-3 bg-text-light hover:bg-text-medium"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

