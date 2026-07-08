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
/** Keep inner curve nested under the bezel (border-box radius − border). */
const nestedScreenRadiusPx = Math.max(
  0,
  Math.min(IPHONE_17.screenRadiusPx, IPHONE_17.bezelRadiusPx - IPHONE_17.borderWidthPx),
);

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
  borderWidth: `max(3px, ${bezelWidthPercent}%)`,
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

/** Inset screen content so the black bezel shows inside the outer border. */
export const phoneScreenInset = {
  top: `${(IPHONE_17.borderWidthPx / IPHONE_17.height) * 100}%`,
  right: `${(IPHONE_17.borderWidthPx / IPHONE_17.width) * 100}%`,
  bottom: `${(IPHONE_17.borderWidthPx / IPHONE_17.height) * 100}%`,
  left: `${(IPHONE_17.borderWidthPx / IPHONE_17.width) * 100}%`,
} as const;

export const phoneScreenStyle = {
  borderRadius: PHONE_FRAME.screenRadius,
  backgroundColor: "#fff",
} as const;
