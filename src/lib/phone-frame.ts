import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Elliptical corner radius as % of an element's own box. */
function proportionalRadius(radiusPx: number, widthPx: number, heightPx: number) {
  const horizontal = (radiusPx / widthPx) * 100;
  const vertical = (radiusPx / heightPx) * 100;
  return `${horizontal}% / ${vertical}%`;
}

const bezelWidthPercent = (IPHONE_17.borderWidthPx / IPHONE_17.width) * 100;
const screenWidthPx = IPHONE_17.width - IPHONE_17.borderWidthPx * 2;
const screenHeightPx = IPHONE_17.height - IPHONE_17.borderWidthPx * 2;

/**
 * Keep the screen curve nested under the bezel.
 * Extra inset kills the light fringe at rounded corners when the mockup is
 * scaled down (subpixel / AA mismatch between % radii and px borders).
 */
const NESTED_RADIUS_TRIM_PX = 4;

const nestedScreenRadiusPx = Math.max(
  0,
  Math.min(
    IPHONE_17.screenRadiusPx,
    IPHONE_17.bezelRadiusPx - IPHONE_17.borderWidthPx - NESTED_RADIUS_TRIM_PX,
  ),
);

/**
 * Shared border width — same token for frame stroke and screen inset.
 * A 1px floor keeps tiny mobile previews crisp without making their bezel
 * look disproportionately heavy; larger frames retain the designed ratio.
 */
const borderWidth = `max(1px, ${bezelWidthPercent}%)`;

/** Shared phone frame tokens — proportional radius/border at any mockup size. */
export const PHONE_FRAME = {
  aspectRatio: `${IPHONE_17.width} / ${IPHONE_17.height}`,
  bezelRadius: proportionalRadius(
    IPHONE_17.bezelRadiusPx,
    IPHONE_17.width,
    IPHONE_17.height,
  ),
  screenRadius: proportionalRadius(
    nestedScreenRadiusPx,
    screenWidthPx,
    screenHeightPx,
  ),
  borderWidth,
  borderColor: "#000",
  backgroundColor: "#000",
  shadow:
    "0 12px 40px rgba(15, 23, 42, 0.14), 0 32px 64px rgba(0, 0, 0, 0.12)",
  dropShadow:
    "drop-shadow(0 12px 40px rgba(15, 23, 42, 0.14)) drop-shadow(0 32px 64px rgba(0, 0, 0, 0.12))",
  insetHighlight: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
} as const;

export const phoneFrameStyle = {
  boxSizing: "border-box" as const,
  aspectRatio: PHONE_FRAME.aspectRatio,
  borderRadius: PHONE_FRAME.bezelRadius,
  border: `${PHONE_FRAME.borderWidth} solid ${PHONE_FRAME.borderColor}`,
  backgroundColor: PHONE_FRAME.backgroundColor,
  boxShadow: PHONE_FRAME.insetHighlight,
};

export const phoneFrameDropShadowStyle = {
  borderRadius: PHONE_FRAME.bezelRadius,
  filter: PHONE_FRAME.dropShadow,
} as const;

/**
 * Match the real rendered border width (including the `max(1px, …)` floor)
 * so the white screen never sits under a thinner inset than the bezel.
 */
export const phoneScreenInset = {
  top: borderWidth,
  right: borderWidth,
  bottom: borderWidth,
  left: borderWidth,
} as const;

export const phoneScreenStyle = {
  borderRadius: PHONE_FRAME.screenRadius,
  backgroundColor: "#fff",
  overflow: "hidden" as const,
  // Inset clip hides the white halo that can peek past the black bezel curve.
  clipPath: `inset(1px round ${PHONE_FRAME.screenRadius})`,
} as const;
