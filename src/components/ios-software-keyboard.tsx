"use client";

import { motion } from "framer-motion";
import { CANVA_PRIMARY } from "@/components/merch/merch-tokens";
import { fpSheetPresentTransition } from "@/components/merch/merch-motion";
import { IPHONE_17 } from "@/kalash/lib/iphone-17-device";

const KEY_BG = "#D1D5DB";
const KEY_TEXT = "#000000";
const KB_BG = "#D1D3D9";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⇧", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ["123", "space", "return"],
] as const;

/** iOS software keyboard height for merch phone mockups. */
export const IOS_KEYBOARD_COMPACT_HEIGHT = 253;

function getActiveTextarea() {
  const active = document.activeElement;
  return active instanceof HTMLTextAreaElement ? active : null;
}

function setTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
  descriptor?.set?.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertText(text: string) {
  const textarea = getActiveTextarea();
  if (!textarea) return;

  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const next = `${textarea.value.slice(0, start)}${text}${textarea.value.slice(end)}`;
  setTextareaValue(textarea, next);

  const caret = start + text.length;
  textarea.setSelectionRange(caret, caret);
  textarea.focus();
}

function deleteBackward() {
  const textarea = getActiveTextarea();
  if (!textarea) return;

  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;

  if (start !== end) {
    const next = `${textarea.value.slice(0, start)}${textarea.value.slice(end)}`;
    setTextareaValue(textarea, next);
    textarea.setSelectionRange(start, start);
    textarea.focus();
    return;
  }

  if (start === 0) return;
  const next = `${textarea.value.slice(0, start - 1)}${textarea.value.slice(start)}`;
  setTextareaValue(textarea, next);
  textarea.setSelectionRange(start - 1, start - 1);
  textarea.focus();
}

function dismissKeyboard() {
  getActiveTextarea()?.blur();
}

function handleKeyPress(label: string) {
  if (label === "⌫") {
    deleteBackward();
    return;
  }
  if (label === "space") {
    insertText(" ");
    return;
  }
  if (label === "return") {
    dismissKeyboard();
    return;
  }
  if (label === "⇧" || label === "123") return;
  insertText(label);
}

function Key({
  label,
  wide,
  interactive,
}: {
  label: string;
  wide?: "space" | "return" | "shift" | "numbers";
  interactive: boolean;
}) {
  const width =
    wide === "space" ? 180 : wide === "return" ? 88 : wide === "shift" || wide === "numbers" ? 42 : undefined;

  const sharedStyle = {
    minWidth: width ?? 0,
    flex: width ? (`0 0 ${width}px` as const) : ("1 1 0" as const),
    height: 42,
    backgroundColor: wide === "return" ? CANVA_PRIMARY : KEY_BG,
    color: wide === "return" ? "#FFFFFF" : KEY_TEXT,
    fontSize: wide === "return" || wide === "numbers" || wide === "shift" ? 16 : 22,
    fontWeight: 400,
    letterSpacing: wide === "space" ? 0 : 0.5,
    fontFamily: '"SF Pro Text", system-ui, sans-serif',
  };

  if (!interactive) {
    return (
      <span
        className="flex items-center justify-center rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.35)]"
        style={sharedStyle}
      >
        {label === "space" ? "" : label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => handleKeyPress(label)}
      className="flex items-center justify-center rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.35)] active:brightness-95"
      style={{
        ...sharedStyle,
        margin: 0,
        padding: 0,
        border: "none",
        cursor: "pointer",
      }}
    >
      {label === "space" ? "" : label}
    </button>
  );
}

/** iOS keyboard mock — overlays Safari chrome and types into the focused textarea. */
export function IosSoftwareKeyboard({ interactive = true }: { interactive?: boolean }) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-[106] border-t border-black/[0.08]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={fpSheetPresentTransition}
      style={{
        height: IOS_KEYBOARD_COMPACT_HEIGHT,
        paddingBottom: IPHONE_17.homeIndicatorHeightPx,
        backgroundColor: KB_BG,
      }}
      aria-hidden={!interactive}
    >
      <div className="flex flex-col gap-[7px] px-[3px] pt-[8px]">
        {ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-[5px]"
            style={{ paddingLeft: rowIndex === 1 ? 16 : rowIndex === 2 ? 8 : 0 }}
          >
            {row.map((key) => (
              <Key
                key={key}
                label={key === "space" ? "space" : key}
                interactive={interactive}
                wide={
                  key === "space"
                    ? "space"
                    : key === "return"
                      ? "return"
                      : key === "⇧"
                        ? "shift"
                        : key === "123"
                          ? "numbers"
                          : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
