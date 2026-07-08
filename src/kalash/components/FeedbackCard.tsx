"use client";

import { ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const CARD_GRADIENT =
  "linear-gradient(150deg, #F2FBFA 0%, #FFFFFF 46%, #FBFDFF 100%)";
const CARD_GLOW =
  "radial-gradient(circle at 92% 8%, rgba(17, 141, 130, 0.12) 0%, transparent 46%)";
const CTA_GRADIENT =
  "linear-gradient(180deg, #1AC4B6 0%, #118D82 48%, #0A6B64 100%)";

interface FeedbackCardProps {
  onPress?: () => void;
}

/** Feedback prompt — invites users to rate their Kalash experience. */
export function FeedbackCard({ onPress }: FeedbackCardProps) {
  const playClick = useClickSound();
  const { color, type } = KALASH_VIEW;
  const copy = UI_COPY.feedback;

  function handlePress() {
    playClick();
    onPress?.();
  }

  return (
    <div
      style={{
        paddingTop: 0,
        paddingBottom: 24,
        paddingInline: 16,
        fontFamily: type.body,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[20px] p-5 ring-1 ring-teal-950/[0.06]"
        style={{ background: CARD_GRADIENT }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: CARD_GLOW }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80"
          aria-hidden
        />

        <div className="relative z-10 text-center">
          <p
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.2px]"
            style={{ color: color.text, letterSpacing: type.bodyTracking }}
          >
            {copy.title}
          </p>
          <p
            className="mt-0.5 text-[13px] font-medium leading-[18px]"
            style={{ color: color.label, letterSpacing: type.bodyTracking }}
          >
            {copy.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePress}
          className={`relative z-10 mt-4 flex h-11 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full text-[15px] font-bold leading-[20px] text-white ring-1 ring-[#0A6B64]/25 transition-transform duration-200 active:scale-[0.985] ${FOCUS_RING}`}
          style={{ background: CTA_GRADIENT, letterSpacing: type.bodyTracking }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/16 via-white/[0.03] to-black/10"
            aria-hidden
          />
          <span className="relative z-10">{copy.cta}</span>
          <ChevronRight className="relative z-10 size-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}
