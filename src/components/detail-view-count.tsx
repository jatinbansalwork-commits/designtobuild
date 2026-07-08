"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/** Seed baselines — kept in sync with `/api/views/[slug]`. */
const VIEW_SEEDS: Record<string, number> = {
  kalash: 89,
  finguard: 150,
  saltmine: 322,
};

function formatViewCount(n: number) {
  if (n < 1000) return n.toLocaleString("en-US");
  if (n < 1_000_000) {
    const rounded = Math.round(n / 100) / 10;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }
  const rounded = Math.round(n / 100_000) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}

interface DetailViewCountProps {
  slug: string;
  /** When true (popup), records a visit. Cards should pass false. */
  record?: boolean;
  /** Eye + number only — for home / grid cards. */
  compact?: boolean;
  className?: string;
}

/** Instagram / Dribbble-style view count. */
export function DetailViewCount({
  slug,
  record = true,
  compact = false,
  className = "",
}: DetailViewCountProps) {
  const [views, setViews] = useState<number | null>(VIEW_SEEDS[slug] ?? null);

  useEffect(() => {
    let cancelled = false;
    const storageKey = `dtb-viewed:${slug}`;

    const run = async () => {
      try {
        const already = sessionStorage.getItem(storageKey) === "1";
        const shouldRecord = record && !already;
        if (shouldRecord) sessionStorage.setItem(storageKey, "1");

        const res = await fetch(`/api/views/${encodeURIComponent(slug)}`, {
          method: shouldRecord ? "POST" : "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          if (shouldRecord) sessionStorage.removeItem(storageKey);
          return;
        }
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === "number" && !cancelled) {
          setViews(data.views);
        }
      } catch {
        // Silent — view chrome is optional.
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [slug, record]);

  const baseClass = compact
    ? `inline-flex items-center gap-1 text-[12px] text-text-tertiary ${className}`
    : `inline-flex items-center gap-1.5 text-[13px] text-text-tertiary ${className}`;

  if (views == null) {
    return (
      <span className={baseClass} aria-hidden>
        <Eye className={compact ? "size-3.5 opacity-70" : "size-3.5 opacity-70"} strokeWidth={2} />
        <span
          className={`animate-pulse rounded bg-text-tertiary/20 ${
            compact ? "h-2.5 w-6" : "h-3 w-8"
          }`}
        />
      </span>
    );
  }

  return (
    <span
      className={baseClass}
      title={`${views.toLocaleString("en-US")} views`}
    >
      <Eye
        className={compact ? "size-3.5 opacity-80" : "size-3.5 opacity-80"}
        strokeWidth={2}
        aria-hidden
      />
      <span className="tabular-nums text-text-secondary">
        {formatViewCount(views)}
        {compact ? null : (
          <span className="ml-1 text-text-tertiary">
            {views === 1 ? "view" : "views"}
          </span>
        )}
      </span>
    </span>
  );
}
