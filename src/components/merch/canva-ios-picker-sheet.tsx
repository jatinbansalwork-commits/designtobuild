"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CANVA_FONT, CANVA_PRIMARY, CANVA_PRIMARY_RGB } from "@/components/merch/merch-tokens";

const PICKER_ROW_HEIGHT = 44;
const PICKER_VISIBLE_ROWS = 3;
const PICKER_TOOLBAR_HEIGHT = 44;
const PICKER_SHEET_HEIGHT = PICKER_TOOLBAR_HEIGHT + PICKER_ROW_HEIGHT * PICKER_VISIBLE_ROWS;
const IOS_EASE = [0.32, 0.72, 0, 1] as const;

function pickerHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

/** Nested iOS wheel picker — sits inside a parent action sheet. */
export function CanvaIosPickerSheet({
  open,
  title,
  value,
  options,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  value: number;
  options: readonly number[];
  onClose: () => void;
  onConfirm: (value: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const lastSnappedRef = useRef(value);
  const [draft, setDraft] = useState(value);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelPadding = PICKER_ROW_HEIGHT * Math.floor(PICKER_VISIBLE_ROWS / 2);

  const setDraftWithHaptic = (next: number, haptic = true) => {
    setDraft((current) => {
      if (haptic && next !== current) pickerHaptic();
      return next;
    });
  };

  useEffect(() => {
    if (!open) return;
    lastSnappedRef.current = value;
    setDraft(value);
    const index = Math.max(0, options.indexOf(value));
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: index * PICKER_ROW_HEIGHT, behavior: "auto" });
    });
  }, [open, options, value]);

  const snapToNearest = () => {
    const el = listRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / PICKER_ROW_HEIGHT);
    const clamped = Math.min(Math.max(index, 0), options.length - 1);
    const next = options[clamped] ?? options[0];
    el.scrollTo({ top: clamped * PICKER_ROW_HEIGHT, behavior: "smooth" });
    if (next !== lastSnappedRef.current) {
      lastSnappedRef.current = next;
      pickerHaptic();
    }
    setDraft(next);
  };

  const handleScroll = () => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(snapToNearest, 80);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={`Dismiss ${title} picker`}
            className="absolute inset-0 z-[30]"
            style={{ margin: 0, padding: 0, border: "none", backgroundColor: "rgba(36, 49, 61, 0.32)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 z-[40] flex flex-col overflow-hidden"
            style={{
              height: PICKER_SHEET_HEIGHT,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              background: "var(--Background-colorSurface, #FFF)",
              boxShadow: "0 -4px 24px rgba(15, 23, 42, 0.12)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: IOS_EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex shrink-0 items-center justify-between"
              style={{
                height: PICKER_TOOLBAR_HEIGHT,
                padding: "0 16px",
                borderBottom: "1px solid var(--Light-Gray-3, #E8EAED)",
                fontFamily: CANVA_FONT,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: CANVA_PRIMARY,
                  fontSize: 17,
                  fontWeight: 400,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--Typography-colorTypographySecondary, #6B7280)",
                }}
              >
                {title}
              </span>
              <button
                type="button"
                onClick={() => onConfirm(draft)}
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: CANVA_PRIMARY,
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10"
                style={{
                  height: PICKER_ROW_HEIGHT,
                  background: "linear-gradient(to bottom, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                style={{
                  height: PICKER_ROW_HEIGHT,
                  background: "linear-gradient(to top, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y"
                style={{
                  height: PICKER_ROW_HEIGHT,
                  borderColor: "rgba(64, 87, 109, 0.14)",
                  background: `rgba(${CANVA_PRIMARY_RGB}, 0.05)`,
                }}
                aria-hidden
              />
              <div
                ref={listRef}
                className="no-scrollbar h-full overflow-y-auto overscroll-contain"
                style={{
                  scrollSnapType: "y mandatory",
                  WebkitOverflowScrolling: "touch",
                  paddingTop: wheelPadding,
                  paddingBottom: wheelPadding,
                }}
                onScroll={handleScroll}
              >
                {options.map((option) => {
                  const selected = option === draft;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const index = options.indexOf(option);
                        listRef.current?.scrollTo({ top: index * PICKER_ROW_HEIGHT, behavior: "smooth" });
                        lastSnappedRef.current = option;
                        setDraftWithHaptic(option);
                      }}
                      className="flex w-full items-center justify-center transition-[color,font-size] duration-100"
                      style={{
                        height: PICKER_ROW_HEIGHT,
                        margin: 0,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        scrollSnapAlign: "center",
                        fontFamily: '"SF Pro Text", system-ui, sans-serif',
                        fontSize: selected ? 22 : 20,
                        fontWeight: selected ? 500 : 400,
                        color: selected ? "#0E1318" : "rgba(13, 18, 22, 0.38)",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
