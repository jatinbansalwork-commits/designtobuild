"use client";

import { KalashIphoneHomeLayout } from "@/kalash/components/slider/kalash-iphone-home-layout";
import {
  KALASH_MOBILE_HEIGHT,
  KALASH_MOBILE_WIDTH,
} from "@/kalash/components/slider/kalash-mobile-prototype-shell";

/** Full Kalash iOS flow — home screen → splash → app dashboard. */
export function KalashPrototypePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <div
        className="shrink-0 shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
        style={{ width: KALASH_MOBILE_WIDTH, height: KALASH_MOBILE_HEIGHT }}
      >
        <KalashIphoneHomeLayout />
      </div>
    </main>
  );
}
