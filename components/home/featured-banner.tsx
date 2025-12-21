"use client";

import Image from "next/image";
import Link from "next/link";
import { FeaturedBanner } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Play } from "lucide-react";

interface FeaturedBannerProps {
  banner: FeaturedBanner & { imageUrl?: string | null };
}

export function FeaturedBanner({ banner }: FeaturedBannerProps) {
  if (!banner.enabled || !banner.title) {
    return null;
  }

  const bgColor = banner.backgroundColor === "custom" 
    ? banner.customBackgroundColor || "#1a1f3a"
    : banner.backgroundColor || "#1a1f3a";

  // Use pre-generated image URL from server (no client-side generation)
  let imageUrl: string | null = banner.imageUrl || null;
  let videoUrl: string | null = null;
  let contentHref: string | null = null;

  if (banner.type === "youtube" && banner.youtubeVideo?.videoId) {
    // YouTube thumbnail - use pre-generated URL or fallback to YouTube CDN
    if (!imageUrl) {
      imageUrl = `https://img.youtube.com/vi/${banner.youtubeVideo.videoId}/maxresdefault.jpg`;
    }
    videoUrl = `https://www.youtube.com/watch?v=${banner.youtubeVideo.videoId}`;
  } else if (banner.type === "article" && banner.contentRef) {
    contentHref = `/gia-goneis/${banner.contentRef.slug}`;
  } else if (banner.type === "activity" && banner.contentRef) {
    contentHref = `/drastiriotites/${banner.contentRef.slug}`;
  } else if (banner.type === "recipe" && banner.contentRef) {
    contentHref = `/gia-goneis/recipes/${banner.contentRef.slug}`;
  }

  const primaryCtaLink = banner.primaryCta?.link || contentHref || videoUrl || "#";
  const secondaryCtaLink = banner.secondaryCta?.link || "#";

  return (
    <section 
      className="relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-6 z-10">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-xl sm:text-2xl text-white/90 mb-4">
                  {banner.subtitle}
                </p>
              )}
              {banner.description && (
                <p className="text-lg text-white/80 leading-relaxed">
                  {banner.description}
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {banner.primaryCta?.text && (
                <Link
                  href={primaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1a1f3a] hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  target={primaryCtaLink.startsWith("http") ? "_blank" : undefined}
                  rel={primaryCtaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {banner.type === "youtube" && (
                    <Play className="w-5 h-5" fill="currentColor" />
                  )}
                  {banner.primaryCta.text}
                </Link>
              )}
              {banner.secondaryCta?.text && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all border-2 border-white/30"
                  target={secondaryCtaLink.startsWith("http") ? "_blank" : undefined}
                  rel={secondaryCtaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {banner.secondaryCta.text}
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Image/Video */}
          <div className="relative">
            {imageUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
                {banner.type === "youtube" ? (
                  <Link
                    href={videoUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full h-full"
                  >
                    <Image
                      src={imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-10 h-10 text-[#1a1f3a] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </Link>
                ) : contentHref ? (
                  <Link href={contentHref} className="block w-full h-full group">
                    <Image
                      src={imageUrl}
                      alt={banner.contentRef?.title || banner.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                ) : (
                  <Image
                    src={imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-white/60">No image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}


