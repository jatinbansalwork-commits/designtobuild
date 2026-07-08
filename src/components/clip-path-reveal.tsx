"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** FinGuard dashboard accent palette — hero indigo, chart orange, security sky */
const REVEAL_COLORS_BY_SLUG: Record<string, string> = {
  kalash: "#118D82",
  finguard: "#4f46e5",
  saltmine: "#4f46e5",
};

const REVEAL_FALLBACK_COLORS = ["#4f46e5", "#ff7a28", "#0ea5e9"] as const;

function colorForKey(key: string) {
  if (REVEAL_COLORS_BY_SLUG[key]) return REVEAL_COLORS_BY_SLUG[key];

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % REVEAL_FALLBACK_COLORS.length;
  }
  return REVEAL_FALLBACK_COLORS[hash];
}

interface ClipPathRevealProps {
  children: React.ReactNode;
  colorKey: string;
}

export function ClipPathReveal({ children, colorKey }: ClipPathRevealProps) {
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
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [colorKey]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
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
