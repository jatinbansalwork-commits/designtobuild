import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Top inset below Dynamic Island — status row + island clearance. */
const IOS_STATUS_BAR_HEIGHT =
  IPHONE_17.dynamicIsland.topPx + IPHONE_17.dynamicIsland.heightPx + 11;

function CellularIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      <rect x="0.5" y="7.5" width="3" height="4" rx="0.75" fill="currentColor" />
      <rect x="5" y="5.5" width="3" height="6" rx="0.75" fill="currentColor" />
      <rect x="9.5" y="3.5" width="3" height="8" rx="0.75" fill="currentColor" />
      <rect x="14" y="1" width="3" height="10.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M8 10.25a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        fill="currentColor"
      />
      <path
        d="M5.1 7.45a4.45 4.45 0 0 1 5.8 0l-.95 1.05a3.05 3.05 0 0 0-3.9 0L5.1 7.45Z"
        fill="currentColor"
      />
      <path
        d="M2.2 4.55a8.25 8.25 0 0 1 11.6 0l-.95 1.05a6.85 6.85 0 0 0-9.7 0L2.2 4.55Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="12"
        rx="3.25"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
      <path
        d="M24 4.5c.83.5.83 3.5 0 4"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface IosStatusBarProps {
  time?: string;
  tone?: "light" | "dark";
}

/** iOS 17 status row — time + system icons; Dynamic Island is rendered by IphoneScreenChrome. */
export function IosStatusBar({ time = "9:41", tone = "dark" }: IosStatusBarProps) {
  const textColor = tone === "light" ? "#FFFFFF" : "#000000";

  return (
    <div
      className="pointer-events-none relative z-40 shrink-0"
      style={{
        height: IOS_STATUS_BAR_HEIGHT,
        paddingTop: IPHONE_17.dynamicIsland.topPx + 7,
        paddingLeft: 27,
        paddingRight: 27,
      }}
      aria-hidden
    >
      <div className="flex items-center justify-between" style={{ color: textColor }}>
        <time
          dateTime={time}
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.016em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </time>
        <div className="flex items-center" style={{ gap: 6 }}>
          <CellularIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>
    </div>
  );
}
