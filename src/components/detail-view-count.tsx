"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { notifyViewsChanged } from "@/lib/view-events";

const CACHE_PREFIX = "dtb-views-cache:";

function formatViewCount(n: number) {
  if (n < 1000) return n.toLocaleString("en-US");
  if (n < 1_000_000) {
    const rounded = Math.round(n / 100) / 10;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }
  const rounded = Math.round(n / 100_000) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}

function readCachedViews(slug: string): number | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${slug}`);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeCachedViews(slug: string, views: number) {
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${slug}`, String(views));
  } catch {
    // ignore quota / private mode
  }
}

interface DetailViewCountProps {
  slug: string;
  /** When true (popup), records a visit. Cards should pass false. */
  record?: boolean;
  /** Eye + number only — for home / grid cards. */
  compact?: boolean;
  className?: string;
}

/** Instagram / Dribbble-style view count — wait for live total; never flash seed then jump. */
function DetailViewCountInner({
  slug,
  record = true,
  compact = false,
  className = "",
}: DetailViewCountProps) {
  const [views, setViews] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const viewedKey = `dtb-viewed:${slug}`;

    const cached = readCachedViews(slug);
    if (cached != null) {
      queueMicrotask(() => {
        if (!cancelled) {
          setViews(cached);
          setReady(true);
        }
      });
    } else {
      queueMicrotask(() => {
        if (!cancelled) {
          setViews(null);
          setReady(false);
        }
      });
    }

    const run = async () => {
      try {
        const already = sessionStorage.getItem(viewedKey) === "1";
        const shouldRecord = record && !already;
        if (shouldRecord) sessionStorage.setItem(viewedKey, "1");

        const res = await fetch(`/api/views/${encodeURIComponent(slug)}`, {
          method: shouldRecord ? "POST" : "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          if (shouldRecord) sessionStorage.removeItem(viewedKey);
          if (!cancelled) setReady(true);
          return;
        }
        const data = (await res.json()) as { views?: number; counted?: boolean };
        if (typeof data.views === "number" && !cancelled) {
          writeCachedViews(slug, data.views);
          setViews(data.views);
          setReady(true);
          if (shouldRecord && data.counted) {
            notifyViewsChanged({ slug, counted: true });
          }
        }
      } catch {
        if (!cancelled) setReady(true);
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

  if (!ready || views == null) {
    return (
      <span className={baseClass} aria-hidden>
        <Eye className="size-3.5 opacity-70" strokeWidth={2} />
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
      <Eye className="size-3.5 opacity-80" strokeWidth={2} aria-hidden />
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

export function DetailViewCount(props: DetailViewCountProps) {
  return <DetailViewCountInner key={props.slug} {...props} />;
}
