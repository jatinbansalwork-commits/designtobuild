"use client";

import { useEffect, useState, type RefObject } from "react";
import { sampleMediaEdgeColor } from "@/lib/media-backdrop-color";

const DEFAULT_BACKDROP = "#000000";

/**
 * Auto-fills letterbox/pillarbox blank space with a color sampled from the
 * media edges (image/video background).
 */
export function useMediaBackdropColor(
  mediaRef: RefObject<HTMLImageElement | HTMLVideoElement | null>,
  src: string,
  fallback: string = DEFAULT_BACKDROP,
): string {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    setColor(fallback);
    const media = mediaRef.current;
    if (!media) return;

    let cancelled = false;

    const sample = () => {
      if (cancelled) return;
      const next = sampleMediaEdgeColor(media);
      if (next) setColor(next);
    };

    const onReady = () => {
      requestAnimationFrame(sample);
    };

    if (media instanceof HTMLVideoElement) {
      if (media.readyState >= 2) onReady();
      media.addEventListener("loadeddata", onReady);
      media.addEventListener("seeked", onReady);
      return () => {
        cancelled = true;
        media.removeEventListener("loadeddata", onReady);
        media.removeEventListener("seeked", onReady);
      };
    }

    if (media.complete && media.naturalWidth > 0) onReady();
    media.addEventListener("load", onReady);
    return () => {
      cancelled = true;
      media.removeEventListener("load", onReady);
    };
  }, [mediaRef, src, fallback]);

  return color;
}
