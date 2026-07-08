export const GOLD_HOLDINGS_GM = 1.02;
export const BTC_HOLDINGS = 0.000086;

const FALLBACK_GOLD_PRICE_PER_GM_INR = 6998.12;
const FALLBACK_BTC_PRICE_INR = 5_997_869;

export interface HoldingsValueInr {
  goldValueInr: number;
  btcValueInr: number;
  totalValueInr: number;
}

export function computeHoldingsInr(
  goldPricePerGm = FALLBACK_GOLD_PRICE_PER_GM_INR,
  btcPriceInr = FALLBACK_BTC_PRICE_INR,
): HoldingsValueInr {
  const goldValueInr = GOLD_HOLDINGS_GM * goldPricePerGm;
  const btcValueInr = BTC_HOLDINGS * btcPriceInr;

  return {
    goldValueInr,
    btcValueInr,
    totalValueInr: goldValueInr + btcValueInr,
  };
}
