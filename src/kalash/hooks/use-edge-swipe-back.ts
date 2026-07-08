"use client";

import { useEffect, type RefObject } from "react";

/** iOS-style edge swipe to go back (left 28px, min 80px horizontal travel). */
export function useEdgeSwipeBack(
  containerRef: RefObject<HTMLElement | null>,
  onBack: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const element = containerRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || touch.clientX > 28) return;
      tracking = true;
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = Math.abs(touch.clientY - startY);

      if (deltaX >= 80 && deltaY < 56) {
        onBack();
      }
    };

    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, enabled, onBack]);
}
