"use client";

import type { CSSProperties } from "react";

const DEFAULT_RING_STYLE: CSSProperties = {
  top: "5.9%",
  left: "3.9%",
  width: "12.2%",
};

interface KalashStoryRingProps {
  style?: CSSProperties;
}

export function KalashStoryRing({ style = DEFAULT_RING_STYLE }: KalashStoryRingProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 aspect-square"
      style={style}
      aria-hidden
    >
      <div className="h-full w-full">
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="none"
            stroke="#118d82"
            strokeWidth="2.4"
            strokeDasharray="11 7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-60" aria-hidden>
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <circle
            cx="24"
            cy="24"
            r="19.5"
            fill="none"
            stroke="#45d4c5"
            strokeWidth="1.8"
            strokeDasharray="7 9"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
