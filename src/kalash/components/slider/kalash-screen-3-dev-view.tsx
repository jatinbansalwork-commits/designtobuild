"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { KalashAppScreen } from "@/kalash/components/slider/kalash-app-screen";
import {
  KalashMobilePrototypeShell,
  KALASH_MOBILE_HEIGHT,
  KALASH_MOBILE_WIDTH,
} from "@/kalash/components/slider/kalash-mobile-prototype-shell";
import { KALASH_STORY_COUNT } from "@/kalash/lib/kalash-dev";

function KalashScreen3DevViewInner() {
  const searchParams = useSearchParams();
  const storyParam = searchParams.get("story");

  const storyIndex = useMemo(() => {
    if (storyParam === null) return null;

    const parsed = Number.parseInt(storyParam, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > KALASH_STORY_COUNT) {
      return null;
    }

    return parsed - 1;
  }, [storyParam]);

  const storyDevMode = storyIndex !== null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div
        className="shrink-0"
        style={{ width: KALASH_MOBILE_WIDTH, height: KALASH_MOBILE_HEIGHT }}
      >
        <KalashMobilePrototypeShell mode="app">
          <KalashAppScreen
            initialStoryOpen={storyDevMode}
            initialStoryIndex={storyIndex ?? 0}
            storyAutoAdvance={!storyDevMode}
            disableActionSheet={storyDevMode}
          />
        </KalashMobilePrototypeShell>
      </div>
    </div>
  );
}

/** Isolated screen 3 — no deck, home screen, or splash. */
export function KalashScreen3DevView() {
  return (
    <Suspense fallback={null}>
      <KalashScreen3DevViewInner />
    </Suspense>
  );
}
