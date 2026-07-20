"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  hasShownNightWink,
  markNightWinkShown,
} from "@/lib/easter-eggs";
import { VIEWS_CHANGED_EVENT } from "@/lib/view-events";
import {
  baselineSeedViews,
  dailySeedBonus,
  DAILY_SEED_PER_NIGHT,
  indiaCalendarDate,
} from "@/lib/view-seeds";

const CACHE_KEY = "dtb-total-views-cache";

function formatViewCount(n: number) {
  if (n < 1000) return n.toLocaleString("en-US");
  if (n < 1_000_000) {
    const rounded = Math.round(n / 100) / 10;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }
  const rounded = Math.round(n / 100_000) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}

function readCachedTotal(): number | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeCachedTotal(views: number) {
  try {
    sessionStorage.setItem(CACHE_KEY, String(views));
  } catch {
    // ignore quota / private mode
  }
}

/** Portfolio-wide creative views: project seeds + India nightly seed + live counts. */
export function TotalCreativeViews({ className = "" }: { className?: string }) {
  const seedFallback = baselineSeedViews();
  const [views, setViews] = useState<number | null>(null);
  const [exact, setExact] = useState(false);
  const [nightWink, setNightWink] = useState(false);

  const refresh = useCallback(
    async (opts?: { optimisticBump?: boolean }) => {
      if (opts?.optimisticBump) {
        setViews((current) => {
          const next = (current ?? seedFallback) + 1;
          writeCachedTotal(next);
          return next;
        });
      }

      try {
        const res = await fetch("/api/views/total", { cache: "no-store" });
        if (!res.ok) {
          setViews((current) => current ?? seedFallback);
          return;
        }
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === "number") {
          writeCachedTotal(data.views);
          setViews(data.views);
        }
      } catch {
        setViews((current) => current ?? seedFallback);
      }
    },
    [seedFallback],
  );

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedTotal();
    if (cached != null) {
      queueMicrotask(() => {
        if (!cancelled) setViews(cached);
      });
    }

    // Always fetch a fresh total when the site opens.
    queueMicrotask(() => {
      if (!cancelled) void refresh();
    });

    const onViewsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ counted?: boolean }>).detail;
      void refresh({ optimisticBump: Boolean(detail?.counted) });
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener(VIEWS_CHANGED_EVENT, onViewsChanged);
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener(VIEWS_CHANGED_EVENT, onViewsChanged);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // Night mode wink: after an IST midnight seed lands, whisper once per day.
  useEffect(() => {
    let hideTimer: number | undefined;
    const todayIst = indiaCalendarDate();
    const daily = dailySeedBonus();
    if (daily <= 0 || hasShownNightWink(todayIst)) return;

    queueMicrotask(() => {
      setNightWink(true);
      markNightWinkShown(todayIst);
      hideTimer = window.setTimeout(() => setNightWink(false), 4200);
    });

    return () => window.clearTimeout(hideTimer);
  }, []);

  const display = views ?? seedFallback;
  const exactLabel = display.toLocaleString("en-US");
  const countLabel = exact ? exactLabel : formatViewCount(display);

  return (
    <div className={className}>
      <p
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary"
        title={`${exactLabel} total views across all creatives`}
      >
        <Eye className="size-3.5 opacity-80" strokeWidth={2} aria-hidden />
        <span className="tabular-nums">
          <button
            type="button"
            onClick={() => setExact((value) => !value)}
            aria-pressed={exact}
            aria-label={
              exact
                ? `Hide exact total. Currently ${exactLabel} views`
                : `Show exact total. Currently about ${formatViewCount(display)} views`
            }
            className="font-medium text-text-primary underline-offset-2 transition-colors hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02BCEA] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {countLabel}
          </button>
          <span className="ml-1 text-text-tertiary">total views</span>
        </span>
      </p>
      {nightWink ? (
        <p
          className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#02BCEA]"
          role="status"
        >
          +{DAILY_SEED_PER_NIGHT} from last night
        </p>
      ) : null}
    </div>
  );
}
