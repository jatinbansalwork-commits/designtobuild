"use client";

import { useEffect, useRef, useState } from "react";
import {
  FINGUARD_DESIGN_HEIGHT,
  FINGUARD_DESIGN_WIDTH,
  SaltmineFinGuardDashboard,
} from "@/components/saltmine-finguard-dashboard";

interface SaltmineFinGuardPreviewProps {
  interactive?: boolean;
}

/** Scaled live FinGuard dashboard for portfolio cards and detail modal. */
export function SaltmineFinGuardPreview({
  interactive = false,
}: SaltmineFinGuardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(
        Math.min(width / FINGUARD_DESIGN_WIDTH, height / FINGUARD_DESIGN_HEIGHT),
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
      className={`absolute inset-0 overflow-hidden bg-[#f3f4f6] ${
        interactive ? "" : "pointer-events-none"
      }`}
      aria-hidden={!interactive}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: FINGUARD_DESIGN_WIDTH,
          height: FINGUARD_DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <SaltmineFinGuardDashboard previewScale={scale} />
      </div>
    </div>
  );
}
