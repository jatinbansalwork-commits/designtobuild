"use client";

import { useMarketPrices } from "@/kalash/hooks/use-market-prices";
import { formatInr } from "@/kalash/lib/gold-pricing";
import { computeHoldingsInr } from "@/kalash/lib/holdings";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

interface TotalSavingHeroProps {
  label?: string;
}

/** Total savings hero — gold + BTC combined INR value from live prices. */
export function TotalSavingHero({
  label = UI_COPY.metrics.totalSaving,
}: TotalSavingHeroProps) {
  const { color, space, type } = KALASH_VIEW;
  const { prices } = useMarketPrices();

  const showSkeleton = !prices;
  const { totalValueInr } = computeHoldingsInr(
    prices?.goldPricePerGmInr,
    prices?.btcPriceInr,
  );

  return (
    <div
      className="relative"
      style={{
        paddingTop: space.sectionMajor,
        paddingInline: space.headerGutterX,
        fontFamily: type.body,
      }}
    >
      <div
        className="pointer-events-none absolute -right-6 top-4 h-36 w-36 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,225,97,0.14) 0%, rgba(17,141,130,0.06) 42%, transparent 72%)",
        }}
        aria-hidden
      />

      <div className="relative">
        <p
          className="mb-3 text-[12px] font-semibold uppercase leading-[16px] tracking-[0.08em]"
          style={{ color: color.label }}
        >
          {label}
        </p>

        {showSkeleton ? (
          <div
            className="animate-pulse rounded-2xl bg-neutral-200/70"
            style={{
              height: 48,
              width: "62%",
              marginBottom: space.sectionY,
            }}
            aria-hidden
          />
        ) : (
          <p
            className="kalash-tabular text-[44px] font-bold leading-[48px] tracking-[-0.6px]"
            style={{ color: color.text, paddingBottom: space.sectionY }}
            aria-live="polite"
            aria-busy={false}
          >
            ₹{formatInr(totalValueInr)}
          </p>
        )}
      </div>

      <div
        className="h-px bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent"
        aria-hidden
      />
    </div>
  );
}
