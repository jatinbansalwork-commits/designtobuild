/** iPad Pro 11" logical viewport (landscape) — device frame for Saltmine dashboard. */
export const IPAD_LANDSCAPE = {
  width: 1194,
  height: 834,
  bezelRadiusPx: 46,
  screenRadiusPx: 30,
  borderWidthPx: 18,
} as const;

function proportionalRadius(radiusPx: number) {
  const horizontal = (radiusPx / IPAD_LANDSCAPE.width) * 100;
  const vertical = (radiusPx / IPAD_LANDSCAPE.height) * 100;
  return `${horizontal}% / ${vertical}%`;
}

const bezelWidthPercent =
  (IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.width) * 100;

/** Shared iPad frame tokens — proportional radius/border at any mockup size. */
export const IPAD_FRAME = {
  aspectRatio: `${IPAD_LANDSCAPE.width} / ${IPAD_LANDSCAPE.height}`,
  bezelRadius: proportionalRadius(IPAD_LANDSCAPE.bezelRadiusPx),
  screenRadius: proportionalRadius(IPAD_LANDSCAPE.screenRadiusPx),
  borderWidth: `max(6px, ${bezelWidthPercent}%)`,
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
  top: `${(IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.height) * 100}%`,
  right: `${(IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.width) * 100}%`,
  bottom: `${(IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.height) * 100}%`,
  left: `${(IPAD_LANDSCAPE.borderWidthPx / IPAD_LANDSCAPE.width) * 100}%`,
} as const;

export const ipadScreenStyle = {
  borderRadius: IPAD_FRAME.screenRadius,
  backgroundColor: "#f3f4f6",
} as const;
