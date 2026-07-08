import type { ReactNode } from "react";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

export const STREAK_BTC_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/bitocin.svg";
export const STREAK_STAR_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/star.svg";
export const STREAK_CHECK_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/check.svg";
export const STREAK_CROSS_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/cross.svg";

export const STREAK_DAY_COUNT = 7;
export const STREAK_CIRCLE_SIZE_PX = 46;
export const STREAK_CIRCLE_GAP_PX = 4;

const STREAK_CIRCLE_BORDER_BY_DAY: Partial<Record<number, string>> = {
  4: "rgba(247, 147, 26, 0.4)",
  5: "rgba(53, 205, 72, 0.4)",
  6: "rgba(53, 205, 72, 0.4)",
  7: "rgba(247, 147, 26, 0.4)",
};

const STREAK_CIRCLE_ICON_BY_DAY: Partial<Record<number, string>> = {
  1: STREAK_CHECK_ICON_SRC,
  2: STREAK_CHECK_ICON_SRC,
  3: STREAK_CROSS_ICON_SRC,
  4: STREAK_BTC_ICON_SRC,
  7: STREAK_STAR_ICON_SRC,
};

const STREAK_EMPTY_CIRCLE_DAYS = new Set([5, 6]);
const STREAK_SMALL_ICON_DAYS = new Set([4, 7]);
const STREAK_BORDERLESS_DAYS = new Set([1, 2, 3]);

export const STREAK_LABEL_COLOR_BY_DAY: Partial<Record<number, string>> = {
  1: "#1E1E1E",
  2: "#1E1E1E",
  3: "#FF5630",
  4: "#637381",
  5: "#637381",
  6: "#637381",
  7: "#637381",
};

function getStreakCircleBorderColor(dayNumber: number): string | undefined {
  return STREAK_CIRCLE_BORDER_BY_DAY[dayNumber];
}

export function getStreakLabelColor(dayNumber: number, defaultColor: string): string {
  return STREAK_LABEL_COLOR_BY_DAY[dayNumber] ?? defaultColor;
}

function getStreakCircleIconSrc(dayNumber: number): string | undefined {
  return STREAK_CIRCLE_ICON_BY_DAY[dayNumber];
}

function getStreakCircleIconSizePx(dayNumber: number, circleSizePx: number): number {
  return STREAK_SMALL_ICON_DAYS.has(dayNumber)
    ? Math.round(circleSizePx * (24 / STREAK_CIRCLE_SIZE_PX))
    : circleSizePx;
}

interface DailyStreakTrackerProps {
  circleSizePx?: number;
  gapPx?: number;
  showDayNumbers?: boolean;
  renderDayLabel?: (dayNumber: number) => ReactNode;
  distribute?: boolean;
}

/** Seven-day streak row — shared by action sheet and saving streak card. */
export function DailyStreakTracker({
  circleSizePx = STREAK_CIRCLE_SIZE_PX,
  gapPx = STREAK_CIRCLE_GAP_PX,
  showDayNumbers = true,
  renderDayLabel,
  distribute = false,
}: DailyStreakTrackerProps) {
  const { color } = KALASH_VIEW;

  return (
    <div
      className={`flex w-full ${distribute ? "justify-between" : "justify-center"}`}
      style={distribute ? undefined : { gap: gapPx }}
      aria-hidden
    >
      {Array.from({ length: STREAK_DAY_COUNT }, (_, index) => {
        const dayNumber = index + 1;
        const borderColor = getStreakCircleBorderColor(dayNumber);
        const iconSrc = getStreakCircleIconSrc(dayNumber);
        const iconSizePx = getStreakCircleIconSizePx(dayNumber, circleSizePx);
        const isBorderless = STREAK_BORDERLESS_DAYS.has(dayNumber);

        return (
          <div
            key={dayNumber}
            className="flex shrink-0 flex-col items-center"
            style={{ width: circleSizePx }}
          >
            {showDayNumbers || renderDayLabel ? (
              <span
                className="mb-1 text-center text-[12px] font-normal leading-[14px]"
                style={{
                  color: renderDayLabel
                    ? getStreakLabelColor(dayNumber, color.text)
                    : getStreakLabelColor(dayNumber, color.label),
                  letterSpacing: "0.2px",
                }}
              >
                {renderDayLabel ? renderDayLabel(dayNumber) : dayNumber}
              </span>
            ) : null}

            <span
              className={`flex items-center justify-center rounded-full text-[14px] font-medium leading-[14px] ${
                isBorderless
                  ? ""
                  : `border-2 ${
                      STREAK_SMALL_ICON_DAYS.has(dayNumber)
                        ? "bg-white"
                        : "bg-neutral-50"
                    } ${borderColor ? "" : "border-neutral-200"}`
              }`}
              style={{
                width: circleSizePx,
                height: circleSizePx,
                color: color.label,
                letterSpacing: "0.2px",
                ...(!isBorderless && borderColor ? { borderColor } : {}),
              }}
            >
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconSrc}
                  alt=""
                  className="object-contain"
                  style={{
                    width: iconSizePx,
                    height: iconSizePx,
                  }}
                  aria-hidden
                  draggable={false}
                />
              ) : STREAK_EMPTY_CIRCLE_DAYS.has(dayNumber) ? null : (
                dayNumber
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
