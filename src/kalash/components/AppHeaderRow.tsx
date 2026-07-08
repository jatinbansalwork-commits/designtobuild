"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { KALASH_RING_TEAL } from "@/kalash/components/slider/kalash/kalash-tokens";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { useMarketPrices } from "@/kalash/hooks/use-market-prices";
import { formatInr, GOLD_PRICING } from "@/kalash/lib/gold-pricing";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const PROFILE_AVATAR_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Group%201244829521.svg";
const LIVE_LOTTIE_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/icon%20live.json";
const HEADER_BELL_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-bell.svg";
const HEADER_TROPHY_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-solar_cup-star-bold.svg";

interface AppHeaderRowProps {
  priceLabel?: string;
  onAvatarClick?: () => void;
}

function LiveIndicator() {
  const reducedMotion = useReducedMotion();
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(LIVE_LOTTIE_SRC)
      .then((response) => response.json())
      .then((data: object) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!animationData) {
    return <div className="size-8 shrink-0" aria-hidden />;
  }

  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center"
      aria-label="Live gold price"
    >
      <Lottie
        animationData={animationData}
        loop={!reducedMotion}
        autoplay={!reducedMotion}
        className="size-full"
      />
    </div>
  );
}

function HeaderAvatar({ onClick }: { onClick?: () => void }) {
  const reducedMotion = useReducedMotion();

  const avatar = (
    <div
      className="relative flex size-12 shrink-0 items-center justify-center"
      aria-label="Profile"
    >
      <svg
        viewBox="0 0 48 48"
        className={`pointer-events-none absolute inset-0 z-0 size-full drop-shadow-[0_0_10px_rgba(17,141,130,0.28)] ${reducedMotion ? "" : "animate-spin-slow"}`}
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke={KALASH_RING_TEAL}
          strokeWidth="2.4"
          strokeDasharray="11 7"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 size-9 shrink-0 overflow-hidden rounded-full bg-[#f79780] shadow-[0_4px_12px_rgba(15,23,42,0.12)] ring-2 ring-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE_AVATAR_SRC}
          alt=""
          className="size-full object-cover object-center"
        />
      </div>
    </div>
  );

  if (!onClick) return avatar;

  return (
    <button
      type="button"
      className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 transition-transform duration-200 active:scale-95"
      aria-label="Open flashback story"
      onClick={onClick}
    >
      {avatar}
    </button>
  );
}

function HeaderIconSlot({ src, label }: { src: string; label: string }) {
  return (
    <button
      type="button"
      className="group flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ease-out hover:bg-[#118D82]/10 active:scale-95"
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="size-[22px] object-contain transition-transform duration-200 ease-out group-hover:scale-105"
      />
    </button>
  );
}

function HeaderIconPill() {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/88 p-1 ring-1 ring-black/[0.05] backdrop-blur-md">
      <HeaderIconSlot src={HEADER_BELL_ICON} label="Notifications" />
      <span className="h-4 w-px bg-neutral-200/80" aria-hidden />
      <HeaderIconSlot src={HEADER_TROPHY_ICON} label="Rewards" />
    </div>
  );
}

function LivePricingPill({
  priceLabel,
  price,
  isLoading,
}: {
  priceLabel: string;
  price: string;
  isLoading: boolean;
}) {
  const { color, type } = KALASH_VIEW;

  return (
    <div className="flex shrink-0 items-stretch overflow-hidden rounded-full bg-white/88 shadow-[0_4px_14px_#F5F6F8] ring-1 ring-[#F5F6F8] backdrop-blur-md">
      <div className="flex items-center bg-gradient-to-b from-[#F5F6F8] to-white/40 pl-1 pr-1.5">
        <div className="flex size-9 items-center justify-center rounded-full bg-white/70 shadow-[0_4px_14px_#F5F6F8] ring-1 ring-[#F5F6F8]">
          <LiveIndicator />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-0.5 py-1.5 pl-2 pr-3">
        <p
          className="whitespace-nowrap text-[9px] font-semibold uppercase leading-[11px] tracking-[0.06em]"
          style={{ color: color.label, fontFamily: type.body }}
        >
          {priceLabel}
        </p>
        <p
          className={`kalash-tabular whitespace-nowrap text-[13px] font-bold leading-[16px] tracking-[-0.2px] ${isLoading ? "animate-pulse opacity-70" : ""}`}
          style={{ color: color.primary, fontFamily: type.body }}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {price}
        </p>
      </div>
    </div>
  );
}

/** Top header row — avatar (left) + live pricing pill (right). */
export function AppHeaderRow({
  priceLabel = UI_COPY.header.goldBuyPrice,
  onAvatarClick,
}: AppHeaderRowProps) {
  const { type } = KALASH_VIEW;
  const { prices, isLoading } = useMarketPrices();
  const pricePerGm =
    prices?.goldPricePerGmInr ?? GOLD_PRICING.initialPricePerGm;
  const priceDisplay = `₹${formatInr(pricePerGm)}/gm`;

  return (
    <div
      className="flex w-full select-none pt-12"
      style={{
        minHeight: KALASH_VIEW.space.headerHeight,
        paddingInline: KALASH_VIEW.space.headerGutterX,
        fontFamily: type.body,
      }}
    >
      <div className="flex w-full items-center justify-between pb-3 pt-4">
        <HeaderAvatar onClick={onAvatarClick} />
        <div className="flex shrink-0 items-center gap-2">
          <LivePricingPill
            priceLabel={priceLabel}
            price={priceDisplay}
            isLoading={isLoading && !prices}
          />
          <HeaderIconPill />
        </div>
      </div>
    </div>
  );
}
