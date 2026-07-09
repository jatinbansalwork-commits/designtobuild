import type { ReactNode } from "react";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Dynamic Island + home indicator overlay for portfolio phone mockups. */
export function IphoneScreenChrome({
  children,
  suppressHomeIndicator = false,
}: {
  children: ReactNode;
  /** Hide only the home indicator when a bottom sheet covers it. Island stays visible. */
  suppressHomeIndicator?: boolean;
}) {
  const island = IPHONE_17.dynamicIsland;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {children}
      <div
        className="pointer-events-none absolute left-1/2 z-[110] -translate-x-1/2 rounded-full bg-black"
        style={{
          top: `${(island.topPx / IPHONE_17.height) * 100}%`,
          width: `${(island.widthPx / IPHONE_17.width) * 100}%`,
          height: `${(island.heightPx / IPHONE_17.height) * 100}%`,
        }}
        aria-hidden
      />
      {!suppressHomeIndicator ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[110] flex items-end justify-center pb-[max(6px,0.7%)]"
          style={{ height: `${(IPHONE_17.homeIndicatorHeightPx / IPHONE_17.height) * 100}%` }}
          aria-hidden
        >
          <span
            className="h-[5px] rounded-full bg-black/30"
            style={{ width: `${(IPHONE_17.homeIndicatorBarWidthPx / IPHONE_17.width) * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
