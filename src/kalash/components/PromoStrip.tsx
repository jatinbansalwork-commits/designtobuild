"use client";

import {
  PROMO_BADGE_WIDTH_PX,
  PromoExclusiveBadge,
} from "@/kalash/components/PromoExclusiveBadge";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const PROMO_LETTER_SPACING = "0.2px";
const PROMO_GOLD = "#9A6700";

function PromoPhrase() {
  const copy = UI_COPY.promo.exclusivePromo;
  const highlight = "3% extra gold";
  const highlightIndex = copy.indexOf(highlight);

  if (highlightIndex === -1) {
    return <>{copy}</>;
  }

  const prefix = copy.slice(0, highlightIndex).trimEnd();

  return (
    <>
      {prefix}
      {" "}
      <span className="font-semibold" style={{ color: PROMO_GOLD }}>
        {highlight}
      </span>
      {copy.slice(highlightIndex + highlight.length)}
    </>
  );
}

const MARQUEE_SEGMENTS_PER_HALF = 4;

const MARQUEE_TEXT_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap text-[14px] font-medium leading-[20px]";

function PromoMarqueeSeparator() {
  return (
    <span
      className="inline-flex shrink-0 px-3 text-[12px] font-bold leading-none"
      style={{ color: PROMO_GOLD }}
      aria-hidden
    >
      •
    </span>
  );
}

function PromoMarqueeSegment() {
  return (
    <>
      <PromoPhrase />
      <PromoMarqueeSeparator />
    </>
  );
}

function PromoMarqueeHalf() {
  const { color, type } = KALASH_VIEW;

  return (
    <span
      className={MARQUEE_TEXT_CLASS}
      style={{
        letterSpacing: PROMO_LETTER_SPACING,
        color: color.text,
        fontFamily: type.body,
      }}
    >
      {Array.from({ length: MARQUEE_SEGMENTS_PER_HALF }, (_, index) => (
        <PromoMarqueeSegment key={index} />
      ))}
    </span>
  );
}

function PromoMarqueeTrack() {
  return (
    <div className="flex w-max animate-promo-marquee will-change-transform">
      <PromoMarqueeHalf />
      <PromoMarqueeHalf aria-hidden />
    </div>
  );
}

/** Fixed kalash Exclusive badge with scrolling promo copy beside it. */
export function PromoStrip() {
  const reducedMotion = useReducedMotion();
  const { color, type } = KALASH_VIEW;

  return (
    <div className="relative flex h-8 w-full overflow-hidden">
      <div
        className="relative z-20 shrink-0"
        style={{ width: PROMO_BADGE_WIDTH_PX }}
      >
        <PromoExclusiveBadge />
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        {reducedMotion ? (
          <div className="flex h-full items-center justify-start pl-1">
            <span
              className="whitespace-nowrap text-[14px] font-medium leading-[20px]"
              style={{
                letterSpacing: PROMO_LETTER_SPACING,
                color: color.text,
                fontFamily: type.body,
              }}
            >
              <PromoPhrase />
            </span>
          </div>
        ) : (
          <div className="flex h-full items-center pl-1">
            <PromoMarqueeTrack />
          </div>
        )}
      </div>
    </div>
  );
}
