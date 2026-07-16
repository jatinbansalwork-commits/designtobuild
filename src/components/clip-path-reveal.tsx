"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Mix of accents so adjacent grid shutters don’t all read as blue. */
const REVEAL_COLORS_BY_SLUG: Record<string, string> = {
  freshprints: "#191960",
  kalash: "#118D82",
  finguard: "#4f46e5",
  saltmine: "#7C3AED",
};

const REVEAL_FALLBACK_COLORS = [
  "#ff7a28", // orange
  "#4f46e5", // indigo
  "#10b981", // emerald
  "#f43f5e", // rose
  "#0ea5e9", // sky
  "#eab308", // yellow
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f97316", // amber-orange
  "#ec4899", // pink
] as const;

function colorForKey(key: string) {
  if (REVEAL_COLORS_BY_SLUG[key]) return REVEAL_COLORS_BY_SLUG[key];

  // Prefer slot index so consecutive cards cycle through the full palette
  const slotMatch = /^slot-(\d+)$/.exec(key);
  if (slotMatch) {
    const index = Number(slotMatch[1]) - 1;
    return REVEAL_FALLBACK_COLORS[index % REVEAL_FALLBACK_COLORS.length];
  }

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return REVEAL_FALLBACK_COLORS[hash % REVEAL_FALLBACK_COLORS.length];
}

interface ClipPathRevealProps {
  children: React.ReactNode;
  colorKey: string;
  className?: string;
}

export function ClipPathReveal({ children, colorKey, className }: ClipPathRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(overlay, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.to(overlay, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 15%",
          // Open on scroll down into view; close again when scrolling back up
          toggleActions: "play reverse play reverse",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [colorKey]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden${className ? ` ${className}` : ""}`}
    >
      {children}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[60] will-change-[clip-path]"
        style={{ backgroundColor: colorForKey(colorKey) }}
        aria-hidden
      />
    </div>
  );
}
