"use client";

import type { ReactNode } from "react";
import { CANVA_FONT, CANVA_SPACE, canvaTypeStyle, CANVA_TYPE } from "@/components/merch/merch-tokens";

/** Canva App UI Kit FormField — label, control slot, hint, and error message. */
export function CanvaFormField({
  label,
  htmlFor,
  description,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex w-full flex-col"
      style={{ gap: CANVA_SPACE.sm, fontFamily: CANVA_FONT }}
    >
      <label
        htmlFor={htmlFor}
        style={{
          display: "flex",
          width: 288,
          alignItems: "flex-start",
          gap: CANVA_SPACE.xs,
          fontFamily: CANVA_FONT,
          fontStyle: "normal",
          ...canvaTypeStyle(CANVA_TYPE.label),
          color: "var(--Typography-colorTypographyPrimary, #0E1318)",
          cursor: "pointer",
        }}
      >
        {label}
      </label>

      {description ? (
        <p
          style={{
            margin: 0,
            ...canvaTypeStyle(CANVA_TYPE.captionRegular),
            color: "var(--Typography-colorTypographySecondary, #6B7280)",
          }}
        >
          {description}
        </p>
      ) : null}

      <div style={{ flex: "1 0 0", alignSelf: "stretch", width: "100%" }}>{children}</div>

      {error ? (
        <p
          role="alert"
          style={{
            margin: 0,
            ...canvaTypeStyle(CANVA_TYPE.captionRegular),
            color: "#DB5945",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
