"use client";

import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/content";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null; // Don't render if no testimonials
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-pink/5 via-background-white to-secondary-blue/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Τι λένε οι γονείς
          </h2>
          <p className="text-lg text-text-medium max-w-2xl mx-auto">
            Οι γονείς που χρησιμοποιούν τον ιστότοπό μας μοιράζονται τις εμπειρίες τους
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 hover:shadow-lg transition-shadow"
            >
              {/* Rating Stars */}
              {testimonial.rating && (
                <div className="flex items-center gap-1 mb-4" aria-label={`Αξιολόγηση ${testimonial.rating} από 5 αστέρια`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating!
                          ? "fill-accent-yellow text-accent-yellow"
                          : "fill-gray-200 text-gray-200"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-text-dark mb-4 text-base leading-relaxed italic">
                <p>
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div>
                  <p className="font-semibold text-text-dark">
                    {testimonial.authorName}
                  </p>
                  {testimonial.childAge && (
                    <p className="text-sm text-text-medium">
                      Παιδί {testimonial.childAge} ετών
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
