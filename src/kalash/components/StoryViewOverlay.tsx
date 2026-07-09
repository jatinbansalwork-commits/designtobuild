"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { StoryViewContent } from "@/kalash/components/StoryViewContent";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import {
  FLASHBACK_STORIES,
  FLASHBACK_STORY_COUNT,
  STORY_TEXT_AFTER_TIMER_GAP_PX,
  STORY_TIMER_BOTTOM_OFFSET_PX,
} from "@/kalash/lib/flashback-stories";

const STORY_COUNT = FLASHBACK_STORY_COUNT;
const STORY_DURATION_MS = 5000;

export { STORY_COUNT, STORY_DURATION_MS };

const STORY_LOGO_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Vector.svg";
const STORY_CLOSE_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-mingcute_close-line.svg";

interface StoryViewOverlayProps {
  open: boolean;
  onClose: () => void;
  /** 0-based story screen — used by dev routes to pin a timer frame. */
  initialStoryIndex?: number;
  /** When false, timer stays on `initialStoryIndex` (dev preview). */
  autoAdvance?: boolean;
}

/** Instagram Stories–style flashback overlay inside the mobile prototype shell. */
export function StoryViewOverlay({
  open,
  onClose,
  initialStoryIndex = 0,
  autoAdvance = true,
}: StoryViewOverlayProps) {
  const reducedMotion = useReducedMotion();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);

  const resetAndClose = useCallback(() => {
    setCurrentStoryIndex(initialStoryIndex);
    onClose();
  }, [initialStoryIndex, onClose]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setCurrentStoryIndex(initialStoryIndex));
      return;
    }

    queueMicrotask(() => setCurrentStoryIndex(initialStoryIndex));
  }, [open, initialStoryIndex]);

  useEffect(() => {
    if (!open || !autoAdvance) return;

    const timer = window.setInterval(() => {
      setCurrentStoryIndex((prev) => {
        const next = prev + 1;
        if (next >= STORY_COUNT) {
          window.setTimeout(resetAndClose, 0);
          return prev;
        }
        return next;
      });
    }, STORY_DURATION_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [open, autoAdvance, resetAndClose]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    if (info.offset.y > 80 || info.velocity.y > 400) {
      resetAndClose();
    }
  };

  const activeStory =
    FLASHBACK_STORIES[
      Math.min(Math.max(currentStoryIndex, 0), STORY_COUNT - 1)
    ];
  const isBelowTimerLayout = activeStory.layout === "below-timer";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Flashback 2024 story"
          className="absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-[#fffbf4] via-[#ffeeda] to-[#ffd085] select-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 28, stiffness: 320 }
          }
          drag={reducedMotion ? false : "y"}
          dragConstraints={{ top: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
        >
          <div className="absolute inset-x-0 top-10 z-50 flex flex-col px-4 pt-3">
            <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center pb-4 text-[#212B36]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STORY_LOGO_SRC}
                alt=""
                className="h-8 w-auto justify-self-start object-contain"
                aria-hidden
              />
              <span className="justify-self-center font-sans text-base font-bold leading-6 tracking-wider">
                FLASHBACK &apos;24
              </span>
              <button
                type="button"
                aria-label="Close story"
                className="flex size-8 cursor-pointer items-center justify-center justify-self-end"
                onClick={resetAndClose}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={STORY_CLOSE_ICON_SRC}
                  alt=""
                  className="size-5 object-contain"
                  aria-hidden
                />
              </button>
            </div>

            <div
              className="grid w-full gap-1"
              style={{
                gridTemplateColumns: `repeat(${STORY_COUNT}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: STORY_COUNT }, (_, index) => {
              const isComplete = index < currentStoryIndex;
              const isActive = index === currentStoryIndex;

              return (
                <div
                  key={index}
                  className="relative h-1 overflow-hidden rounded-full bg-[#118D82]/20"
                  aria-hidden
                >
                  {isComplete ? (
                    <span className="absolute inset-0 rounded-full bg-[#118D82]" />
                  ) : null}
                  {isActive ? (
                    autoAdvance ? (
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full bg-[#118D82]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                duration: STORY_DURATION_MS / 1000,
                                ease: "linear",
                              }
                        }
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-[#118D82]" />
                    )
                  ) : null}
                </div>
              );
              })}
            </div>
          </div>

          <div
            className={`relative flex w-full flex-1 flex-col items-center px-6 ${isBelowTimerLayout ? "justify-start" : "justify-center"}`}
            style={
              isBelowTimerLayout
                ? {
                    paddingTop:
                      STORY_TIMER_BOTTOM_OFFSET_PX +
                      STORY_TEXT_AFTER_TIMER_GAP_PX,
                  }
                : undefined
            }
          >
            <AnimatePresence mode="wait">
              <StoryViewContent key={activeStory.id} story={activeStory} />
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 font-sans text-base font-semibold leading-6 tracking-wide text-[#212B36] transition-opacity hover:opacity-80"
          >
            Share
            <ChevronRight className="size-6" strokeWidth={2.5} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
