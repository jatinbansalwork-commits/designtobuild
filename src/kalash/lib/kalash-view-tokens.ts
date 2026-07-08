import {
  IPHONE_SCREEN_RADIUS_PX,
  KALASH_MOBILE_HEIGHT,
  KALASH_MOBILE_WIDTH,
} from "@/kalash/components/slider/kalash-mobile-prototype-shell";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";
import { ROBINHOOD } from "@/kalash/lib/robinhood-design-tokens";

/** Kalash home view — layout & surface tokens (iPhone 17 viewport). */
export const KALASH_VIEW = {
  viewport: {
    width: KALASH_MOBILE_WIDTH,
    height: KALASH_MOBILE_HEIGHT,
    screenRadiusPx: IPHONE_SCREEN_RADIUS_PX,
  },
  color: {
    /** Card and top-of-home surfaces */
    surface: ROBINHOOD.color.surface,
    /** Scrollable page background below trust ticker */
    contentBg: ROBINHOOD.color.contentBg,
    canvas: ROBINHOOD.color.surface,
    sectionMuted: ROBINHOOD.color.surface,
    label: "#637381",
    text: ROBINHOOD.color.inkDefault,
    primary: ROBINHOOD.color.primary,
    onPrimary: ROBINHOOD.color.onPrimary,
    hairline: ROBINHOOD.color.hairline,
    trustBar: "#eef6e8",
    trustBarText: ROBINHOOD.color.inkWarm,
    promoBannerBg: "#fff7ed",
    exploreSavingsGold: "#118D82",
  },
  radius: {
    pill: ROBINHOOD.radius.pill,
    card: ROBINHOOD.radius.card,
  },
  space: {
    /** Inside text stacks (title → value → sub-value) */
    tight: 4,
    gutterX: 16,
    headerGutterX: 16,
    /** Standard section break */
    sectionY: 24,
    /** Major break (promo strip → hero) */
    sectionMajor: 32,
    stackGap: 24,
    bottomNavHeight: 72,
    headerHeight: 100,
    /** Clears Dynamic Island — matches AppHeaderRow pt-12 */
    safeAreaTop:
      IPHONE_17.dynamicIsland.topPx + IPHONE_17.dynamicIsland.heightPx,
    safeAreaBottom: 34,
    columnPaddingX: 12,
  },
  border: {
    subtle: `1px solid ${ROBINHOOD.color.hairline}`,
    hairline: `1px solid ${ROBINHOOD.color.hairline}`,
    card: "1px solid rgba(229, 231, 235, 0.8)",
  },
  type: {
    body: ROBINHOOD.type.body,
    display: ROBINHOOD.type.display,
    bodyTracking: ROBINHOOD.type.bodyTracking,
    displayTracking: ROBINHOOD.type.displayTracking,
    /** Line heights paired to common Kalash text sizes (px). */
    leading: {
      9: 12,
      10: 12,
      12: 14,
      13: 18,
      14: 20,
      15: 20,
      16: 22,
      22: 28,
      26: 32,
      28: 34,
      34: 40,
    },
    label:
      "whitespace-nowrap text-[11px] font-normal leading-[13px] tracking-tight text-[#4d4a46]",
    metric:
      "whitespace-nowrap text-[13px] font-bold leading-[18px] tracking-tight text-[#110e08]",
  },
} as const;
