"use client";

import type { ReactNode } from "react";
import { AppHomeIndicator } from "@/kalash/components/AppHomeIndicator";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

/** @deprecated Use IPHONE_17 — kept for existing imports */
export const KALASH_MOBILE_WIDTH = IPHONE_17.width;
export const KALASH_MOBILE_HEIGHT = IPHONE_17.height;
export const IPHONE_BEZEL_RADIUS_PX = IPHONE_17.bezelRadiusPx;
export const IPHONE_SCREEN_RADIUS_PX = IPHONE_17.screenRadiusPx;

export type KalashShellMode = "immersive" | "app";

interface KalashMobilePrototypeShellProps {
  children: ReactNode;
  mode?: KalashShellMode;
  footer?: ReactNode;
  overlay?: ReactNode;
  homeIndicator?: ReactNode;
  /** Show default iPhone 17 home indicator bar (app mode default: true) */
  showHomeIndicator?: boolean;
}

export function KalashMobilePrototypeShell({
  children,
  mode = "immersive",
  footer,
  overlay,
  homeIndicator,
  showHomeIndicator,
}: KalashMobilePrototypeShellProps) {
  const isApp = mode === "app";
  const bezelRadius = `${IPHONE_17.bezelRadiusPx}px`;
  const screenRadius = `${IPHONE_17.screenRadiusPx}px`;
  const borderWidth = `${IPHONE_17.borderWidthPx}px`;
  const island = IPHONE_17.dynamicIsland;
  const resolvedHomeIndicator =
    homeIndicator ??
    ((showHomeIndicator ?? isApp) ? <AppHomeIndicator /> : null);

  return (
    <div className="relative flex h-full w-full min-h-0 items-stretch justify-center antialiased selection:bg-teal-500 selection:text-white">
      <div
        className="relative h-full w-full min-h-0"
        style={{
          borderRadius: bezelRadius,
          filter: "drop-shadow(0 32px 64px rgba(0, 0, 0, 0.45))",
        }}
      >
        <div
          className={`relative flex h-full w-full min-h-0 flex-col overflow-hidden border-solid border-neutral-900 ${isApp ? "bg-white" : "bg-black"}`}
          style={{
            borderRadius: bezelRadius,
            borderWidth,
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
        <div
          className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black"
          style={{
            top: island.topPx,
            width: island.widthPx,
            height: island.heightPx,
          }}
          aria-hidden
        />

        <div
          className={
            isApp
              ? "flex min-h-0 flex-1 flex-col overflow-hidden"
              : "relative flex min-h-0 flex-1 flex-col overflow-hidden"
          }
          style={{ borderRadius: screenRadius }}
        >
          {isApp ? (
            <div
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
              style={{ borderRadius: screenRadius }}
            >
              <div
                className="no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
                style={{ borderRadius: screenRadius }}
              >
                <div className="h-full w-full max-w-full overflow-hidden" style={{ borderRadius: screenRadius }}>
                  {children}
                </div>
              </div>
              {overlay}
            </div>
          ) : (
            <div
              className="relative min-h-0 flex-1 overflow-hidden"
              style={{ borderRadius: screenRadius }}
            >
              {children}
            </div>
          )}
        </div>

        {footer}

        {resolvedHomeIndicator ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60]">
            {resolvedHomeIndicator}
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
}
