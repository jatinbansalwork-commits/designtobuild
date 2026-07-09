"use client";

import { useEffect, useRef, useState } from "react";
import { MerchUserFirstView } from "@/components/merch-user-first-view";
import { MERCH_HEIGHT, MERCH_WIDTH } from "@/components/merch/merch-tokens";

/** Scaled merch designer screen for portfolio cards and detail modal. */
export function MerchDesignPreview({
  interactive = false,
  onImageAiSheetOpenChange,
}: {
  interactive?: boolean;
  onImageAiSheetOpenChange?: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      const next = Math.min(width / MERCH_WIDTH, height / MERCH_HEIGHT);
      setScale((prev) => (Math.abs(prev - next) < 0.0005 ? prev : next));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-x-visible overflow-y-hidden bg-white isolate ${
        interactive ? "" : "pointer-events-none"
      }`}
      aria-hidden={!interactive}
    >
      <div
        className="absolute left-1/2 top-1/2 overflow-x-visible overflow-y-hidden"
        style={{
          width: MERCH_WIDTH,
          height: MERCH_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <MerchUserFirstView
          interactive={interactive}
          onImageAiSheetOpenChange={onImageAiSheetOpenChange}
        />
      </div>
    </div>
  );
}
