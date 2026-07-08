import { FLASHBACK_STORY_COUNT } from "@/kalash/lib/flashback-stories";

export const KALASH_STORY_COUNT = FLASHBACK_STORY_COUNT;

export type KalashDevScreen = "home" | "splash" | "app";

function readSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

/** `?slide=N` — jump the deck to a specific slide on load (0-based index). */
export function getDevSlideIndex(frameCount: number): number | null {
  const raw = readSearchParam("slide");
  if (raw === null) return null;

  const index = Number.parseInt(raw, 10);
  if (!Number.isFinite(index)) return null;

  return Math.min(Math.max(index, 0), frameCount - 1);
}

/** `?kalash=app` — open Kalash directly on home, splash, or app screen. */
export function getKalashDevScreen(): KalashDevScreen | null {
  const raw = readSearchParam("kalash");
  if (raw === "home" || raw === "splash" || raw === "app") {
    return raw;
  }
  return null;
}

/** `?story=1` — open flashback overlay on the story screen (1-based). */
export function getDevStoryIndex(): number | null {
  const raw = readSearchParam("story");
  if (raw === null) return null;

  const index = Number.parseInt(raw, 10);
  if (!Number.isFinite(index) || index < 1 || index > KALASH_STORY_COUNT) {
    return null;
  }

  return index - 1;
}

export function getDevStoryPath(storyNumber: number): string {
  return `/dev/kalash-story/${storyNumber}`;
}
