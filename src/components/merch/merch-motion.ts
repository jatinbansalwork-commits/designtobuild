import type { WheelEvent } from "react";

/** Freshprints motion — Canva / Figma / Material-inspired: fluid, quiet, never bouncy. */
export const FP_EASE = {
  /** Emphasized decelerate — screens and sheets entering */
  out: [0.22, 1, 0.36, 1] as const,
  /** Standard — height, opacity, small UI */
  inOut: [0.4, 0, 0.2, 1] as const,
  /** Accelerate — exits and dismissals */
  in: [0.4, 0, 1, 1] as const,
  /** iOS-style sheet settle */
  sheet: [0.32, 0.72, 0, 1] as const,
};

export const FP_DURATION = {
  micro: 0.14,
  fast: 0.22,
  base: 0.32,
  slow: 0.42,
  hero: 0.58,
};

export const FP_SPRING = {
  /** Carousel, drag release, product color */
  gesture: { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.9 },
  /** Chips, tiles, taps */
  snappy: { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.85 },
  /** Accordions, compose height, panels */
  soft: { type: "spring" as const, stiffness: 260, damping: 31, mass: 1 },
  /** Bottom sheet present / dismiss */
  sheet: { type: "spring" as const, stiffness: 290, damping: 34, mass: 1.05 },
  /** layoutId, pagination dot */
  layout: { type: "spring" as const, stiffness: 360, damping: 36, mass: 0.8 },
};

/** Framer drag release — maps gesture spring feel to inertia options. */
export const FP_DRAG_TRANSITION = {
  bounceStiffness: 280,
  bounceDamping: 32,
  power: 0.25,
  timeConstant: 180,
};

/** Hero carousel slide + shirt fill — keep in lockstep. */
export const FP_PRODUCT_PREVIEW_TRANSITION = FP_SPRING.gesture;

export const fpOverlayTransition = {
  duration: FP_DURATION.base,
  ease: FP_EASE.out,
};

export const fpSheetPresentTransition = FP_SPRING.sheet;

export const fpSheetHeightTransition = FP_SPRING.soft;

/** Horizontal shared-axis — form ↔ preview ↔ refine (Canva-style). */
export function fpStepVariants(distance = 24) {
  return {
    initial: (direction: number) => ({
      x: direction * distance,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: FP_DURATION.base, ease: FP_EASE.out },
        opacity: { duration: FP_DURATION.fast, ease: FP_EASE.out },
      },
    },
    exit: (direction: number) => ({
      x: direction * -distance * 0.45,
      opacity: 0,
      transition: {
        x: { duration: FP_DURATION.fast, ease: FP_EASE.in },
        opacity: { duration: FP_DURATION.micro, ease: FP_EASE.in },
      },
    }),
  };
}

/** Graphic reveal after generation — soft scale settle. */
export const fpReveal = {
  initial: { opacity: 0, scale: 0.965 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: FP_DURATION.slow, ease: FP_EASE.out },
      scale: { duration: FP_DURATION.hero, ease: FP_EASE.out },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: FP_DURATION.fast, ease: FP_EASE.in },
  },
};

export const fpFadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: FP_DURATION.base, ease: FP_EASE.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: FP_DURATION.fast, ease: FP_EASE.in },
  },
};

export const fpStagger = {
  animate: { transition: { staggerChildren: 0.042, delayChildren: 0.028 } },
};

export const fpStaggerItem = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: FP_DURATION.base, ease: FP_EASE.out },
  },
};

/** Chrome collapse — header / footer when entering compose. */
export const fpChromeCollapse = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: {
      opacity: { duration: FP_DURATION.fast, ease: FP_EASE.out },
      height: fpSheetHeightTransition,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      opacity: { duration: FP_DURATION.micro, ease: FP_EASE.in },
      height: { duration: FP_DURATION.fast, ease: FP_EASE.in },
    },
  },
};

/** Keep wheel/trackpad scroll inside nested sheet regions (portfolio phone mockup). */
export function fpContainSheetWheel(event: WheelEvent<HTMLElement>) {
  const el = event.currentTarget;
  if (el.scrollHeight <= el.clientHeight + 1) return;
  const { deltaY } = event;
  const atTop = el.scrollTop <= 0;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
    event.stopPropagation();
  }
}

export const FP_SHEET_SCROLL_CLASS =
  "no-scrollbar h-full min-h-0 overflow-y-auto overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch]";
