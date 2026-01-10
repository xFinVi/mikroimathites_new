"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VIDEO_CONSTANTS } from "@/lib/constants";

interface VideoSource {
  type: "youtube" | "local";
  url: string; // YouTube video ID or local video path
  title?: string;
  thumbnail?: string; // Optional thumbnail for YouTube
  startTime?: number; // Start time in seconds for YouTube videos
}

interface VideoSneakPeekProps {
  videos: VideoSource[];
  title?: string;
  subtitle?: string;
  youtubeChannelUrl?: string;
}

export function VideoSneakPeek({ 
  videos, 
  title = "Sneak Peek από το κανάλι μας",
  subtitle = "Δείτε τι μπορείτε να δείτε στο YouTube μας",
  youtubeChannelUrl 
}: VideoSneakPeekProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const currentVideo = videos[currentIndex];

  // Auto-advance videos
  useEffect(() => {
    if (!isPlaying || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, VIDEO_CONSTANTS.AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, videos.length]);

  // Handle video play/pause
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Autoplay might fail, that's okay
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [currentIndex, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };



  return (
    <section className="relative w-screen h-screen min-h-[600px] overflow-hidden mt-[8rem] mb-8" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
      {/* Video Container - Full Section */}
      <div 
        className="absolute inset-0 w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Player - Full Screen */}
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
          {currentVideo.type === "youtube" ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.url}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentVideo.url}&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&start=${currentVideo.startTime || 0}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77777778vh] h-[100vh] min-w-full min-h-[56.25vw]"
              style={{
                pointerEvents: "auto",
              }}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={currentVideo.title || "YouTube video"}
            />
          ) : (
            <video
              ref={(el) => {
                videoRefs.current[currentIndex] = el;
              }}
              src={currentVideo.url}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loop
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={() => {
                // Auto-loop: restart current video if only one, or advance if multiple
                if (videos.length > 1) {
                  setCurrentIndex((prev) => (prev + 1) % videos.length);
                } else {
                  // Restart the same video
                  const video = videoRefs.current[currentIndex];
                  if (video) {
                    video.currentTime = 0;
                    video.play();
                  }
                }
              }}
            />
          )}

          {/* Logo Overlay - Center with opacity (Watermark) */}
          <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
            <Image
              src="/images/logo.png"
              alt="Μικροί Μαθητές"
              width={800}
              height={280}
              className="w-[70%] h-auto min-w-[400px] opacity-20"
              priority={false}
            />
          </div>

          {/* Enhanced Overlay Controls - Bing Bunny Style */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-500 z-10 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
                <div className="absolute bottom-0 left-0 right-0">
                  {/* Control Bar */}
                  <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md border-t border-white/10 p-4">
                    <div className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                      {/* Left Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayPause}
                          className="group p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-white/30 shadow-lg"
                          aria-label={isPlaying ? "Παύση βίντεο" : "Αναπαραγωγή βίντεο"}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-white group-hover:text-primary-pink transition-colors" fill="currentColor" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-0.5 group-hover:text-primary-pink transition-colors" fill="currentColor" />
                          )}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="group p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-white/30 shadow-lg"
                          aria-label={isMuted ? "Ενεργοποίηση ήχου" : "Σίγαση ήχου"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-6 h-6 text-white group-hover:text-primary-pink transition-colors" />
                          ) : (
                            <Volume2 className="w-6 h-6 text-white group-hover:text-primary-pink transition-colors" />
                          )}
                        </button>
                        <div className="h-8 w-px bg-white/30" />
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-semibold">
                            {isPlaying ? "▶ Playing" : "⏸ Paused"}
                          </span>
                          <span className="text-white/60 text-xs">
                            {currentVideo.title || `Video ${currentIndex + 1}`}
                          </span>
                        </div>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center gap-3">
                        {currentVideo.type === "youtube" && (
                          <Link
                            href={`https://www.youtube.com/watch?v=${currentVideo.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-blue hover:from-primary-pink/90 hover:to-secondary-blue/90 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
                            aria-label="Δείτε το βίντεο στο YouTube (ανοίγει σε νέο παράθυρο)"
                          >
                            <span>Δείτε στο YouTube</span>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

        </div>

        {/* CTA to YouTube Channel */}
        {youtubeChannelUrl && (
          <div className="absolute bottom-12 left-0 right-0 z-20 text-center px-0">
            <Link
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-pink to-secondary-blue hover:from-primary-pink/90 hover:to-secondary-blue/90 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              aria-label="Επισκεφτείτε το κανάλι μας στο YouTube (ανοίγει σε νέο παράθυρο)"
            >
              <span>Επισκεφτείτε το κανάλι μας</span>
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        )}
    </section>
  );
}

