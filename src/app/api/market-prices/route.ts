import { NextResponse } from "next/server";
import { fetchMarketPrices } from "@/kalash/lib/market-prices";

export const revalidate = 60;

export async function GET() {
  try {
    const prices = await fetchMarketPrices();
    return NextResponse.json(prices);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch market prices" },
      { status: 503 },
    );
  }
}
