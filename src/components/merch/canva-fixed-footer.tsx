"use client";

import type { CSSProperties, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
  CANVA_FONT,
  CANVA_PRIMARY,
  CANVA_RADIUS,
  CANVA_SPACE,
  canvaTypeStyle,
  CANVA_TYPE,
} from "@/components/merch/merch-tokens";

/** Canva App UI Kit fixed footer — pins actions to the bottom of a panel or sheet. */
export function CanvaFixedFooter({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <footer
      className={`w-full shrink-0${className ? ` ${className}` : ""}`}
      style={{
        display: "flex",
        alignSelf: "stretch",
        padding: CANVA_SPACE.md,
        borderTop: "1px solid var(--Light-Gray-3, #E8EAED)",
        background: "var(--Background-colorSurface, #FFF)",
        fontFamily: CANVA_FONT,
        ...style,
      }}
    >
      {children}
    </footer>
  );
}

/** Full-width primary CTA for Canva fixed footers. */
export function CanvaFooterButton({
  children,
  disabled = false,
  onClick,
  showNextArrow = true,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  showNextArrow?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full transition-[filter,opacity] duration-150 enabled:hover:brightness-[0.96] enabled:active:brightness-[0.92] disabled:cursor-not-allowed"
      style={{
        display: "flex",
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        gap: CANVA_SPACE.sm,
        padding: "0 16px",
        margin: 0,
        border: "none",
        borderRadius: CANVA_RADIUS.full,
        backgroundColor: CANVA_PRIMARY,
        color: "#FFFFFF",
        ...canvaTypeStyle(CANVA_TYPE.chip),
        fontFamily: CANVA_FONT,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
      {showNextArrow ? (
        <ChevronRight style={{ width: 16, height: 16, flexShrink: 0 }} strokeWidth={2.5} aria-hidden />
      ) : null}
    </button>
  );
}
