"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { GoldIcon } from "@/kalash/components/GoldIcon";
import { useMarketPrices } from "@/kalash/hooks/use-market-prices";
import { formatInr } from "@/kalash/lib/gold-pricing";
import {
  computeHoldingsInr,
  BTC_HOLDINGS,
  GOLD_HOLDINGS_GM,
} from "@/kalash/lib/holdings";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const BTC_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/BTC.svg";

interface AssetCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subValue: string;
  showSubValueSkeleton?: boolean;
}

function AssetCard({
  icon,
  title,
  value,
  subValue,
  showSubValueSkeleton = false,
  className = "",
}: AssetCardProps & { className?: string }) {
  const { color } = KALASH_VIEW;

  return (
    <div className={`flex min-w-0 items-center gap-3 px-4 ${className}`.trim()}>
      <div className="shrink-0">{icon}</div>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p
            className="truncate text-[14px] font-normal leading-[20px] tracking-tight"
            style={{ color: color.label, fontSize: 14 }}
          >
            {title}
          </p>
          <p
            className="kalash-tabular truncate text-[16px] font-semibold leading-[24px]"
            style={{ color: color.text, fontSize: 16 }}
          >
            {value}
          </p>
          {showSubValueSkeleton ? (
            <div
              className="h-5 w-16 animate-pulse rounded-md bg-neutral-200/70"
              aria-hidden
            />
          ) : (
            <p
              className="kalash-tabular truncate text-[15px] font-medium leading-[20px] tracking-tight"
              style={{ color: color.label, fontSize: 15 }}
            >
              {subValue}
            </p>
          )}
        </div>
        <ChevronRight
          className="size-3.5 shrink-0"
          style={{ color: color.text }}
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Dual-column gold / BTC holdings metrics row. */
export function AssetMetricsGrid() {
  const { prices } = useMarketPrices();
  const showSkeleton = !prices;

  const { goldValueInr, btcValueInr } = computeHoldingsInr(
    prices?.goldPricePerGmInr,
    prices?.btcPriceInr,
  );

  const assets: AssetCardProps[] = [
    {
      icon: (
        <div className="relative flex size-10 shrink-0 items-center justify-center">
          <GoldIcon className="size-10" />
        </div>
      ),
      title: UI_COPY.metrics.goldInLocker,
      value: `${GOLD_HOLDINGS_GM} gm`,
      subValue: `₹${formatInr(goldValueInr)}`,
    },
    {
      icon: (
        <div className="relative flex size-10 shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BTC_ICON}
            alt=""
            className="size-10 object-contain"
            aria-hidden
          />
        </div>
      ),
      title: UI_COPY.metrics.btcRewards,
      value: BTC_HOLDINGS.toFixed(6),
      subValue: `₹${formatInr(btcValueInr)}`,
    },
  ];

  return (
    <div
      className="grid w-full grid-cols-2 items-center bg-white"
      style={{ paddingTop: KALASH_VIEW.space.sectionY }}
    >
      {assets.map((asset, index) => (
        <AssetCard
          key={asset.title}
          {...asset}
          showSubValueSkeleton={showSkeleton}
          className={index === 0 ? "border-r border-neutral-100/80" : ""}
        />
      ))}
    </div>
  );
}
