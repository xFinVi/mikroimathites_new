"use client";

import { useRef, useEffect, useState } from "react";

interface BackgroundVideoSectionProps {
  videoId: string; // YouTube video ID
  startTime?: number; // Start time in seconds (optional)
  children?: React.ReactNode; // Content to overlay on top
  className?: string;
}

export function BackgroundVideoSection({ 
  videoId,
  startTime = 0,
  children,
  className = "" 
}: BackgroundVideoSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className={`relative w-full h-[80vh] overflow-hidden ${className}`}
    >
      {/* YouTube Background Video */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&enablejsapi=1&iv_load_policy=3&start=${startTime}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77777778vh] h-[100vh] min-w-full min-h-[56.25vw]"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          title="Background Video"
          onLoad={() => setIsLoaded(true)}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* Overlay Content */}
      {children && (
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          {children}
        </div>
      )}
    </section>
  );
}

