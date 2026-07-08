"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import {
  DailyStreakTracker,
  STREAK_BTC_ICON_SRC,
} from "@/kalash/components/daily-streak-tracker";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const CARD_STREAK_CIRCLE_SIZE_PX = 38;
const CARD_SURFACE_GRADIENT =
  "linear-gradient(165deg, #FFFCF8 0%, #FFFFFF 46%, #F4FBFA 100%)";
const STREAK_CTA_GRADIENT =
  "linear-gradient(180deg, #1AC4B6 0%, #118D82 46%, #0A6B64 100%)";
const MISSED_CORAL = "#FF5630";
const MISSED_CHIP_BG = "#FFF0EB";
const MISSED_CHIP_RING = "rgba(255, 86, 48, 0.22)";

const DAY_LABELS = UI_COPY.weekday;
const MISSED_DAY = 3;
const NEXT_REWARD_DAY = MISSED_DAY + 1;

interface SavingStreakCardProps {
  onStartSavingPress?: () => void;
}

/** Weekly saving streak card — missed-day state with CTA. */
export function SavingStreakCard({ onStartSavingPress }: SavingStreakCardProps) {
  const playClick = useClickSound();
  const { color, space, radius, type } = KALASH_VIEW;
  const copy = UI_COPY.streak;

  function handleStartSaving() {
    playClick();
    onStartSavingPress?.();
  }

  return (
    <div
      style={{
        paddingTop: 20,
        paddingBottom: space.sectionY,
        paddingInline: space.headerGutterX,
        fontFamily: type.body,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[18px] ring-1 ring-teal-950/[0.05]"
        style={{ background: CARD_SURFACE_GRADIENT }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 86, 48, 0.07) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
          aria-hidden
        />

        <div className="relative px-4 pb-4 pt-4">
          <div
            className="relative overflow-hidden rounded-[16px] ring-1 ring-teal-950/[0.05]"
            style={{
              background:
                "linear-gradient(165deg, #F3FBFA 0%, #F8FAFB 52%, #FFFFFF 100%)",
            }}
          >
            <div className="relative px-2.5 pb-3.5 pt-3">
              <DailyStreakTracker
                circleSizePx={CARD_STREAK_CIRCLE_SIZE_PX}
                distribute
                showDayNumbers={false}
                renderDayLabel={(dayNumber) => DAY_LABELS[dayNumber - 1]}
              />
            </div>

            <div className="border-t border-teal-950/[0.06] px-3 pb-4 pt-3.5">
              <div className="flex flex-col items-center text-center">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-[12px] tracking-[0.1em] ring-1"
                  style={{
                    backgroundColor: MISSED_CHIP_BG,
                    color: MISSED_CORAL,
                    boxShadow: `inset 0 0 0 1px ${MISSED_CHIP_RING}`,
                  }}
                >
                  <Sparkles
                    className="size-3"
                    style={{ color: MISSED_CORAL }}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  {copy.missedEyebrow}
                </span>
                <p
                  className="mt-2 text-[15px] font-semibold leading-[20px] tracking-[-0.2px]"
                  style={{ color: color.text, letterSpacing: type.bodyTracking }}
                >
                  {copy.missedTitle}
                </p>
                <p
                  className="mt-0.5 text-[13px] font-medium leading-[18px]"
                  style={{ color: color.label, letterSpacing: type.bodyTracking }}
                >
                  {copy.missedDetail}
                </p>
              </div>

              <div className="mt-3 flex justify-center">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold leading-[14px] ring-1 ring-amber-200/50"
                  style={{ color: "#B45309", letterSpacing: type.bodyTracking }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={STREAK_BTC_ICON_SRC}
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5 object-contain"
                    draggable={false}
                    aria-hidden
                  />
                  {copy.nextRewardLabel(NEXT_REWARD_DAY)} · {copy.nextRewardName}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartSaving}
            className={`group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden text-[15px] font-bold leading-[20px] text-white ring-1 ring-[#0A6B64]/25 transition-transform duration-200 active:scale-[0.985] ${FOCUS_RING}`}
            style={{
              background: STREAK_CTA_GRADIENT,
              borderRadius: radius.pill,
              letterSpacing: type.bodyTracking,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/16 via-white/[0.03] to-black/12"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE161]/55 to-transparent"
              aria-hidden
            />
            <span className="relative z-10">{UI_COPY.cta.startSaving}</span>
            <ChevronRight
              className="relative z-10 size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
}
