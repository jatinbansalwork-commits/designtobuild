/** iPad Pro 11" logical viewport (landscape) — device frame for Saltmine dashboard. */
export const IPAD_LANDSCAPE = {
  width: 1194,
  height: 834,
  bezelRadiusPx: 46,
  screenRadiusPx: 30,
  borderWidthPx: 18,
} as const;

function proportionalRadius(radiusPx: number, widthPx: number, heightPx: number) {
  const horizontal = (radiusPx / widthPx) * 100;
  const vertical = (radiusPx / heightPx) * 100;
  return `${horizontal}% / ${vertical}%`;
}

const bezelWidthPercent =
  (IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.width) * 100;
const screenWidthPx = IPAD_LANDSCAPE.width - IPAD_LANDSCAPE.borderWidthPx * 2;
const screenHeightPx = IPAD_LANDSCAPE.height - IPAD_LANDSCAPE.borderWidthPx * 2;
const nestedScreenRadiusPx = Math.max(
  0,
  Math.min(
    IPAD_LANDSCAPE.screenRadiusPx,
    IPAD_LANDSCAPE.bezelRadiusPx - IPAD_LANDSCAPE.borderWidthPx - 2,
  ),
);

/**
 * Keep compact iPad previews proportional. The old 6px floor made the
 * bezel noticeably heavier as the mockup shrank on narrow screens.
 */
const borderWidth = `max(1px, ${bezelWidthPercent}%)`;

/** Shared iPad frame tokens — proportional radius/border at any mockup size. */
export const IPAD_FRAME = {
  aspectRatio: `${IPAD_LANDSCAPE.width} / ${IPAD_LANDSCAPE.height}`,
  bezelRadius: proportionalRadius(
    IPAD_LANDSCAPE.bezelRadiusPx,
    IPAD_LANDSCAPE.width,
    IPAD_LANDSCAPE.height,
  ),
  screenRadius: proportionalRadius(
    nestedScreenRadiusPx,
    screenWidthPx,
    screenHeightPx,
  ),
  borderWidth,
  borderColor: "#0b0b0d",
  backgroundColor: "#0b0b0d",
  dropShadow:
    "drop-shadow(0 12px 40px rgba(15, 23, 42, 0.14)) drop-shadow(0 32px 64px rgba(0, 0, 0, 0.12))",
  insetHighlight: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
} as const;

export const ipadFrameStyle = {
  boxSizing: "border-box" as const,
  aspectRatio: IPAD_FRAME.aspectRatio,
  borderRadius: IPAD_FRAME.bezelRadius,
  border: `${IPAD_FRAME.borderWidth} solid ${IPAD_FRAME.borderColor}`,
  backgroundColor: IPAD_FRAME.backgroundColor,
  boxShadow: IPAD_FRAME.insetHighlight,
};

export const ipadFrameDropShadowStyle = {
  borderRadius: IPAD_FRAME.bezelRadius,
  filter: IPAD_FRAME.dropShadow,
} as const;

export const ipadScreenInset = {
  top: borderWidth,
  right: borderWidth,
  bottom: borderWidth,
  left: borderWidth,
} as const;

export const ipadScreenStyle = {
  borderRadius: IPAD_FRAME.screenRadius,
  backgroundColor: "#f3f4f6",
  clipPath: `inset(0 round ${IPAD_FRAME.screenRadius})`,
} as const;
