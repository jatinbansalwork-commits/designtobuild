import type { Transition, Variants } from "framer-motion";

export type KalashTransitionKind = "push" | "fade" | "launch";

/** iOS-like ease — fast start, gentle settle */
export const KALASH_IOS_EASE = [0.32, 0.72, 0, 1] as const;

export function getKalashTransition(
  reducedMotion: boolean,
  kind: KalashTransitionKind = "push",
): Transition {
  if (reducedMotion) return { duration: 0 };

  if (kind === "fade") {
    return { duration: 0.36, ease: KALASH_IOS_EASE };
  }

  return {
    type: "spring",
    damping: 31,
    stiffness: 320,
    mass: 0.86,
  };
}

export function getKalashScreenVariants(
  kind: KalashTransitionKind,
  reducedMotion: boolean,
): Variants {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    };
  }

  switch (kind) {
    case "push":
      return {
        initial: (direction: number) => ({
          x: direction >= 0 ? "100%" : "-30%",
          opacity: direction >= 0 ? 1 : 0.9,
        }),
        animate: {
          x: 0,
          opacity: 1,
          transition: getKalashTransition(false, "push"),
        },
        exit: (direction: number) => ({
          x: direction >= 0 ? "-30%" : "100%",
          opacity: direction >= 0 ? 0.9 : 1,
          transition: getKalashTransition(false, "push"),
        }),
      };
    case "launch":
      return {
        initial: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
        animate: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.42, ease: KALASH_IOS_EASE },
        },
        exit: {
          opacity: 0,
          scale: 1.03,
          filter: "blur(4px)",
          transition: { duration: 0.28, ease: KALASH_IOS_EASE },
        },
      };
    case "fade":
    default:
      return {
        initial: { opacity: 0, y: 6 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.36, ease: KALASH_IOS_EASE },
        },
        exit: {
          opacity: 0,
          y: -4,
          transition: { duration: 0.24, ease: KALASH_IOS_EASE },
        },
      };
  }
}

export function getKalashOverlayTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return { duration: 0.28, ease: KALASH_IOS_EASE };
}

export function getKalashSheetTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return {
    type: "spring",
    damping: 34,
    stiffness: 360,
    mass: 0.82,
  };
}
