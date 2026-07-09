"use client";

import { ChevronDown } from "lucide-react";
import { CANVA_FONT, CANVA_INPUT, canvaTypeStyle, CANVA_TYPE } from "@/components/merch/merch-tokens";

/** Compact number field — opens an in-sheet iOS wheel picker (host picker at sheet root). */
export function CanvaNumberSelect({
  id,
  value,
  ariaLabel,
  onOpen,
}: {
  id?: string;
  value: number;
  ariaLabel?: string;
  onOpen: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      onClick={onOpen}
      className="relative shrink-0 outline-none transition-[border-color,box-shadow] duration-150"
      style={{
        width: 72,
        height: 40,
        padding: "0 32px 0 12px",
        margin: 0,
        borderRadius: CANVA_INPUT.radius,
        border: `1px solid ${CANVA_INPUT.borderDefault}`,
        backgroundColor: CANVA_INPUT.bg,
        color: CANVA_INPUT.text,
        fontFamily: CANVA_FONT,
        fontStyle: "normal",
        textAlign: "left",
        cursor: "pointer",
        ...canvaTypeStyle(CANVA_TYPE.bodySm),
      }}
    >
      {value}
      <ChevronDown
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ right: 12, width: 16, height: 16, color: CANVA_INPUT.text }}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}
