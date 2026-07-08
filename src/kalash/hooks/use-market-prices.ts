"use client";

import { useCallback, useEffect, useState } from "react";
import type { MarketPrices } from "@/kalash/lib/market-prices";

const REFRESH_MS = 60_000;

async function loadMarketPrices(): Promise<MarketPrices | null> {
  const response = await fetch("/api/market-prices", { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as MarketPrices;
}

export function useMarketPrices() {
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await loadMarketPrices();
    if (next) setPrices(next);
    return next;
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await loadMarketPrices();
      if (!cancelled) {
        setPrices(next);
        setIsLoading(false);
      }
    })();

    const interval = window.setInterval(() => {
      void refresh();
    }, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { prices, isLoading, refresh };
}
