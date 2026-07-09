"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import { FP_DURATION, FP_EASE } from "@/components/merch/merch-motion";

const HEADER_ICON_SIZE = 32;

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative z-10 flex shrink-0 items-center justify-center"
      whileTap={{ scale: 0.92 }}
      transition={{ duration: FP_DURATION.fast }}
      style={{
        width: HEADER_ICON_SIZE,
        height: HEADER_ICON_SIZE,
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        color: "var(--Dark-Gray-6, #0F1015)",
        cursor: "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}

/** Image AI sheet chrome — root (form) or nested (preview / refine with back). */
export function ImageAiSheetHeader({
  title,
  variant = "root",
  onBack,
  onClose,
}: {
  title: string;
  /** Root form step: centered title + close. Nested steps: back + centered title + close. */
  variant?: "root" | "nested";
  onBack?: () => void;
  onClose: () => void;
}) {
  const showBack = variant === "nested";

  return (
    <header
      className="relative w-full shrink-0"
      style={{
        display: "flex",
        padding: 12,
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--Light-Gray-3, #E8EAED)",
      }}
    >
      {showBack ? (
        <HeaderIconButton label="Back" onClick={onBack!}>
          <ChevronLeft style={{ width: 20, height: 20 }} strokeWidth={2} aria-hidden />
        </HeaderIconButton>
      ) : (
        <span style={{ width: HEADER_ICON_SIZE, height: HEADER_ICON_SIZE, flexShrink: 0 }} aria-hidden />
      )}

      <h2
        className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-center"
        style={{
          margin: 0,
          padding: "0 48px",
          minHeight: HEADER_ICON_SIZE,
          overflow: "hidden",
          textAlign: "center",
          color: "var(--Typography-colorTypographyPrimary, #0E1318)",
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "22px",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: FP_DURATION.fast, ease: FP_EASE.out }}
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </motion.span>
        </AnimatePresence>
      </h2>

      <HeaderIconButton label="Close" onClick={onClose}>
        <X style={{ width: 20, height: 20 }} strokeWidth={2} aria-hidden />
      </HeaderIconButton>
    </header>
  );
}
