"use client";

import { DETAIL_POPUP_MEDIA_CLASS } from "@/lib/detail-popup-media";

interface DetailPopupImageProps {
  src: string;
  title: string;
  cover?: boolean;
}

/** Popup image media — fixed 16:9 canvas with a black letterbox/pillarbox. */
export function DetailPopupImage({
  src,
  title,
  cover = false,
}: DetailPopupImageProps) {
  return (
    <div
      className={`relative flex items-center justify-center bg-black ${DETAIL_POPUP_MEDIA_CLASS}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- popup media uses native img for object-contain letterboxing */}
      <img
        src={src}
        alt={title}
        className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
        draggable={false}
      />
    </div>
  );
}
