"use client";

import { formatInr, formatPriceTimer, GOLD_PRICING, type PriceLockPhase } from "@/kalash/lib/gold-pricing";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { LivePriceBarSkeleton } from "@/kalash/components/save-more-skeletons";

interface LivePriceBarProps {
  phase: PriceLockPhase;
  pricePerGm: number;
  timerSeconds: number;
  progressPercent: number;
}

export function LivePriceBar({
  phase,
  pricePerGm,
  timerSeconds,
  progressPercent,
}: LivePriceBarProps) {
  const reducedMotion = useReducedMotion();

  if (phase === "loading") {
    return <LivePriceBarSkeleton />;
  }

  const isRefreshing = phase === "refreshing";
  const isExpiring = phase === "expiring";
  const timerLabel = isRefreshing ? "Updating…" : formatPriceTimer(timerSeconds);

  return (
    <div
      className={`relative shrink-0 overflow-hidden border-t border-[#f9d8d3] bg-[#FCE2DD] px-4 py-2 save-async-enter ${
        isExpiring && !reducedMotion ? "price-lock-expiring" : ""
      }`}
      role="progressbar"
      aria-valuenow={timerSeconds}
      aria-valuemin={0}
      aria-valuemax={GOLD_PRICING.lockDurationSeconds}
      aria-label={`Live gold buy price valid for ${timerLabel}`}
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 bg-[#FFBEB1] ${
          isRefreshing ? "opacity-40" : ""
        }`}
        style={{
          width: isRefreshing ? "100%" : `${progressPercent}%`,
          transition: reducedMotion ? undefined : "width 1s linear, opacity 0.3s ease",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex items-center justify-between text-[12px] font-medium text-[#ee4d37]">
        <p className="inline-flex items-center gap-1.5">
          <span
            className={`size-1.5 rounded-full bg-[#ee4d37] ${
              isRefreshing && !reducedMotion ? "animate-pulse" : ""
            }`}
            aria-hidden
          />
          {isRefreshing ? (
            "Refreshing live price"
          ) : (
            <>Live | Buy Price: ₹ {formatInr(pricePerGm)}/gm</>
          )}
        </p>
        <p className="kalash-tabular">{isRefreshing ? "…" : `Valid for: ${timerLabel}`}</p>
      </div>
    </div>
  );
}
