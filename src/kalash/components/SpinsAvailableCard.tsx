"use client";

import { ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

/** Spin wheel asset — `/public/assets/wheel1.svg`. */
export const SPIN_WHEEL_ASSET_SRC = "/assets/wheel1.svg";

const SPINS_CARD_GRADIENT =
  "linear-gradient(92deg, #FFF6E5 0%, #FFFFFF 44%, #F9F4FF 100%)";
const SPINS_CARD_GLOW =
  "radial-gradient(circle at 10% 50%, rgba(255, 193, 7, 0.22) 0%, transparent 52%), radial-gradient(circle at 92% 35%, rgba(139, 92, 246, 0.14) 0%, transparent 50%)";
const SPIN_COUNT_GOLD = "#9A6700";

interface SpinsAvailableCardProps {
  spinCount?: number;
  onPress?: () => void;
}

/** Prize wheel promo row — spins available CTA. */
export function SpinsAvailableCard({
  spinCount = 5,
  onPress,
}: SpinsAvailableCardProps) {
  const playClick = useClickSound();
  const reducedMotion = useReducedMotion();
  const { color, space, type } = KALASH_VIEW;

  function handlePress() {
    playClick();
    onPress?.();
  }

  return (
    <div
      style={{
        paddingInline: space.headerGutterX,
      }}
    >
      <button
        type="button"
        onClick={handlePress}
        className={`group relative flex w-full min-h-[96px] items-center gap-3.5 overflow-hidden rounded-[18px] py-4 pl-4 pr-12 text-left ring-1 ring-amber-950/[0.06] transition-transform duration-200 active:scale-[0.99] ${FOCUS_RING}`}
        style={{
          background: SPINS_CARD_GRADIENT,
          fontFamily: type.body,
        }}
        aria-label={`${spinCount} spins available to play`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: SPINS_CARD_GLOW }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/75"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-[25px] top-1/2 size-28 -translate-y-1/2 opacity-[0.07]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPIN_WHEEL_ASSET_SRC}
            alt=""
            width={112}
            height={112}
            className={`size-full object-contain ${reducedMotion ? "" : "animate-spin-slow"}`}
            draggable={false}
          />
        </div>

        <div className="relative z-10 flex size-14 shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPIN_WHEEL_ASSET_SRC}
            alt=""
            width={48}
            height={48}
            className={`size-12 object-contain ${reducedMotion ? "" : "animate-spin-slow"}`}
            draggable={false}
          />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <p
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.2px]"
            style={{ color: color.text, letterSpacing: type.bodyTracking }}
          >
            <span
              className="kalash-tabular font-bold"
              style={{ color: SPIN_COUNT_GOLD }}
            >
              {spinCount}
            </span>{" "}
            Spins Available to Play
          </p>
          <p
            className="mt-0.5 text-[13px] font-medium leading-[18px]"
            style={{ color: color.label, letterSpacing: type.bodyTracking }}
          >
            {UI_COPY.spins.subtitle}
          </p>
        </div>

        <span
          className="absolute right-4 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 ring-1 ring-amber-200/35 backdrop-blur-sm"
          aria-hidden
        >
          <ChevronRight
            className="size-3.5"
            style={{ color: color.text }}
            strokeWidth={2.25}
          />
        </span>
      </button>
    </div>
  );
}
