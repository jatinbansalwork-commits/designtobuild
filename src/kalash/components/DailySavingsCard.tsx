"use client";

import { ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

/** Swap when final daily savings hero art is ready. */
export const DAILY_SAVINGS_ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/3.svg";

const CARD_HEIGHT = 288;
const CONTENT_HEIGHT = 232;

const DAILY_SURFACE_GRADIENT =
  "linear-gradient(165deg, #FFFDF8 0%, #FFFFFF 48%, #F7FAFB 100%)";
const DAILY_CTA_GRADIENT = "linear-gradient(180deg, #F05252 0%, #DC2626 100%)";
const DAILY_GOLD_PILL_BG = "#FFF8E8";
const DAILY_GOLD_PILL_TEXT = "#9A6700";
const DAILY_GOLD_PILL_RING = "rgba(255, 225, 97, 0.55)";

const BONUS_PILL_CLASS =
  "inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-bold leading-[16px] ring-1";

function DailyBonusChip({
  primaryLabel,
  alternateLabel,
}: {
  primaryLabel: string;
  alternateLabel: string;
}) {
  const reducedMotion = useReducedMotion();
  const pillStyle = {
    backgroundColor: DAILY_GOLD_PILL_BG,
    color: DAILY_GOLD_PILL_TEXT,
    boxShadow: `inset 0 0 0 1px ${DAILY_GOLD_PILL_RING}`,
  };

  if (reducedMotion) {
    return (
      <span className={`${BONUS_PILL_CLASS} shrink-0`} style={pillStyle}>
        {primaryLabel}
      </span>
    );
  }

  return (
    <span
      className="daily-bonus-chip-float relative inline-flex h-6 w-[52px] shrink-0 items-center justify-center"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={`daily-bonus-chip daily-bonus-chip--a ${BONUS_PILL_CLASS} absolute inset-0 justify-center`}
        style={pillStyle}
      >
        {primaryLabel}
      </span>
      <span
        className={`daily-bonus-chip daily-bonus-chip--b ${BONUS_PILL_CLASS} absolute inset-0 justify-center`}
        style={pillStyle}
      >
        {alternateLabel}
      </span>
    </span>
  );
}

interface DailySavingsCardProps {
  onPress?: () => void;
}

/** Daily savings hero card — layered base, illustration, copy, CTA bar. */
export function DailySavingsCard({ onPress }: DailySavingsCardProps) {
  const playClick = useClickSound();
  const { color, type } = KALASH_VIEW;
  const copy = UI_COPY.exploreSavings.daily;

  function handlePress() {
    playClick();
    onPress?.();
  }

  return (
    <button
      type="button"
      onClick={handlePress}
      className={`group flex w-full flex-col overflow-hidden rounded-[24px] text-left shadow-[0_10px_32px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.05] transition-[box-shadow,transform] duration-200 active:scale-[0.995] ${FOCUS_RING}`}
      style={{
        height: CARD_HEIGHT,
        fontFamily: type.body,
      }}
      aria-label={`${copy.headline}. ${copy.subline}. ${copy.cta}`}
    >
      {/* Layer 1 — warm surface */}
      <div
        className="relative shrink-0 overflow-hidden rounded-t-[24px]"
        style={{
          height: CONTENT_HEIGHT,
          background: DAILY_SURFACE_GRADIENT,
        }}
      >
        <div
          className="pointer-events-none absolute -right-6 bottom-0 h-[200px] w-[200px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,225,97,0.16) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Layer 2 — watermark illustration */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex w-[54%] items-end justify-end pb-5 pr-5"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DAILY_SAVINGS_ILLUSTRATION_SRC}
            alt=""
            width={172}
            height={156}
            className="h-[156px] w-auto max-w-full object-contain object-bottom opacity-[0.22]"
            draggable={false}
          />
        </div>

        {/* Layer 3 — copy */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span
                className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.08em]"
                style={{ color: color.label }}
              >
                {copy.eyebrow}
              </span>
              <DailyBonusChip
                primaryLabel={copy.bonusLabel}
                alternateLabel={copy.bonusLabelAlt}
              />
            </div>

            <p
              className="mt-4 max-w-[210px] text-[24px] font-semibold leading-[28px] tracking-[-0.35px]"
              style={{ color: color.primary }}
            >
              {copy.headline}
            </p>
            <p
              className="mt-2 text-[16px] font-semibold leading-[22px]"
              style={{ color: color.text, letterSpacing: type.bodyTracking }}
            >
              {copy.subline}
            </p>
          </div>
        </div>
      </div>

      {/* Layer 4 — CTA bar */}
      <div
        className="relative flex h-14 shrink-0 items-center rounded-b-[24px] pl-6 pr-12"
        style={{
          background: DAILY_CTA_GRADIENT,
          color: color.onPrimary,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20"
          aria-hidden
        />
        <span
          className="inline-flex items-center text-[16px] font-bold leading-[16px]"
          style={{ letterSpacing: type.bodyTracking }}
        >
          {copy.cta}
        </span>
        <span className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/25">
          <ChevronRight className="size-3.5" strokeWidth={2.25} aria-hidden />
        </span>
      </div>
    </button>
  );
}
