"use client";

import Link from "next/link";
import type { DetailItem } from "@/lib/details-data";
import { ClipPathReveal } from "@/components/clip-path-reveal";
import { DesignOfTheDayBadge } from "@/components/design-of-the-day-badge";
import { DetailMediaPreview } from "@/components/detail-media-preview";
import { ShareDetailButton } from "@/components/share-detail-button";

const GRID_CARD_MEDIA_RATIO = "424 / 396";

export function DetailCard({
  detail,
  uniformHeight = false,
  featured = false,
}: {
  detail: DetailItem;
  uniformHeight?: boolean;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/detail/${detail.slug}`}
      className={`no-underline text-inherit hover:text-inherit ${uniformHeight ? "block h-full" : ""}`}
    >
      <article
        className={`relative w-full cursor-pointer overflow-hidden border border-border bg-surface-secondary ${
          featured ? "rounded-xl" : "rounded-none"
        } ${uniformHeight ? "flex h-full flex-col" : "inline-block md:max-w-7xl"}`}
      >
        <div className={`flex w-full flex-col ${uniformHeight ? "h-full" : ""}`}>
          <div className="relative">
            {featured ? <DesignOfTheDayBadge /> : null}
            <ShareDetailButton
              slug={detail.slug}
              title={detail.title}
              className={`absolute z-20 ${featured ? "top-2 left-2 sm:top-3 sm:left-3" : "top-2 right-2"}`}
            />
            <ClipPathReveal colorKey={detail.slug}>
              <DetailMediaPreview
                media={detail.media}
                title={detail.title}
                aspectRatio={uniformHeight ? GRID_CARD_MEDIA_RATIO : undefined}
                cover={uniformHeight || featured}
              />
            </ClipPathReveal>
          </div>
          <div
            className={`relative flex flex-col px-6 ${
              uniformHeight ? "flex-1 justify-center py-5" : "gap-4 pb-6 pt-5"
            }`}
          >
            <div className="relative z-10">
              <h3
                className={`font-medium tracking-tight text-text-primary ${
                  uniformHeight ? "text-lg" : "text-xl"
                }`}
              >
                {detail.title}
              </h3>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
