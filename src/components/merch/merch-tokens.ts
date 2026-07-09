import type { CSSProperties } from "react";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Merch designer frame — iPhone 17 logical viewport (393×852). */
export const MERCH_WIDTH = IPHONE_17.width;
export const MERCH_HEIGHT = IPHONE_17.height;

/** Top inset below Dynamic Island for app content. */
export const MERCH_SAFE_TOP =
  IPHONE_17.dynamicIsland.topPx + IPHONE_17.dynamicIsland.heightPx + 11;

/** Bottom inset above home indicator. */
export const MERCH_HOME_INSET = IPHONE_17.homeIndicatorHeightPx;

/** Canva App UI Kit — 8px base unit. */
export const u = (units: number) => units * 8;

/** Noto Sans — primary typeface for merch preview. */
export const CANVA_FONT = '"Noto Sans", system-ui, sans-serif';

/** Canva spacing scale (multiples of 8px, with 4px for fine chip padding). */
export const CANVA_SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

/** Canva border radii — 8px content, 16px panels, full pills. */
export const CANVA_RADIUS = {
  sm: 8,
  lg: 16,
  full: 9999,
} as const;

/** Canva typography — -0.01em tracking across the scale. */
export const CANVA_TYPE = {
  body: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: "-0.01em",
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 1.43,
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  chip: {
    fontSize: 14,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  caption: {
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: "-0.01em",
  },
  captionRegular: {
    fontSize: 12,
    lineHeight: 1.33,
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  label: {
    fontSize: 15,
    lineHeight: "22px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
} as const;

/** Freshprints brand primary — single source of truth for interactive accents. */
export const CANVA_PRIMARY = "#191960";
export const CANVA_PRIMARY_RGB = "25, 25, 96";

/** Canva typography colors. */
export const CANVA_COLOR = {
  typographyPrimary: "var(--Typography-colorTypographyPrimary, #0E1318)",
  typographySecondary: "var(--Typography-colorTypographySecondary, rgba(13, 18, 22, 0.86))",
} as const;

/** Canva form input tokens — matches App UI Kit MultilineInput / TextInput. */
export const CANVA_INPUT = {
  borderDefault: "var(--Border-colorBorder, rgba(53, 71, 90, 0.20))",
  borderHover: "var(--Border-colorBorder, rgba(53, 71, 90, 0.32))",
  borderActive: CANVA_PRIMARY,
  bg: "var(--Background-colorPage, #FFF)",
  bgDisabled: "#F5F6FA",
  text: "var(--Typography-colorTypographyPrimary, #0E1318)",
  placeholder: "var(--Typography-colorTypographyPlaceholder, rgba(17, 23, 29, 0.60))",
  focusRing: `0 0 0 2px rgba(${CANVA_PRIMARY_RGB}, 0.24)`,
  radius: "var(--Radius-radiusElement, 8px)",
  paddingX: 12,
  paddingY: 9,
  fieldHeight: 120,
  fieldWidth: 369,
  minHeight: 80,
  lineHeight: 22,
  fontSize: 14,
} as const;

/** Carolina Blue front — base product render (transparent PNG). */
export const MERCH_HERO_IMAGE =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/CarolinaBlue_Front_7fea7572-de0b-499f-9f97-1e9a41719376-removebg-preview.png";

/** Antique Irish Green back — base product render (transparent PNG). */
export const MERCH_HERO_BACK_IMAGE =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/AntiqIrishGrn_Back-removebg-preview.png";

export const MERCH_COLOR_SWATCHES = [
  {
    id: "navy",
    name: "Bay",
    color: "#40579D",
    fast: true,
  },
  {
    id: "mint",
    name: "Mint",
    color: "#64D3B5",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    color: "#595B5D",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    color: "#783636",
  },
  {
    id: "sand",
    name: "Sand",
    color: "#F6E6BA",
  },
] as const;

export type MerchColorId = (typeof MERCH_COLOR_SWATCHES)[number]["id"];

export const MERCH = {
  bg: "#FFFFFF",
  text: "#0F1015",
  textMuted: "#6B7280",
  primary: CANVA_PRIMARY,
  primarySoft: "#EDEDF5",
  cardBg: "#F5F6FA",
  border: "#E5E7EB",
  chipBg: `rgba(${CANVA_PRIMARY_RGB}, 0.12)`,
  chipText: "#474B6D",
  island: "#212B36",
  safariBg: "rgba(249, 249, 249, 0.94)",
} as const;

export function canvaTypeStyle(
  token: (typeof CANVA_TYPE)[keyof typeof CANVA_TYPE],
): CSSProperties {
  return {
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    fontWeight: token.fontWeight,
    letterSpacing: token.letterSpacing,
  };
}
