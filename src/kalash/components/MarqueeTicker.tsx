"use client";

import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

const TICKER_SHIELD_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-solar_shield-check-bold.svg";

const tickerItems = [
  { text: "Your savings are invested in 24K gold", hasShield: false },
  { text: "100% Hallmarked", hasShield: true },
  { text: "Get rewarded in crypto", hasShield: false },
] as const;

function TickerItem({
  text,
  hasShield,
}: {
  text: string;
  hasShield: boolean;
}) {
  const { color } = KALASH_VIEW;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-normal leading-[20px]"
      style={{ color: color.trustBarText }}
    >
      {hasShield ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={TICKER_SHIELD_ICON}
          alt=""
          className="size-3.5 shrink-0 object-contain"
          aria-hidden
        />
      ) : null}
      {text}
    </span>
  );
}

function TickerSeparator() {
  return (
    <span
      className="inline-flex shrink-0 px-3 text-[14px] font-normal leading-[20px]"
      style={{ color: KALASH_VIEW.color.trustBarText }}
      aria-hidden
    >
      |
    </span>
  );
}

function TickerStrip({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <span
      className="inline-flex shrink-0 items-center"
      aria-hidden={ariaHidden}
    >
      {tickerItems.map((item, index) => (
        <span
          key={`${item.text}-${index}`}
          className="inline-flex shrink-0 items-center"
        >
          <TickerItem {...item} />
          <TickerSeparator />
        </span>
      ))}
    </span>
  );
}

function TickerTrack() {
  return (
    <div className="flex w-max animate-marquee-ticker will-change-transform">
      <TickerStrip />
      <TickerStrip ariaHidden />
    </div>
  );
}

/** Trust-metrics news ticker — full-bleed mint bar below Save More CTA. */
export function MarqueeTicker() {
  const reducedMotion = useReducedMotion();
  const { color, space } = KALASH_VIEW;

  return (
    <div
      className="relative flex h-8 w-full items-center overflow-hidden whitespace-nowrap"
      style={{
        marginTop: space.sectionY,
        backgroundColor: color.trustBar,
      }}
      aria-label="Trust highlights"
    >
      {reducedMotion ? (
        <div className="flex h-full w-full items-center px-4">
          {tickerItems.map((item) => (
            <span key={item.text} className="inline-flex items-center">
              <TickerItem {...item} />
              <TickerSeparator />
            </span>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center">
          <TickerTrack />
        </div>
      )}
    </div>
  );
}
