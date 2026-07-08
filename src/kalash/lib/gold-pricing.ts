export const GOLD_PRICING = {
  initialPricePerGm: 6998.12,
  lockDurationSeconds: 120,
  gstRate: 0.03,
  priceFetchMs: 900,
  couponsFetchMs: 1500,
  expiringThresholdSeconds: 15,
  refreshDurationMs: 650,
} as const;

export type AmountUnit = "rupees" | "grams";
export type PriceLockPhase = "loading" | "locked" | "expiring" | "refreshing";

export function formatInr(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function formatPriceTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function fluctuateGoldPrice(current: number) {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const delta = Math.random() < 0.5 ? 1 : 2;
  return Number((current + direction * delta).toFixed(2));
}

export interface PriceUpdateNotice {
  previousPrice: number;
  nextPrice: number;
  delta: number;
}

export function getPriceLockPhase(
  isReady: boolean,
  timerSeconds: number,
  isRefreshing: boolean,
): PriceLockPhase {
  if (!isReady || isRefreshing) return isRefreshing ? "refreshing" : "loading";
  if (timerSeconds <= GOLD_PRICING.expiringThresholdSeconds) return "expiring";
  return "locked";
}

export interface GoldQuoteInput {
  unit: AmountUnit;
  amountRupees: number;
  grams: number;
  pricePerGm: number;
}

export interface GoldQuote {
  displayRupees: number;
  displayGrams: number;
  baseAmount: number;
  gstAmount: number;
  pricePerGm: number;
}

/** Single source of truth for all money on Buy Gold. */
export function computeGoldQuote({
  unit,
  amountRupees,
  grams,
  pricePerGm,
}: GoldQuoteInput): GoldQuote {
  const displayRupees =
    unit === "rupees" ? amountRupees : Math.round(grams * pricePerGm);
  const displayGrams = unit === "rupees" ? amountRupees / pricePerGm : grams;
  const baseAmount = displayRupees / (1 + GOLD_PRICING.gstRate);
  const gstAmount = displayRupees - baseAmount;

  return {
    displayRupees,
    displayGrams,
    baseAmount,
    gstAmount,
    pricePerGm,
  };
}
