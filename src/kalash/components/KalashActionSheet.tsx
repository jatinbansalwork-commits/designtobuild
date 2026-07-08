"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";
import {
  getKalashOverlayTransition,
  getKalashSheetTransition,
} from "@/kalash/lib/kalash-motion";
import {
  ActionSheetIllustration,
  ACTION_SHEET_ILLUSTRATION_OVERLAP_PX,
} from "@/kalash/components/action-sheet-illustration";
import {
  DailyStreakTracker,
  STREAK_BTC_ICON_SRC,
} from "@/kalash/components/daily-streak-tracker";

const SAVE_STREAK_GRADIENT =
  "linear-gradient(180deg, #1AC4B6 0%, #118D82 46%, #0A6B64 100%)";
const MISSED_CORAL = "#FF5630";
const MISSED_CHIP_BG = "#FFF0EB";
const MISSED_CHIP_RING = "rgba(255, 86, 48, 0.22)";
const SHEET_SURFACE_GRADIENT =
  "linear-gradient(180deg, #FFFCF8 0%, #FFFFFF 32%, #FFFFFF 100%)";

interface KalashActionSheetProps {
  open: boolean;
  onClose: () => void;
  onSaveNowPress?: (amount: number) => void;
  streakDay?: number;
  saveAmount?: number;
}

/** Bottom action sheet — illustration floats above the white panel. */
export function KalashActionSheet({
  open,
  onClose,
  onSaveNowPress,
  streakDay = 3,
  saveAmount = 100,
}: KalashActionSheetProps) {
  const playClick = useClickSound();
  const reducedMotion = useReducedMotion();
  const { space, color, radius, type } = KALASH_VIEW;
  const copy = UI_COPY.streak;
  const nextRewardDay = streakDay + 1;

  const overlayTransition = getKalashOverlayTransition(reducedMotion);
  const sheetTransition = getKalashSheetTransition(reducedMotion);

  function handleSavePress() {
    playClick();
    onSaveNowPress?.(saveAmount);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
        >
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-black/45 pointer-events-auto backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={copy.missedDailyBonus}
            className="relative z-10 flex w-full flex-col items-center pointer-events-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="relative z-10 flex justify-center"
              style={{ marginBottom: -ACTION_SHEET_ILLUSTRATION_OVERLAP_PX }}
              aria-hidden
              initial={reducedMotion ? false : { y: 8, opacity: 0.85 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActionSheetIllustration />
            </motion.div>

            <div
              className="relative w-full overflow-hidden rounded-t-[28px] shadow-[0_-16px_48px_rgba(17,24,39,0.16)] ring-1 ring-black/[0.04]"
              style={{
                background: SHEET_SURFACE_GRADIENT,
                paddingBottom: space.safeAreaBottom,
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255, 86, 48, 0.06) 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                aria-hidden
              />

              <div style={{ paddingTop: ACTION_SHEET_ILLUSTRATION_OVERLAP_PX }}>
                <div
                  className="mx-auto mt-3 h-1 w-10 rounded-full bg-neutral-200/90"
                  aria-hidden
                />

                <div
                  className="flex flex-col"
                  style={{
                    paddingInline: space.headerGutterX,
                    paddingTop: 20,
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] ring-1"
                      style={{
                        backgroundColor: MISSED_CHIP_BG,
                        color: MISSED_CORAL,
                        boxShadow: `inset 0 0 0 1px ${MISSED_CHIP_RING}`,
                        fontFamily: type.body,
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

                    <h2
                      className="mt-3 text-[20px] font-semibold leading-[26px] tracking-[-0.3px]"
                      style={{
                        color: color.text,
                        fontFamily: type.body,
                        letterSpacing: type.bodyTracking,
                      }}
                    >
                      {copy.missedTitle}
                    </h2>
                    <p
                      className="mt-1 max-w-[280px] text-[14px] font-medium leading-[20px]"
                      style={{
                        color: color.label,
                        fontFamily: type.body,
                        letterSpacing: type.bodyTracking,
                      }}
                    >
                      {copy.missedDetail}
                    </p>
                  </div>

                  <div
                    className="relative mt-6 overflow-hidden rounded-[20px] px-3 pb-4 pt-3 ring-1 ring-teal-950/[0.05]"
                    style={{
                      background:
                        "linear-gradient(165deg, #F3FBFA 0%, #F8FAFB 52%, #FFFFFF 100%)",
                    }}
                  >
                    <DailyStreakTracker distribute circleSizePx={40} gapPx={0} />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold leading-[16px] ring-1 ring-amber-200/50"
                      style={{
                        color: "#B45309",
                        fontFamily: type.body,
                        letterSpacing: type.bodyTracking,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={STREAK_BTC_ICON_SRC}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                        draggable={false}
                        aria-hidden
                      />
                      {copy.nextRewardLabel(nextRewardDay)} · {copy.nextRewardName}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-center text-[13px] font-medium leading-[18px]"
                    style={{
                      color: color.label,
                      fontFamily: type.body,
                      letterSpacing: type.bodyTracking,
                    }}
                  >
                    {copy.continueRewards}
                  </p>

                  <div className="mt-5 pb-2">
                    <button
                      type="button"
                      onClick={handleSavePress}
                      className={`save-now-shimmer relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden px-4 text-[14px] font-bold leading-[20px] text-white ring-1 ring-[#0A6B64]/25 transition-transform duration-200 active:scale-[0.985] ${FOCUS_RING}`}
                      style={{
                        background: SAVE_STREAK_GRADIENT,
                        borderRadius: radius.pill,
                        fontFamily: type.body,
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
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                        aria-hidden
                      />
                      <span className="relative z-10">
                        {copy.saveToContinueStreak(saveAmount)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
