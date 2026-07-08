"use client";

import { useEffect, useRef, useState } from "react";
import { KalashAppScreen } from "@/kalash/components/slider/kalash-app-screen";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/**
 * Non-interactive, always-live snapshot of the Kalash app home screen.
 * Renders the real component scaled to fill the card so the thumbnail never
 * drifts from the actual UI. Pointer events are disabled so the parent link
 * still handles clicks.
 */
export function KalashAppPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.max(width / IPHONE_17.width, height / IPHONE_17.height));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-white isolate"
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-0 [&_main]:!rounded-none"
        style={{
          width: IPHONE_17.width,
          height: IPHONE_17.height,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <KalashAppScreen disableActionSheet />
      </div>
    </div>
  );
}
