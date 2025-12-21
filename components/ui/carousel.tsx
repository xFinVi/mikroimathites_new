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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

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

  // Get gradient theme based on slide index
  const getGradientTheme = (index: number) => {
    const themes = [
      "from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20",
      "from-secondary-blue/20 via-accent-green/20 to-primary-pink/20",
      "from-accent-yellow/20 via-primary-pink/20 to-secondary-blue/20",
      "from-accent-green/20 via-secondary-blue/20 to-accent-yellow/20",
      "from-primary-pink/20 via-accent-yellow/20 to-accent-green/20",
    ];
    return themes[index % themes.length];
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative overflow-hidden w-full rounded-2xl h-[550px] sm:h-[600px] md:h-[650px]">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="min-w-full flex-shrink-0 w-full h-full"
            >
              {/* Gradient Background */}
              <div className={`relative bg-gradient-to-br ${getGradientTheme(index)} p-1 rounded-2xl overflow-hidden h-full`}>
                {/* Glassmorphism Card */}
                <div className="relative bg-white/85 backdrop-blur-2xl p-8 sm:p-10 md:p-14 lg:p-16 w-full h-full box-border overflow-hidden flex flex-col rounded-2xl shadow-2xl border border-white/60">
                  {/* Enhanced Decorative Shapes */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-pink/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-blue/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-yellow/20 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
                  <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-accent-green/20 rounded-full blur-xl pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }} />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center space-y-6 md:space-y-8 w-full flex-1 flex flex-col justify-center">
                    {slide.badge && (
                      <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-pink/30 to-secondary-blue/30 backdrop-blur-sm text-primary-pink rounded-full text-sm font-bold shadow-lg border border-white/50">
                        {slide.badge}
                      </div>
                    )}
                    <div className="space-y-4 w-full">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark leading-tight break-words drop-shadow-sm">
                        {slide.title}
                      </h2>
                      {slide.subtitle && (
                        <p className="text-lg sm:text-xl md:text-2xl text-text-medium font-semibold break-words">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                    {slide.description && (
                      <p className="text-base sm:text-lg md:text-xl text-text-medium max-w-2xl mx-auto break-words px-4 leading-relaxed">
                        {slide.description}
                      </p>
                    )}
                    {(slide.ctaText || slide.secondaryCtaText) && (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4">
                        {slide.ctaText && (
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-button shadow-2xl hover:shadow-primary-pink/50 transition-all transform hover:scale-105 font-semibold"
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
                            className="border-2 border-secondary-blue bg-white/80 backdrop-blur-sm text-secondary-blue hover:bg-secondary-blue/10 hover:border-secondary-blue/80 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-button shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
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
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/90 backdrop-blur-md shadow-2xl hover:bg-white transition-all hover:scale-110 border border-white/50 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-text-dark group-hover:text-primary-pink transition-colors" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-white/90 backdrop-blur-md shadow-2xl hover:bg-white transition-all hover:scale-110 border border-white/50 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-text-dark group-hover:text-primary-pink transition-colors" />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "rounded-full transition-all duration-500 ease-out",
              index === currentIndex
                ? "w-10 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-primary-pink to-secondary-blue shadow-lg shadow-primary-pink/50"
                : "w-3 sm:w-4 h-3 sm:h-4 bg-text-light/60 hover:bg-text-medium/80 hover:scale-110"
            )}
            aria-label={`Go to slide ${index + 1} of ${slides.length}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}

