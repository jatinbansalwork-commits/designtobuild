"use client";

import { StoryViewOverlay } from "@/kalash/components/StoryViewOverlay";
import {
  KalashMobilePrototypeShell,
  KALASH_MOBILE_HEIGHT,
  KALASH_MOBILE_WIDTH,
} from "@/kalash/components/slider/kalash-mobile-prototype-shell";

interface KalashStoryDevViewProps {
  /** 0-based index into the flashback story screens. */
  storyIndex: number;
}

/** Isolated flashback story frame — pinned timer, no auto-advance. */
export function KalashStoryDevView({ storyIndex }: KalashStoryDevViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div
        className="shrink-0"
        style={{ width: KALASH_MOBILE_WIDTH, height: KALASH_MOBILE_HEIGHT }}
      >
        <KalashMobilePrototypeShell mode="app">
          <div className="relative h-full min-h-0 w-full">
            <StoryViewOverlay
              open
              onClose={() => {}}
              initialStoryIndex={storyIndex}
              autoAdvance={false}
            />
          </div>
        </KalashMobilePrototypeShell>
      </div>
    </div>
  );
}
