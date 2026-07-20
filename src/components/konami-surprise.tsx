"use client";

import { useEffect } from "react";
import { KONAMI_SEQUENCE, showEasterToast } from "@/lib/easter-eggs";
import { playShutterTick } from "@/lib/shutter-tick";

function surpriseMe() {
  const cards = [
    ...document.querySelectorAll<HTMLElement>(".variant-project-card"),
  ];
  if (cards.length === 0) return;

  const pick = cards[Math.floor(Math.random() * cards.length)];
  const scroller =
    pick.closest<HTMLElement>(".variant-gallery-scroll") ??
    document.scrollingElement;

  pick.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  pick.classList.add("ring-2", "ring-[#02BCEA]", "ring-offset-2", "ring-offset-surface");
  window.setTimeout(() => {
    pick.classList.remove("ring-2", "ring-[#02BCEA]", "ring-offset-2", "ring-offset-surface");
  }, 1600);

  playShutterTick(0.1);
  showEasterToast("Surprise me");

  // Keep focus sensible if the scroll host is the gallery panel.
  if (scroller instanceof HTMLElement && scroller.classList.contains("variant-gallery-scroll")) {
    scroller.focus?.({ preventScroll: true });
  }
}

/** ↑↑↓↓←→←→BA jumps to a random project in the archive. */
export function KonamiSurprise() {
  useEffect(() => {
    let index = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[index];
      const expectedKey =
        expected.length === 1 ? expected.toLowerCase() : expected;

      if (key === expectedKey) {
        index += 1;
        if (index === KONAMI_SEQUENCE.length) {
          index = 0;
          surpriseMe();
        }
        return;
      }

      // Allow restarting mid-sequence if the first key matches again.
      index = key === (KONAMI_SEQUENCE[0].length === 1
        ? KONAMI_SEQUENCE[0].toLowerCase()
        : KONAMI_SEQUENCE[0])
        ? 1
        : 0;
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
