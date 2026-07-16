"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { CANVA_FONT, CANVA_INPUT, CANVA_SPACE } from "@/components/merch/merch-tokens";

const REFERENCE_IMAGE_ICON = "/assets/merch/ic_reference_image.svg";

export type CanvaMultilineInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  autoGrow?: boolean;
  /** Fixed field height — disables auto-grow when set. */
  height?: number;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onFocusChange?: (focused: boolean) => void;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
};

/** Canva MultilineInput — neutral default, grey hover, primary focus, placeholder hides on focus. */
export function CanvaMultilineInput({
  id: idProp,
  value,
  onChange,
  placeholder,
  minRows = 3,
  maxRows = 6,
  maxLength,
  autoGrow = true,
  height,
  onFocus,
  onBlur,
  onFocusChange,
  showUploadButton = false,
  onUploadClick,
}: CanvaMultilineInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const lineHeight = CANVA_INPUT.lineHeight;
  const fieldHeight = height ?? CANVA_INPUT.fieldHeight;
  const useAutoGrow = autoGrow && height == null;
  const minHeight = lineHeight * minRows + CANVA_INPUT.paddingY * 2;
  const maxHeight = lineHeight * maxRows + CANVA_INPUT.paddingY * 2;
  const hasValue = value.trim().length > 0;
  const showPlaceholder = Boolean(placeholder) && !focused && !hasValue;
  const showUpload = showUploadButton && !focused;
  const uploadBottomInset = showUpload ? 36 : 0;

  const resizeToContent = useCallback(() => {
    const el = textareaRef.current;
    if (!el || !useAutoGrow) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${next}px`;
  }, [useAutoGrow, maxHeight, minHeight]);

  useEffect(() => {
    resizeToContent();
  }, [value, resizeToContent]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = maxLength ? event.target.value.slice(0, maxLength) : event.target.value;
    onChange(next);
  };

  const borderColor = focused ? CANVA_INPUT.borderActive : hovered ? CANVA_INPUT.borderHover : CANVA_INPUT.borderDefault;

  const focusTextarea = () => textareaRef.current?.focus();

  return (
    <div
      className="flex w-full flex-col"
      style={{
        display: "flex",
        width: "100%",
        maxWidth: CANVA_INPUT.fieldWidth,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: CANVA_SPACE.sm,
        fontFamily: CANVA_FONT,
        alignSelf: "stretch",
      }}
    >
      <div
        className="relative w-full"
        style={{ alignSelf: "stretch" }}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target === textareaRef.current || target.closest("button")) return;
          event.preventDefault();
          focusTextarea();
        }}
      >
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={showPlaceholder ? placeholder : undefined}
          rows={minRows}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="on"
          spellCheck
          onFocus={(event) => {
            setFocused(true);
            onFocusChange?.(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            setHovered(false);
            onFocusChange?.(false);
            onBlur?.(event);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="no-scrollbar block w-full resize-none overflow-hidden outline-none transition-[border-color,box-shadow] duration-150 placeholder:font-normal placeholder:text-[14px] placeholder:leading-[22px] placeholder:text-[color:var(--Typography-colorTypographyPlaceholder,rgba(17,23,29,0.60))]"
          style={{
            flex: "1 0 0",
            alignSelf: "stretch",
            width: "100%",
            height: useAutoGrow ? undefined : fieldHeight,
            minHeight: useAutoGrow ? minHeight : fieldHeight,
            maxHeight: useAutoGrow ? maxHeight : fieldHeight,
            padding: `${CANVA_INPUT.paddingY}px ${CANVA_INPUT.paddingX}px`,
            paddingBottom: CANVA_INPUT.paddingY + uploadBottomInset,
            borderRadius: CANVA_INPUT.radius,
            border: `1px solid ${borderColor}`,
            boxShadow: focused ? CANVA_INPUT.focusRing : "none",
            backgroundColor: CANVA_INPUT.bg,
            color: CANVA_INPUT.text,
            fontFamily: CANVA_FONT,
            fontSize: CANVA_INPUT.fontSize,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: `${CANVA_INPUT.lineHeight}px`,
            cursor: "text",
            WebkitTapHighlightColor: "transparent",
          }}
        />
        {showUpload ? (
          <button
            type="button"
            aria-label="Upload reference image"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onUploadClick?.();
            }}
            onMouseDown={(event) => event.preventDefault()}
            className="absolute flex items-center justify-center transition-opacity duration-150 hover:opacity-80"
            style={{
              right: CANVA_INPUT.paddingX,
              bottom: CANVA_INPUT.paddingY,
              width: 28,
              height: 28,
              margin: 0,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: onUploadClick ? "pointer" : "default",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- bundled SVG asset */}
            <img
              src={REFERENCE_IMAGE_ICON}
              alt=""
              width={28}
              height={28}
              draggable={false}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
