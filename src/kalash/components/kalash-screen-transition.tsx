"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import {
  getKalashScreenVariants,
  getKalashTransition,
  type KalashTransitionKind,
} from "@/kalash/lib/kalash-motion";

interface KalashScreenPresenceProps {
  children: ReactNode;
}

export function KalashScreenPresence({ children }: KalashScreenPresenceProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {children}
    </AnimatePresence>
  );
}

interface KalashScreenTransitionProps {
  screenKey: string;
  direction?: number;
  kind?: KalashTransitionKind;
  className?: string;
  children: ReactNode;
}

export function KalashScreenTransition({
  screenKey,
  direction = 1,
  kind = "push",
  className = "absolute inset-0 h-full w-full overflow-hidden bg-white",
  children,
}: KalashScreenTransitionProps) {
  const reducedMotion = useReducedMotion();
  const variants = getKalashScreenVariants(kind, reducedMotion);

  return (
    <motion.div
      key={screenKey}
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={getKalashTransition(reducedMotion, kind)}
      className={className}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
}
