import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Static home indicator for in-app iPhone 17 chrome. */
export function AppHomeIndicator() {
  return (
    <div
      className="flex items-end justify-center pb-2"
      style={{ height: IPHONE_17.homeIndicatorHeightPx }}
      aria-hidden
    >
      <span
        className="h-[5px] rounded-full bg-black/30"
        style={{ width: IPHONE_17.homeIndicatorBarWidthPx }}
      />
    </div>
  );
}
