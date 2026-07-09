"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CANVA_FONT, CANVA_PRIMARY, CANVA_RADIUS, CANVA_SPACE } from "@/components/merch/merch-tokens";
import { FP_SPRING } from "@/components/merch/merch-motion";

const STYLE_TILE_HEIGHT = 170;
const STYLE_LABEL_LINE_HEIGHT = 22;
const STYLE_TILE_INNER_GAP = CANVA_SPACE.sm;
const STYLE_GRID_GAP = CANVA_SPACE.lg;
const STYLE_PREVIEW_HEIGHT = 140;
const TILE_SCROLL_PADDING = CANVA_SPACE.md;

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let parent = node?.parentElement ?? null;
  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function scrollTileIntoView(tile: HTMLElement | null) {
  if (!tile) return;

  const scrollParent = getScrollParent(tile);
  if (!scrollParent) {
    tile.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    return;
  }

  const tileRect = tile.getBoundingClientRect();
  const parentRect = scrollParent.getBoundingClientRect();

  if (tileRect.bottom > parentRect.bottom - TILE_SCROLL_PADDING) {
    scrollParent.scrollBy({
      top: tileRect.bottom - parentRect.bottom + TILE_SCROLL_PADDING,
      behavior: "smooth",
    });
    return;
  }

  if (tileRect.top < parentRect.top + TILE_SCROLL_PADDING) {
    scrollParent.scrollBy({
      top: tileRect.top - parentRect.top - TILE_SCROLL_PADDING,
      behavior: "smooth",
    });
  }
}

function isImagePreview(preview: string) {
  return preview.startsWith("http://") || preview.startsWith("https://");
}

function isSvgPreview(preview: string) {
  return /\.svg(?:$|[?#])/i.test(preview);
}

export type CanvaStyleTileOption = {
  id: string;
  label: string;
  preview: string;
};

/** Canva style picker tile — preview + label stack. */
export function CanvaStyleTile({
  label,
  preview,
  selected = false,
  onSelect,
  fluid = false,
}: {
  label: string;
  preview: string;
  selected?: boolean;
  onSelect?: () => void;
  fluid?: boolean;
}) {
  const imagePreview = isImagePreview(preview);
  const svgPreview = imagePreview && isSvgPreview(preview);
  const tileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selected) return;
    const frame = requestAnimationFrame(() => scrollTileIntoView(tileRef.current));
    return () => cancelAnimationFrame(frame);
  }, [selected]);

  const handleSelect = () => {
    onSelect?.();
    requestAnimationFrame(() => scrollTileIntoView(tileRef.current));
  };

  return (
    <motion.button
      ref={tileRef}
      type="button"
      onClick={handleSelect}
      aria-pressed={selected}
      whileTap={{ scale: 0.97, transition: FP_SPRING.snappy }}
      transition={FP_SPRING.snappy}
      className="relative text-left"
      style={{
        display: "flex",
        width: fluid ? "100%" : 138,
        height: STYLE_TILE_HEIGHT,
        minWidth: fluid ? 0 : 80,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: STYLE_TILE_INNER_GAP,
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: onSelect ? "pointer" : "default",
        fontFamily: CANVA_FONT,
      }}
    >
      <span
        className="block w-full shrink-0 overflow-hidden"
        style={{
          height: STYLE_PREVIEW_HEIGHT,
          borderRadius: CANVA_RADIUS.sm,
          backgroundColor: "#FFFFFF",
          border: selected
            ? `2px solid ${CANVA_PRIMARY}`
            : `1px solid rgba(64, 87, 109, 0.12)`,
          boxSizing: "border-box",
        }}
      >
        {imagePreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote style previews + bundled SVGs
          <img
            src={preview}
            alt=""
            draggable={false}
            className="block h-full w-full"
            style={{
              objectFit: svgPreview ? "contain" : "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <span
            className="block h-full w-full"
            style={{ borderRadius: CANVA_RADIUS.sm, background: preview }}
            aria-hidden
          />
        )}
      </span>
      <span
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          alignSelf: "stretch",
          minHeight: STYLE_LABEL_LINE_HEIGHT,
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "#474B6D",
          fontFamily: CANVA_FONT,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: `${STYLE_LABEL_LINE_HEIGHT}px`,
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/** Two-column vertical style grid for Image AI. */
export function CanvaStylePicker({
  options,
  value,
  onChange,
}: {
  options: CanvaStyleTileOption[];
  value: string;
  onChange?: (id: string) => void;
}) {
  return (
    <div
      className="grid w-full grid-cols-2"
      style={{
        gap: STYLE_GRID_GAP,
        alignItems: "start",
      }}
    >
      {options.map((option) => (
        <CanvaStyleTile
          key={option.id}
          label={option.label}
          preview={option.preview}
          selected={value === option.id}
          onSelect={onChange ? () => onChange(option.id) : undefined}
          fluid
        />
      ))}
    </div>
  );
}
