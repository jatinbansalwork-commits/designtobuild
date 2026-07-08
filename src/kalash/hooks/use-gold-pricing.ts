"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fluctuateGoldPrice,
  getPriceLockPhase,
  GOLD_PRICING,
  type PriceLockPhase,
  type PriceUpdateNotice,
} from "@/kalash/lib/gold-pricing";

export type { PriceUpdateNotice };

export function useGoldPricing() {
  const [pricePerGm, setPricePerGm] = useState<number>(GOLD_PRICING.initialPricePerGm);
  const [timerSeconds, setTimerSeconds] = useState<number>(GOLD_PRICING.lockDurationSeconds);
  const [isPriceReady, setIsPriceReady] = useState(false);
  const [areCouponsReady, setAreCouponsReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceUpdateNotice, setPriceUpdateNotice] = useState<PriceUpdateNotice | null>(
    null,
  );
  const refreshTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const phase: PriceLockPhase = getPriceLockPhase(
    isPriceReady,
    timerSeconds,
    isRefreshing,
  );

  const dismissPriceNotice = useCallback(() => {
    setPriceUpdateNotice(null);
  }, []);

  useEffect(() => {
    const priceTimer = window.setTimeout(
      () => setIsPriceReady(true),
      GOLD_PRICING.priceFetchMs,
    );
    const couponsTimer = window.setTimeout(
      () => setAreCouponsReady(true),
      GOLD_PRICING.couponsFetchMs,
    );

    return () => {
      window.clearTimeout(priceTimer);
      window.clearTimeout(couponsTimer);
    };
  }, []);

  useEffect(() => {
    if (!isPriceReady || isRefreshing) return;

    const interval = window.setInterval(() => {
      setTimerSeconds((value) => {
        if (value > 0) return value - 1;

        setIsRefreshing(true);
        setPricePerGm((current) => {
          const next = fluctuateGoldPrice(current);
          const notice: PriceUpdateNotice = {
            previousPrice: current,
            nextPrice: next,
            delta: Number((next - current).toFixed(2)),
          };
          setPriceUpdateNotice(notice);

          if (toastTimeoutRef.current) {
            window.clearTimeout(toastTimeoutRef.current);
          }
          toastTimeoutRef.current = window.setTimeout(() => {
            setPriceUpdateNotice(null);
          }, 3200);

          return next;
        });

        if (refreshTimeoutRef.current) {
          window.clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = window.setTimeout(() => {
          setIsRefreshing(false);
          setTimerSeconds(GOLD_PRICING.lockDurationSeconds);
        }, GOLD_PRICING.refreshDurationMs);

        return value;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPriceReady, isRefreshing]);

  useEffect(
    () => () => {
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  const progressPercent = isPriceReady
    ? (timerSeconds / GOLD_PRICING.lockDurationSeconds) * 100
    : 0;

  return {
    pricePerGm,
    timerSeconds,
    isPriceReady,
    areCouponsReady,
    phase,
    progressPercent,
    priceUpdateNotice,
    dismissPriceNotice,
  };
}
