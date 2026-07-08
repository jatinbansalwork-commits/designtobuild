export const TROY_OZ_GRAMS = 31.1034768;

export interface MarketPrices {
  goldPricePerGmInr: number;
  btcPriceInr: number;
  fetchedAt: string;
  sources: {
    gold: "ibja" | "aurum" | "fallback";
    btc: "coingecko" | "fallback";
  };
}

const FALLBACK_GOLD_PRICE_PER_GM_INR = 6998.12;
const FALLBACK_BTC_PRICE_INR = 5_997_869;

const IBJA_API_URL = "https://ibja-api.vercel.app/latest";
const AURUM_SPOT_URL = "https://aurumrates.com/api/v1/spot?metals=gold";
const USD_INR_URL = "https://api.frankfurter.app/latest?from=USD&to=INR";
const COINGECKO_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr";

interface IbjaLatestResponse {
  lblGold999_AM?: string;
}

interface AurumSpotResponse {
  data?: {
    gold?: {
      price?: number;
    };
  };
}

interface FrankfurterResponse {
  rates?: {
    INR?: number;
  };
}

interface CoinGeckoPriceResponse {
  bitcoin?: {
    inr?: number;
  };
}

function parseInrRate(value: string | number | undefined): number | null {
  if (value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** IBJA 999 gold AM rate is quoted per 10 grams in INR. */
export async function fetchIbjaGoldPricePerGmInr(): Promise<number | null> {
  const response = await fetch(IBJA_API_URL, {
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as IbjaLatestResponse;
  const perTenGrams = parseInrRate(data.lblGold999_AM);
  if (perTenGrams === null) return null;

  return Number((perTenGrams / 10).toFixed(2));
}

/** COMEX spot gold (USD/troy oz) converted to INR per gram. */
export async function fetchSpotGoldPricePerGmInr(): Promise<number | null> {
  const [goldResponse, fxResponse] = await Promise.all([
    fetch(AURUM_SPOT_URL, { next: { revalidate: 300 } }),
    fetch(USD_INR_URL, { next: { revalidate: 3600 } }),
  ]);

  if (!goldResponse.ok || !fxResponse.ok) return null;

  const goldData = (await goldResponse.json()) as AurumSpotResponse;
  const fxData = (await fxResponse.json()) as FrankfurterResponse;

  const usdPerOz = goldData.data?.gold?.price;
  const usdInr = fxData.rates?.INR;

  if (!usdPerOz || !usdInr) return null;

  return Number(((usdPerOz / TROY_OZ_GRAMS) * usdInr).toFixed(2));
}

export async function fetchBtcPriceInr(): Promise<number | null> {
  const response = await fetch(COINGECKO_PRICE_URL, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as CoinGeckoPriceResponse;
  const price = data.bitcoin?.inr;
  return typeof price === "number" && price > 0 ? price : null;
}

export async function fetchMarketPrices(): Promise<MarketPrices> {
  const [ibjaGold, spotGold, btcPrice] = await Promise.all([
    fetchIbjaGoldPricePerGmInr().catch(() => null),
    fetchSpotGoldPricePerGmInr().catch(() => null),
    fetchBtcPriceInr().catch(() => null),
  ]);

  const goldPricePerGmInr = ibjaGold ?? spotGold ?? FALLBACK_GOLD_PRICE_PER_GM_INR;
  const goldSource: MarketPrices["sources"]["gold"] = ibjaGold
    ? "ibja"
    : spotGold
      ? "aurum"
      : "fallback";

  const btcPriceInr = btcPrice ?? FALLBACK_BTC_PRICE_INR;
  const btcSource: MarketPrices["sources"]["btc"] = btcPrice ? "coingecko" : "fallback";

  return {
    goldPricePerGmInr,
    btcPriceInr,
    fetchedAt: new Date().toISOString(),
    sources: { gold: goldSource, btc: btcSource },
  };
}
