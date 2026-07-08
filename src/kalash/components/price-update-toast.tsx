"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatInr, type PriceUpdateNotice } from "@/kalash/lib/gold-pricing";
import { KALASH_IOS_EASE } from "@/kalash/lib/kalash-motion";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";

interface PriceUpdateToastProps {
  notice: PriceUpdateNotice | null;
}

export function PriceUpdateToast({ notice }: PriceUpdateToastProps) {
  const reducedMotion = useReducedMotion();

  const deltaLabel =
    notice && notice.delta !== 0
      ? `${notice.delta > 0 ? "+" : "−"}₹${formatInr(Math.abs(notice.delta))}`
      : null;

  return (
    <AnimatePresence>
      {notice ? (
        <motion.div
          className="pointer-events-none absolute inset-x-4 bottom-[calc(100%+8px)] z-20 flex justify-center"
          initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.28, ease: KALASH_IOS_EASE }}
        >
          <div className="rounded-full bg-[#212B36] px-4 py-2 text-center shadow-lg">
            <p className="text-[12px] font-medium text-white">
              Price updated
              {deltaLabel ? (
                <>
                  {" "}
                  <span className="kalash-tabular font-semibold text-[#FFBEB1]">
                    {deltaLabel}/gm
                  </span>
                </>
              ) : null}
            </p>
            <p className="mt-0.5 text-[10px] text-white/70">
              Total adjusted to latest live rate
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
