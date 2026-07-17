"use client";

import { useEffect, useRef } from "react";

interface HoverPlayVideoProps {
  src: string;
  title: string;
  className?: string;
}

/** Grid video that stays on its first frame and plays only while hovered. */
export function HoverPlayVideo({ src, title, className }: HoverPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // No hover on touch devices — fall back to autoplay there.
    if (window.matchMedia("(hover: none)").matches) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
      aria-label={title}
      onMouseEnter={(event) => {
        event.currentTarget.play().catch(() => {});
      }}
      onMouseLeave={(event) => {
        event.currentTarget.pause();
      }}
    />
  );
}
