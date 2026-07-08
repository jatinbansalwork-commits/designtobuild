"use client";

import { motion, type Transition } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";

const WAVE_COMPRESSED_STEP_PX = 4;
const WAVE_EXPANDED_STEP_PX = 12;
const WAVE_DURATION_S = 2.2;
const CHAR_STAGGER_DELAY_S = 0.22;
const WAVE_EASE: [number, number, number, number] = [0.45, 0, 0.55, 1];

const LAYER_TOKENS = [
  { color: "#01656B", depth: 0 },
  { color: "#FFFFFF", depth: 1 },
  { color: "#FFD979", depth: 2 },
  { color: "#F79780", depth: 3 },
  { color: "#01656B", depth: 4 },
] as const;

function getCompressedY(reverseLayerIndex: number) {
  return (reverseLayerIndex + 1) * WAVE_COMPRESSED_STEP_PX;
}

function getExpandedY(reverseLayerIndex: number) {
  return (reverseLayerIndex + 1) * WAVE_EXPANDED_STEP_PX;
}

function getWaveTransition(charIndex: number): Transition {
  return {
    duration: WAVE_DURATION_S,
    ease: WAVE_EASE,
    repeat: Infinity,
    delay: charIndex * CHAR_STAGGER_DELAY_S,
  };
}

interface RetroAnimatedTextProps {
  text?: string;
  className?: string;
}

/** Per-character layered retro typography with staggered accordion wave motion. */
export function RetroAnimatedText({
  text = "2024",
  className = "",
}: RetroAnimatedTextProps) {
  const reducedMotion = useReducedMotion();
  const characters = useMemo(() => [...text], [text]);

  return (
    <div
      className={`relative flex h-60 w-full select-none items-center justify-center ${className}`}
      aria-hidden
    >
      <div
        className="relative flex items-center justify-center gap-0 text-[128px] font-black leading-none tracking-tighter"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {characters.map((char, charIndex) => (
          <div
            key={`${char}-${charIndex}`}
            className="relative flex h-full w-[1ch] items-center justify-center"
          >
            {[...LAYER_TOKENS].reverse().map((layer, layerIndex) => {
              const reverseLayerIndex = LAYER_TOKENS.length - 1 - layerIndex;
              const isTopLayer = reverseLayerIndex === 0;
              const compressedY = getCompressedY(reverseLayerIndex);
              const expandedY = getExpandedY(reverseLayerIndex);

              return (
                <motion.span
                  key={layer.depth}
                  className="block font-black uppercase"
                  style={{
                    position: isTopLayer ? "relative" : "absolute",
                    top: isTopLayer ? undefined : 0,
                    left: isTopLayer ? undefined : 0,
                    zIndex: LAYER_TOKENS.length - reverseLayerIndex,
                    color: layer.color,
                  }}
                  animate={
                    reducedMotion
                      ? { y: compressedY }
                      : {
                          y: [compressedY, expandedY, compressedY],
                        }
                  }
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : getWaveTransition(charIndex)
                  }
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
