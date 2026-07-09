import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

const SAFARI_BLUE = "#007AFF";
const SAFARI_DISABLED = "#C7C7CC";
const SAFARI_BG = "rgba(246, 246, 246, 0.94)";

function LockIcon() {
  return (
    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" aria-hidden>
      <rect x="1" y="4.5" width="6" height="6" rx="1.25" fill="#8E8E93" />
      <path
        d="M2.75 4.5V3.25a2.25 2.25 0 0 1 4.5 0V4.5"
        stroke="#8E8E93"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReaderIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
      <path
        d="M1 2.5h12M1 6h8M1 9.5h10"
        stroke="#8E8E93"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M11.5 7A4.5 4.5 0 0 1 4.2 9.1L3 8"
        stroke="#8E8E93"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 7A4.5 4.5 0 0 1 9.8 4.9L11 6"
        stroke="#8E8E93"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 5.5V8l2.2-.4M11 8.5V6l-2.2.4" stroke="#8E8E93" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
      <path
        d="M8.5 3.5 3.5 10l5 6.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ForwardIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
      <path
        d="M3.5 3.5 8.5 10l-5 6.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden>
      <path
        d="M9 13.5V3.5M9 3.5 5.5 7M9 3.5 12.5 7"
        stroke={SAFARI_BLUE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="3" y="9" width="12" height="10" rx="2.2" stroke={SAFARI_BLUE} strokeWidth="1.6" />
    </svg>
  );
}

function BookmarksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 3.5h12v11l-6-3.5L3 14.5V3.5Z"
        stroke={SAFARI_BLUE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TabsIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden>
      <rect x="1.5" y="4" width="13" height="12" rx="2.2" stroke={SAFARI_BLUE} strokeWidth="1.6" />
      <rect x="5.5" y="1" width="13" height="12" rx="2.2" stroke={SAFARI_BLUE} strokeWidth="1.6" fill={SAFARI_BG} />
    </svg>
  );
}

/** Total height of compact Safari chrome (URL bar + toolbar + home inset). */
export const IOS_SAFARI_COMPACT_HEIGHT =
  6 + 32 + 2 + 36 + IPHONE_17.homeIndicatorHeightPx;

interface IosSafariChromeProps {
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  /** Tighter chrome for merch canvas — reclaims ~16px vertical space. */
  compact?: boolean;
}

/** iOS Safari bottom chrome — URL bar + toolbar. Home indicator is on IphoneScreenChrome. */
export function IosSafariChrome({
  url = "freshprints.com",
  canGoBack = true,
  canGoForward = false,
  compact = false,
}: IosSafariChromeProps) {
  const urlBarHeight = compact ? 32 : 36;
  const toolbarHeight = compact ? 36 : 44;

  return (
    <div
      className="pointer-events-none shrink-0 border-t border-black/[0.08] backdrop-blur-xl backdrop-saturate-150"
      style={{
        backgroundColor: SAFARI_BG,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: compact ? 6 : 8,
        paddingBottom: IPHONE_17.homeIndicatorHeightPx,
      }}
      aria-hidden
    >
      <div
        className="flex items-center bg-white"
        style={{
          height: urlBarHeight,
          borderRadius: 10,
          paddingLeft: 12,
          paddingRight: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <LockIcon />
        <div
          className="mx-auto flex min-w-0 items-center justify-center"
          style={{ gap: 5 }}
        >
          <ReaderIcon />
          <span
            className="truncate"
            style={{
              fontSize: 14,
              lineHeight: 1,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#000000",
            }}
          >
            {url}
          </span>
        </div>
        <RefreshIcon />
      </div>

      <div
        className="flex items-center justify-between"
        style={{
          marginTop: compact ? 2 : 4,
          height: toolbarHeight,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        <BackIcon color={canGoBack ? SAFARI_BLUE : SAFARI_DISABLED} />
        <ForwardIcon color={canGoForward ? SAFARI_BLUE : SAFARI_DISABLED} />
        <ShareIcon />
        <BookmarksIcon />
        <TabsIcon />
      </div>
    </div>
  );
}
