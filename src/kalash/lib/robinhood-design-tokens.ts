/**
 * Robinhood-inspired design tokens (2024 identity, Porto Rocha).
 * @see https://www.shadcn.io/design/robinhood
 *
 * Applied on light product surfaces: warm ink, hairline borders,
 * Robin Neon reserved for primary CTAs only.
 */
export const ROBINHOOD = {
  color: {
    primary: "#118D82",
    onPrimary: "#ffffff",
    canvas: "#110e08",
    canvasDeep: "#1c180d",
    canvasMid: "#35322d",
    canvasWarm: "#4d4a46",
    surface: "#ffffff",
    surfaceDim: "#d9d9d9",
    contentBg: "#F5F6F8",
    inkDefault: "#110e08",
    inkSubdued: "#4d4a46",
    inkWarm: "#35322d",
    hairline: "#d9d9d9",
    hairlineDark: "#35322d",
  },
  radius: {
    pill: 36,
    card: 18,
  },
  type: {
    bodyTracking: "-0.25px",
    displayTracking: "-0.5px",
    body: "var(--font-inter), system-ui, sans-serif",
    display: "var(--font-source-serif-4), Georgia, serif",
  },
} as const;
