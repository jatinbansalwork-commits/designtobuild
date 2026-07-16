"use client";

import { useRef } from "react";
import { DETAIL_POPUP_MEDIA_CLASS } from "@/lib/detail-popup-media";
import { useMediaBackdropColor } from "@/hooks/use-media-backdrop-color";

interface DetailPopupImageProps {
  src: string;
  title: string;
  cover?: boolean;
  fallbackColor?: string;
}

/**
 * Popup image media — fixed 16:9 canvas; blank letterbox/pillarbox is filled
 * with a color auto-sampled from the image edges.
 */
export function DetailPopupImage({
  src,
  title,
  cover = false,
  fallbackColor = "#000000",
}: DetailPopupImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const backdrop = useMediaBackdropColor(imgRef, src, fallbackColor);

  return (
    <div
      className={`relative flex items-center justify-center ${DETAIL_POPUP_MEDIA_CLASS}`}
      style={{ backgroundColor: backdrop }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- need crossOrigin for edge-color sampling */}
      <img
        ref={imgRef}
        src={src}
        alt={title}
        crossOrigin="anonymous"
        className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
        draggable={false}
      />
    </div>
  );
}
