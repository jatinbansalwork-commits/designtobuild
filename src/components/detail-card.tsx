import Link from "next/link";
import type { DetailItem } from "@/lib/details-data";
import { getProjectFilterLabel } from "@/lib/portfolio-filters";
import { ClipPathReveal } from "@/components/clip-path-reveal";
import { DesignOfTheDayBadge } from "@/components/design-of-the-day-badge";
import { DetailMediaPreview } from "@/components/detail-media-preview";
import { ShareDetailButton } from "@/components/share-detail-button";

const GRID_CARD_MEDIA_RATIO = "424 / 396";

export function DetailCard({
  detail,
  uniformHeight = false,
  featured = false,
  activeFilter,
  onFilterSelect,
}: {
  detail: DetailItem;
  uniformHeight?: boolean;
  featured?: boolean;
  activeFilter?: string;
  onFilterSelect?: (filter: string) => void;
}) {
  const filterLabel = getProjectFilterLabel(detail);

  return (
    <Link
      href={`/detail/${detail.slug}`}
      className={`no-underline text-inherit hover:text-inherit ${uniformHeight ? "block h-full" : ""}`}
    >
      <article
        className={`relative w-full cursor-pointer overflow-hidden rounded-none border border-border bg-surface-secondary ${
          uniformHeight ? "flex h-full flex-col" : "inline-block md:max-w-7xl"
        }`}
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
            className={`relative flex flex-col gap-4 px-6 pb-6 pt-5 ${
              uniformHeight ? "min-h-[7.25rem] flex-1" : ""
            }`}
          >
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-medium tracking-tight text-text-primary">
                {detail.title}
              </h3>
              {filterLabel && onFilterSelect ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onFilterSelect(filterLabel);
                  }}
                  className={`text-left text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    activeFilter === filterLabel
                      ? "bg-text-primary px-2.5 py-1 text-surface"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {filterLabel}
                </button>
              ) : (
                <p className="line-clamp-1 text-sm leading-relaxed text-text-secondary">
                  {detail.description ?? "\u00A0"}
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
