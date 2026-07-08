"use client";

import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const SAVE_MORE_GRADIENT =
  "linear-gradient(180deg, #1AC4B6 0%, #118D82 46%, #0A6B64 100%)";

interface SaveMoreButtonProps {
  onPress?: () => void;
}

/** Primary Save More CTA — premium pill with depth and shimmer. */
export function SaveMoreButton({ onPress }: SaveMoreButtonProps) {
  const playClick = useClickSound();
  const { radius, type } = KALASH_VIEW;

  function handleClick() {
    playClick();
    onPress?.();
  }

  return (
    <div
      style={{
        paddingTop: KALASH_VIEW.space.sectionY,
        paddingInline: KALASH_VIEW.space.headerGutterX,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        className={`save-more-shimmer relative flex h-14 w-full items-center justify-center overflow-hidden text-white ring-1 ring-[#0A6B64]/25 transition-transform duration-200 active:scale-[0.985] ${FOCUS_RING}`}
          style={{
            background: SAVE_MORE_GRADIENT,
            borderRadius: radius.pill,
            fontFamily: type.body,
          }}
          aria-label={UI_COPY.cta.saveMore}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/16 via-white/[0.03] to-black/12"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE161]/55 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
            aria-hidden
          />

          <span
            className="relative z-10 text-[17px] font-bold leading-[22px]"
            style={{ letterSpacing: type.bodyTracking }}
          >
            {UI_COPY.cta.saveMore}
          </span>
        </button>
    </div>
  );
}
