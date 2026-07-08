"use client";

import { useEffect, useRef, useState } from "react";
import {
  SaveMoreScreen,
  SAVE_SCREEN_DEFAULT_AMOUNT,
} from "@/kalash/components/save-more-screen";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** Non-interactive live preview of the Kalash buy-gold screen for portfolio cards. */
export function KalashSaveMorePreview() {
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
        <SaveMoreScreen initialAmount={SAVE_SCREEN_DEFAULT_AMOUNT} />
      </div>
    </div>
  );
}
