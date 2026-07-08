"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { KALASH_TEAL } from "@/kalash/components/slider/kalash/kalash-tokens";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import {
  formatInr,
  formatPriceTimer,
  GOLD_PRICING,
  type GoldQuote,
  type PriceLockPhase,
} from "@/kalash/lib/gold-pricing";
import { getKalashOverlayTransition, getKalashSheetTransition } from "@/kalash/lib/kalash-motion";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

interface BreakdownSheetProps {
  open: boolean;
  onClose: () => void;
  quote: GoldQuote;
  timerSeconds: number;
  phase: PriceLockPhase;
}

function BreakdownRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[14px] leading-[20px] text-[#637381]">{label}</span>
      <span
        className={`kalash-tabular text-right text-[14px] leading-[20px] ${
          emphasize ? "font-semibold text-[#212B36]" : "font-medium text-[#212B36]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function BreakdownSheet({
  open,
  onClose,
  quote,
  timerSeconds,
  phase,
}: BreakdownSheetProps) {
  const reducedMotion = useReducedMotion();
  const { space } = KALASH_VIEW;

  const lockLabel =
    phase === "refreshing"
      ? "Updating live price…"
      : phase === "expiring"
        ? `Price lock expiring · ${formatPriceTimer(timerSeconds)}`
        : `Price locked · ${formatPriceTimer(timerSeconds)}`;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-40 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={getKalashOverlayTransition(reducedMotion)}
        >
          <button
            type="button"
            aria-label="Close breakdown"
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Payment breakdown"
            className="relative z-10 w-full rounded-t-2xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.14)]"
            style={{ paddingBottom: space.safeAreaBottom }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={getKalashSheetTransition(reducedMotion)}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex flex-col"
              style={{ paddingInline: space.headerGutterX, paddingTop: 20 }}
            >
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold leading-[24px] tracking-tight text-[#212B36]">
                  Payment breakdown
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className={`inline-flex size-9 items-center justify-center rounded-full text-[#637381] hover:bg-neutral-100 ${FOCUS_RING}`}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <p className="text-[12px] font-medium leading-[14px] text-[#ee4d37]">{lockLabel}</p>

              <div className="mt-2 divide-y divide-neutral-200/80">
                <BreakdownRow
                  label="Gold weight"
                  value={`${quote.displayGrams.toFixed(4)} gm`}
                />
                <BreakdownRow
                  label="Live buy rate"
                  value={`₹ ${formatInr(quote.pricePerGm)}/gm`}
                />
                <BreakdownRow
                  label="Gold value (excl. GST)"
                  value={`₹ ${formatInr(quote.baseAmount)}`}
                />
                <BreakdownRow
                  label={`GST (${(GOLD_PRICING.gstRate * 100).toFixed(0)}%)`}
                  value={`₹ ${formatInr(quote.gstAmount)}`}
                />
                <BreakdownRow
                  label="You pay"
                  value={`₹ ${formatInr(quote.displayRupees)}`}
                  emphasize
                />
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-[#919eab]">
                Rate sourced from live market feed. Total may adjust when the lock
                refreshes every 2 minutes.
              </p>

              <button
                type="button"
                onClick={onClose}
                className={`mt-5 flex h-12 w-full items-center justify-center rounded-full text-[15px] font-semibold leading-[20px] text-white ${FOCUS_RING}`}
                style={{ backgroundColor: KALASH_TEAL }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
