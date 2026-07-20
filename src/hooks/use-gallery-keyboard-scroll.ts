"use client";

import { useEffect, type RefObject } from "react";

const SCROLL_STEP = 96;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Arrow Up/Down (and Page Up/Down) scroll the gallery panel on desktop,
 * or the window when the gallery is not itself a scroll container.
 */
export function useGalleryKeyboardScroll(
  galleryRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const gallery = galleryRef.current;
      if (!gallery) return;

      const canScrollGallery = gallery.scrollHeight > gallery.clientHeight + 1;
      const scroller: HTMLElement | Window = canScrollGallery ? gallery : window;

      let delta = 0;
      if (event.key === "ArrowDown") delta = SCROLL_STEP;
      else if (event.key === "ArrowUp") delta = -SCROLL_STEP;
      else if (event.key === "PageDown") delta = Math.round(gallery.clientHeight * 0.85);
      else if (event.key === "PageUp") delta = -Math.round(gallery.clientHeight * 0.85);
      else if (event.key === "Home" && canScrollGallery) {
        event.preventDefault();
        gallery.scrollTo({ top: 0, behavior: "smooth" });
        return;
      } else if (event.key === "End" && canScrollGallery) {
        event.preventDefault();
        gallery.scrollTo({ top: gallery.scrollHeight, behavior: "smooth" });
        return;
      } else {
        return;
      }

      // Don't fight embedded scrollable mockups when they hold focus.
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        gallery.contains(active) &&
        active !== gallery &&
        (active.scrollHeight > active.clientHeight + 1 ||
          active.getAttribute("role") === "slider")
      ) {
        return;
      }

      event.preventDefault();

      if (scroller === window) {
        window.scrollBy({ top: delta, behavior: "smooth" });
      } else {
        (scroller as HTMLElement).scrollBy({ top: delta, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryRef]);
}
