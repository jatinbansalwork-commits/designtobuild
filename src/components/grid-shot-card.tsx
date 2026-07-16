"use client";

import Link from "next/link";
import type { DetailItem } from "@/lib/details-data";
import { ClipPathReveal } from "@/components/clip-path-reveal";
import { DetailMediaPreview } from "@/components/detail-media-preview";
import { ShareDetailButton } from "@/components/share-detail-button";

/** Dribbble shot grid — 4:3 thumbnail, 12px radius, title below (no card chrome). */
export const DRIBBBLE_SHOT_ASPECT = "4 / 3";

export function GridShotCard({ detail }: { detail: DetailItem }) {
  return (
    <Link
      href={`/detail/${detail.slug}`}
      className="group block h-full no-underline text-inherit hover:text-inherit"
    >
      <div
        className={`relative w-full overflow-hidden rounded-xl ${
          detail.upcoming ? "bg-[#385980]" : "bg-surface-secondary"
        }`}
        style={{ aspectRatio: DRIBBBLE_SHOT_ASPECT }}
      >
        <ShareDetailButton
          slug={detail.slug}
          title={detail.title}
          className="absolute top-2 right-2 z-20"
        />
        <ClipPathReveal colorKey={detail.slug} className="h-full w-full">
          <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
            <DetailMediaPreview
              media={detail.media}
              title={detail.title}
              aspectRatio={DRIBBBLE_SHOT_ASPECT}
              cover
            />
          </div>
        </ClipPathReveal>
      </div>
      <p className="mt-3 text-[13px] font-medium leading-snug text-text-primary">
        {detail.title}
      </p>
    </Link>
  );
}
