"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { CanvaFixedFooter, CanvaFooterButton } from "@/components/merch/canva-fixed-footer";
import { CanvaFormField } from "@/components/merch/canva-form-field";
import { CanvaMultilineInput } from "@/components/merch/canva-multiline-input";
import { ImageAiSheetHeader } from "@/components/merch/image-ai-sheet-header";
import { FP_DURATION, FP_EASE, FP_SPRING, fpChromeCollapse, fpFadeUp, fpStagger, fpStaggerItem, fpContainSheetWheel, FP_SHEET_SCROLL_CLASS } from "@/components/merch/merch-motion";
import {
  CANVA_FONT,
  CANVA_PRIMARY,
  CANVA_PRIMARY_RGB,
  CANVA_RADIUS,
  CANVA_SPACE,
  CANVA_TYPE,
  canvaTypeStyle,
  MERCH,
} from "@/components/merch/merch-tokens";

const REFINE_SUGGESTIONS = [
  "Softer colors",
  "Bolder lines",
  "More vintage",
  "Less detail",
  "Rounder text",
] as const;

const GRAPHIC_COLLAPSED_HEIGHT = 72;
const GRAPHIC_EXPANDED_HEIGHT = 220;
const REFINE_COMPOSE_PROMPT_HEIGHT = 132;

function isImagePreview(preview: string) {
  return preview.startsWith("http://") || preview.startsWith("https://");
}

/** Focused refine step — describe a tweak and regenerate. */
export function MerchImageAiRefineSheet({
  graphicPreview,
  editPrompt,
  onEditPromptChange,
  onBack,
  onClose,
  onRegenerate,
  composeMode = false,
  onPromptFocusChange,
}: {
  graphicPreview: string;
  editPrompt: string;
  onEditPromptChange: (value: string) => void;
  onBack: () => void;
  onClose: () => void;
  onRegenerate: () => void;
  composeMode?: boolean;
  onPromptFocusChange?: (focused: boolean) => void;
}) {
  const editPromptId = useId();
  const [graphicOpen, setGraphicOpen] = useState(false);

  useEffect(() => {
    if (composeMode) setGraphicOpen(false);
  }, [composeMode]);

  const appendSuggestion = (suggestion: string) => {
    const trimmed = editPrompt.trim();
    onEditPromptChange(trimmed.length === 0 ? suggestion : `${trimmed}, ${suggestion.toLowerCase()}`);
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {!composeMode ? (
          <motion.div
            key="refine-header"
            variants={fpChromeCollapse}
            initial="initial"
            animate="animate"
            exit="exit"
            className="shrink-0 overflow-hidden"
          >
            <ImageAiSheetHeader title="Refine with AI" variant="nested" onBack={onBack} onClose={onClose} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative min-h-0 flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {composeMode ? (
          <motion.div
            key="refine-compose"
            variants={fpFadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex h-full min-h-0 flex-col"
            style={{
              padding: CANVA_SPACE.md,
              alignSelf: "stretch",
            }}
          >
            <CanvaMultilineInput
              id={editPromptId}
              value={editPrompt}
              onChange={onEditPromptChange}
              placeholder="e.g. make the text rounder"
              autoGrow={false}
              height={REFINE_COMPOSE_PROMPT_HEIGHT}
              onFocusChange={onPromptFocusChange}
            />
          </motion.div>
        ) : (
      <div key="refine-body" className={FP_SHEET_SCROLL_CLASS} onWheel={fpContainSheetWheel}>
      <motion.div
        variants={fpStagger}
        initial="initial"
        animate="animate"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: CANVA_SPACE.lg,
          paddingTop: CANVA_SPACE.md,
          paddingRight: CANVA_SPACE.md,
          paddingBottom: CANVA_SPACE.lg,
          paddingLeft: CANVA_SPACE.md,
          alignSelf: "stretch",
        }}
      >
        <motion.div variants={fpStaggerItem}>
          <motion.button
            type="button"
            onClick={() => setGraphicOpen((open) => !open)}
            whileTap={{ scale: 0.995 }}
            className="flex w-full flex-col hover:border-[rgba(25,25,96,0.18)]"
            style={{
              margin: 0,
              padding: 0,
              border: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.1)`,
              borderRadius: CANVA_RADIUS.lg,
              background: "#FFFFFF",
              cursor: "pointer",
              fontFamily: CANVA_FONT,
              textAlign: "left",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={false}
              animate={{ height: graphicOpen ? GRAPHIC_EXPANDED_HEIGHT : GRAPHIC_COLLAPSED_HEIGHT }}
              transition={FP_SPRING.soft}
              className="relative w-full overflow-hidden"
              style={{
                background: graphicOpen
                  ? MERCH.primarySoft
                  : `linear-gradient(135deg, ${MERCH.primarySoft} 0%, #FFFFFF 100%)`,
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: graphicOpen ? 1 : 0,
                  scale: graphicOpen ? 1 : 1.05,
                }}
                transition={{ duration: FP_DURATION.slow, ease: FP_EASE.out }}
                aria-hidden={!graphicOpen}
              >
                {isImagePreview(graphicPreview) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote style preview
                  <img
                    src={graphicPreview}
                    alt="Generated graphic preview"
                    className="h-full w-full object-contain object-center"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full" style={{ background: graphicPreview }} aria-hidden />
                )}
              </motion.div>

              <motion.div
                className="relative flex h-full w-full items-center"
                initial={false}
                animate={{ opacity: graphicOpen ? 0 : 1 }}
                transition={{ duration: FP_DURATION.base, ease: FP_EASE.out }}
                style={{
                  gap: CANVA_SPACE.md,
                  padding: CANVA_SPACE.md,
                  pointerEvents: graphicOpen ? "none" : "auto",
                }}
                aria-hidden={graphicOpen}
              >
                <div
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: CANVA_RADIUS.sm,
                    border: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.1)`,
                    background: MERCH.primarySoft,
                  }}
                >
                  {isImagePreview(graphicPreview) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote style preview
                    <img
                      src={graphicPreview}
                      alt=""
                      className="h-full w-full object-contain object-center"
                      draggable={false}
                      aria-hidden
                    />
                  ) : (
                    <div className="h-full w-full" style={{ background: graphicPreview }} aria-hidden />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col" style={{ gap: 2 }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: CANVA_FONT,
                      ...canvaTypeStyle(CANVA_TYPE.bodySm),
                      fontWeight: 600,
                      color: CANVA_PRIMARY,
                    }}
                  >
                    Your graphic
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: CANVA_FONT,
                      ...canvaTypeStyle(CANVA_TYPE.captionRegular),
                      color: "var(--Typography-colorTypographySecondary, #6B7280)",
                    }}
                  >
                    Tap to preview
                  </p>
                </div>
              </motion.div>

              <AnimatePresence initial={false}>
                {graphicOpen ? (
                  <motion.span
                    key="hide-preview-pill"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: FP_DURATION.base, ease: FP_EASE.out }}
                    className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center"
                    style={{
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: CANVA_RADIUS.full,
                      background: "rgba(255, 255, 255, 0.92)",
                      ...canvaTypeStyle(CANVA_TYPE.captionRegular),
                      color: CANVA_PRIMARY,
                      fontWeight: 600,
                    }}
                  >
                    <motion.span
                      initial={false}
                      animate={{ rotate: 0 }}
                      transition={FP_SPRING.snappy}
                      className="flex items-center"
                      aria-hidden
                    >
                      <ChevronUp size={14} strokeWidth={2.25} />
                    </motion.span>
                    Hide preview
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        </motion.div>

        <motion.div variants={fpStaggerItem}>
          <CanvaFormField label="What should change?" htmlFor={editPromptId}>
            <CanvaMultilineInput
              id={editPromptId}
              value={editPrompt}
              onChange={onEditPromptChange}
              placeholder="e.g. make the text rounder"
              autoGrow={false}
              height={112}
              onFocusChange={onPromptFocusChange}
            />
          </CanvaFormField>
        </motion.div>

        <motion.div variants={fpStaggerItem} className="flex w-full flex-col" style={{ gap: CANVA_SPACE.sm }}>
          <p
            style={{
              margin: 0,
              fontFamily: CANVA_FONT,
              ...canvaTypeStyle(CANVA_TYPE.caption),
              color: "var(--Typography-colorTypographySecondary, #6B7280)",
            }}
          >
            Quick ideas
          </p>
          <div
            className="no-scrollbar flex w-full overflow-x-auto"
            style={{ gap: CANVA_SPACE.sm, paddingBottom: 2 }}
          >
            {REFINE_SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                onClick={() => appendSuggestion(suggestion)}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: FP_DURATION.base, ease: FP_EASE.out, delay: index * 0.04 }}
                whileTap={{ scale: 0.96, transition: FP_SPRING.snappy }}
                className="shrink-0 hover:border-[rgba(25,25,96,0.22)] hover:bg-[#FAFAFC]"
                style={{
                  height: 32,
                  margin: 0,
                  padding: "0 12px",
                  border: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.14)`,
                  borderRadius: CANVA_RADIUS.full,
                  background: "#FFFFFF",
                  cursor: "pointer",
                  fontFamily: CANVA_FONT,
                  fontSize: 13,
                  lineHeight: "18px",
                  fontWeight: 500,
                  color: CANVA_PRIMARY,
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
      </div>
        )}
      </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {!composeMode ? (
          <motion.div
            key="refine-footer"
            variants={fpChromeCollapse}
            initial="initial"
            animate="animate"
            exit="exit"
            className="shrink-0 overflow-hidden"
          >
            <CanvaFixedFooter>
              <CanvaFooterButton disabled={editPrompt.trim().length === 0} onClick={onRegenerate}>
                Regenerate Image
              </CanvaFooterButton>
            </CanvaFixedFooter>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
