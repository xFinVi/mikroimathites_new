"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoHeroSectionProps {
  videoId: string; // YouTube video ID
  startTime?: number; // Start time in seconds (optional)
  title?: string;
  subtitle?: string;
  children?: React.ReactNode; // Content to overlay on top
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export function VideoHeroSection({
  videoId,
  startTime = 0,
  title,
  subtitle,
  children,
  className = "",
  autoPlay = true,
  loop = true,
}: VideoHeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show controls on hover or interaction
  useEffect(() => {
    if (isHovered) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isHovered]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // YouTube iframe API would be needed for actual play/pause control
    // For now, we'll reload the iframe with autoplay parameter
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // YouTube iframe API would be needed for actual mute control
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Update iframe src when play/pause or mute changes
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&enablejsapi=1&iv_load_policy=3&start=${startTime}`;

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-[80vh] min-h-[600px] overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={() => {
        setIsHovered(true);
        setShowControls(true);
      }}
    >
      {/* YouTube Background Video */}
      <div className="absolute inset-0 z-0">
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77777778vh] h-[100vh] min-w-full min-h-[56.25vw] pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          title="Background Video"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      </div>

      {/* Video Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
          showControls || isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all hover:scale-110 border border-white/30"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all hover:scale-110 border border-white/30"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
              <div className="h-8 w-px bg-white/30" />
              <span className="text-white/80 text-sm font-medium">
                {isPlaying ? "Playing" : "Paused"}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all hover:scale-110 border border-white/30"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-6 h-6 text-white" />
                ) : (
                  <Maximize2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          {title && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-2xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>

      {/* Subtle indicator that video is playing (top right corner) */}
      {isPlaying && !showControls && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Live</span>
        </div>
      )}
    </section>
  );
}

