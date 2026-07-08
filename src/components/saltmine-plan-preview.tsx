"use client";

import { useEffect, useRef, useState } from "react";
import {
  SALTMINE_PLAN_HEIGHT,
  SALTMINE_PLAN_WIDTH,
  SaltminePlanParticulars,
} from "@/components/saltmine-plan-particulars";

interface SaltminePlanPreviewProps {
  interactive?: boolean;
}

/** Scaled live Saltmine Plan Particulars UI for portfolio cards and detail modal. */
export function SaltminePlanPreview({
  interactive = false,
}: SaltminePlanPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(
        Math.min(width / SALTMINE_PLAN_WIDTH, height / SALTMINE_PLAN_HEIGHT),
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden bg-white ${
        interactive ? "" : "pointer-events-none"
      }`}
      aria-hidden={!interactive}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: SALTMINE_PLAN_WIDTH,
          height: SALTMINE_PLAN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <SaltminePlanParticulars />
      </div>
    </div>
  );
}
