"use client";

import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvaStylePicker } from "@/components/merch/canva-style-picker";
import { CanvaFixedFooter, CanvaFooterButton } from "@/components/merch/canva-fixed-footer";
import { CanvaFormField } from "@/components/merch/canva-form-field";
import { CanvaMultilineInput } from "@/components/merch/canva-multiline-input";
import { CanvaNumberSelect } from "@/components/merch/canva-number-select";
import { CanvaIosPickerSheet } from "@/components/merch/canva-ios-picker-sheet";
import { ImageAiSheetHeader } from "@/components/merch/image-ai-sheet-header";
import { MerchImageAiPreviewSheet } from "@/components/merch/merch-image-ai-preview-sheet";
import { MerchImageAiRefineSheet } from "@/components/merch/merch-image-ai-refine-sheet";
import { FP_DURATION, FP_EASE, FP_SPRING, fpOverlayTransition, fpFadeUp, fpSheetHeightTransition, fpSheetPresentTransition, fpStepVariants, fpStagger, fpStaggerItem, fpChromeCollapse, fpContainSheetWheel, FP_SHEET_SCROLL_CLASS } from "@/components/merch/merch-motion";
import { CANVA_FONT, CANVA_SPACE, CANVA_TYPE, canvaTypeStyle } from "@/components/merch/merch-tokens";
import { IMAGE_AI_STYLES } from "@/lib/image-ai-styles";

const IMAGE_AI_OVERLAY = "rgba(36, 49, 61, 0.4)";
const IMAGE_AI_SHEET_SHADOW =
  "0 0 0 1px rgba(64, 87, 109, 0.04), 0 6px 20px -4px rgba(64, 87, 109, 0.20)";

const SHEET_WIDTH = 390;
const SHEET_HEIGHT = 591;
const FORM_PROMPT_HEIGHT = 120;
const FORM_COMPOSE_PROMPT_HEIGHT = 168;
const REFINE_COMPOSE_PROMPT_HEIGHT = 132;
const FORM_COMPOSE_SHEET_HEIGHT = CANVA_SPACE.md * 2 + FORM_COMPOSE_PROMPT_HEIGHT;
const REFINE_COMPOSE_SHEET_HEIGHT = CANVA_SPACE.md * 2 + REFINE_COMPOSE_PROMPT_HEIGHT;
const SHEET_SECTION_GAP = 20;
const PROMPT_MAX_LENGTH = 280;
const IMAGE_AI_NOTE_TITLE = "Max number of colors";
const IMAGE_AI_NOTE_SUBTITLE = "Fewer colors means lower cost";
const IMAGE_AI_MAX_COLOR_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

type ImageAiStep = "form" | "preview" | "refine";

/** Bottom action sheet for the Image AI tool — slides up over the merch canvas. */
export function MerchImageAiActionSheet({
  open,
  onClose,
  bottomInset = 0,
  onPromptFocusChange,
  onGraphicApplied,
}: {
  open: boolean;
  onClose: () => void;
  /** Space reserved at the bottom (e.g. Safari chrome) — overlay and sheet sit above this. */
  bottomInset?: number;
  onPromptFocusChange?: (focused: boolean) => void;
  /** Called when user confirms "Use this" on the preview step. */
  onGraphicApplied?: (graphicUrl: string) => void;
}) {
  const promptId = useId();
  const maxColorsId = useId();
  const referenceUploadRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_AI_STYLES[0].id);
  const [maxColors, setMaxColors] = useState<number>(IMAGE_AI_MAX_COLOR_OPTIONS[0]);
  const [maxColorsPickerOpen, setMaxColorsPickerOpen] = useState(false);
  const [step, setStep] = useState<ImageAiStep>("form");
  const [stepDirection, setStepDirection] = useState(1);
  const [editPrompt, setEditPrompt] = useState("");
  const [generationKey, setGenerationKey] = useState(0);
  const [generationReadyKey, setGenerationReadyKey] = useState<number | null>(null);
  const [processedGraphicUrl, setProcessedGraphicUrl] = useState<string | null>(null);
  const [promptFocused, setPromptFocused] = useState(false);

  const handlePromptFocusChange = useCallback(
    (focused: boolean) => {
      setPromptFocused(focused);
      onPromptFocusChange?.(focused);
    },
    [onPromptFocusChange],
  );

  const composeMode = promptFocused && (step === "form" || step === "refine");
  const activeSheetHeight =
    composeMode && step === "refine"
      ? REFINE_COMPOSE_SHEET_HEIGHT
      : composeMode
        ? FORM_COMPOSE_SHEET_HEIGHT
        : SHEET_HEIGHT;

  const openReferenceUpload = () => referenceUploadRef.current?.click();

  const handleReferenceSelected = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = "";
  };

  const goToStep = (next: ImageAiStep, direction: number) => {
    setStepDirection(direction);
    setStep(next);
  };

  const handleGenerate = () => {
    if (prompt.trim().length === 0) return;
    setMaxColorsPickerOpen(false);
    onPromptFocusChange?.(false);
    setPromptFocused(false);
    setProcessedGraphicUrl(null);
    setGenerationReadyKey(null);
    setGenerationKey((key) => key + 1);
    goToStep("preview", 1);
  };

  const handleOpenRefine = () => {
    onPromptFocusChange?.(false);
    setPromptFocused(false);
    goToStep("refine", 1);
  };

  const handleRegenerate = () => {
    if (editPrompt.trim().length === 0) return;
    onPromptFocusChange?.(false);
    setPromptFocused(false);
    setProcessedGraphicUrl(null);
    setGenerationReadyKey(null);
    setGenerationKey((key) => key + 1);
    goToStep("preview", -1);
  };

  const handleBack = () => {
    onPromptFocusChange?.(false);
    setPromptFocused(false);
    if (step === "refine") goToStep("preview", -1);
    else goToStep("form", -1);
  };

  const handleUseThis = (graphicUrl: string) => {
    onGraphicApplied?.(graphicUrl);
    onClose();
  };

  const sheetTitle =
    step === "form" ? "Image AI" : step === "preview" ? "Image Preview" : "Refine with AI";
  const stepVariants = fpStepVariants(20);

  useEffect(() => {
    if (!open) {
      onPromptFocusChange?.(false);
      setPromptFocused(false);
      setMaxColorsPickerOpen(false);
      setStep("form");
      setStepDirection(1);
      setEditPrompt("");
      setGenerationKey(0);
      setGenerationReadyKey(null);
      setProcessedGraphicUrl(null);
    }
  }, [open, onPromptFocusChange]);

  const selectedStylePreview =
    IMAGE_AI_STYLES.find((style) => style.id === selectedStyle)?.preview ?? IMAGE_AI_STYLES[0].preview;
  const activeGraphicPreview = processedGraphicUrl ?? selectedStylePreview;

  const handleGenerationReady = useCallback(() => {
    setGenerationReadyKey(generationKey);
  }, [generationKey]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-x-0 top-0 z-[100] flex flex-col justify-end pointer-events-none"
          style={{ bottom: bottomInset }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fpOverlayTransition}
        >
          <motion.button
            type="button"
            aria-label="Dismiss Image AI"
            className="absolute inset-0 pointer-events-auto"
            style={{ backgroundColor: IMAGE_AI_OVERLAY, border: "none", padding: 0, margin: 0, cursor: "pointer" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fpOverlayTransition}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={sheetTitle}
            className="relative z-10 flex w-full shrink-0 justify-center pointer-events-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={fpSheetPresentTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="relative flex min-h-0 flex-col overflow-hidden"
              animate={{ height: activeSheetHeight }}
              transition={fpSheetHeightTransition}
              style={{
                width: SHEET_WIDTH,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                background: "var(--Background-colorSurface, #FFF)",
                boxShadow: IMAGE_AI_SHEET_SHADOW,
              }}
            >
              <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
                <AnimatePresence mode="sync" custom={stepDirection} initial={false}>
                  {step === "form" ? (
                    <motion.div
                      key="form"
                      custom={stepDirection}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-[var(--Background-colorSurface,#FFF)]"
                    >
                      <AnimatePresence initial={false}>
                        {!composeMode ? (
                          <motion.div
                            key="form-header"
                            variants={fpChromeCollapse}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="shrink-0 overflow-hidden"
                          >
                            <ImageAiSheetHeader title="Image AI" variant="root" onClose={onClose} />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="relative min-h-0 flex-1 overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                      {composeMode ? (
                        <motion.div
                          key="form-compose"
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
                          <input
                            ref={referenceUploadRef}
                            type="file"
                            accept="image/*,.heic,.heif"
                            className="sr-only"
                            tabIndex={-1}
                            aria-hidden
                            onChange={handleReferenceSelected}
                          />
                          <CanvaMultilineInput
                            id={promptId}
                            value={prompt}
                            onChange={setPrompt}
                            placeholder='Ex: "cowboy boots with floral accents in earthy tones"'
                            maxLength={PROMPT_MAX_LENGTH}
                            autoGrow={false}
                            height={FORM_COMPOSE_PROMPT_HEIGHT}
                            onFocusChange={handlePromptFocusChange}
                            showUploadButton
                            onUploadClick={openReferenceUpload}
                          />
                        </motion.div>
                      ) : (
                      <div
                        key="form-body"
                        className={FP_SHEET_SCROLL_CLASS}
                        onWheel={fpContainSheetWheel}
                      >
                      <motion.div
                        variants={fpStagger}
                        initial="initial"
                        animate="animate"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: SHEET_SECTION_GAP,
                          paddingTop: CANVA_SPACE.lg,
                          paddingRight: CANVA_SPACE.md,
                          paddingBottom: 0,
                          paddingLeft: CANVA_SPACE.md,
                          alignSelf: "stretch",
                        }}
                      >
                        <motion.div variants={fpStaggerItem}>
                          <input
                            ref={referenceUploadRef}
                            type="file"
                            accept="image/*,.heic,.heif"
                            className="sr-only"
                            tabIndex={-1}
                            aria-hidden
                            onChange={handleReferenceSelected}
                          />
                          <CanvaFormField label="Describe the Graphic" htmlFor={promptId}>
                            <CanvaMultilineInput
                              id={promptId}
                              value={prompt}
                              onChange={setPrompt}
                              placeholder='Ex: "cowboy boots with floral accents in earthy tones"'
                              maxLength={PROMPT_MAX_LENGTH}
                              autoGrow={false}
                              height={FORM_PROMPT_HEIGHT}
                              onFocusChange={handlePromptFocusChange}
                              showUploadButton
                              onUploadClick={openReferenceUpload}
                            />
                          </CanvaFormField>
                        </motion.div>

                        <motion.div
                          key="form-extras"
                          variants={fpStaggerItem}
                          className="flex w-full flex-col"
                        >
                              <div className="flex w-full flex-col" style={{ gap: CANVA_SPACE.md }}>
                                <div className="flex w-full flex-col" style={{ gap: CANVA_SPACE.xs }}>
                                  <h3
                                    style={{
                                      margin: 0,
                                      fontFamily: CANVA_FONT,
                                      fontStyle: "normal",
                                      ...canvaTypeStyle(CANVA_TYPE.label),
                                      color: "var(--Typography-colorTypographyPrimary, #0E1318)",
                                    }}
                                  >
                                    Pick your style
                                  </h3>
                                </div>
                                <CanvaStylePicker
                                  options={[...IMAGE_AI_STYLES]}
                                  value={selectedStyle}
                                  onChange={setSelectedStyle}
                                />
                              </div>
                              <div
                                className="flex w-full items-center"
                                style={{ gap: CANVA_SPACE.sm, marginTop: SHEET_SECTION_GAP }}
                              >
                                <div className="flex min-w-0 flex-1 flex-col" style={{ gap: CANVA_SPACE.xs }}>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontFamily: CANVA_FONT,
                                      fontStyle: "normal",
                                      ...canvaTypeStyle(CANVA_TYPE.label),
                                      color: "var(--Typography-colorTypographyPrimary, #0E1318)",
                                    }}
                                  >
                                    {IMAGE_AI_NOTE_TITLE}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontFamily: CANVA_FONT,
                                      fontStyle: "normal",
                                      ...canvaTypeStyle(CANVA_TYPE.bodySm),
                                      color: "var(--Typography-colorTypographySecondary, #6B7280)",
                                    }}
                                  >
                                    {IMAGE_AI_NOTE_SUBTITLE}
                                  </p>
                                </div>
                                <CanvaNumberSelect
                                  id={maxColorsId}
                                  value={maxColors}
                                  ariaLabel="Maximum number of colors"
                                  onOpen={() => setMaxColorsPickerOpen(true)}
                                />
                              </div>
                        </motion.div>
                      </motion.div>
                      </div>
                      )}
                      </AnimatePresence>
                      </div>

                      <CanvaIosPickerSheet
                        open={maxColorsPickerOpen}
                        title="Max number of colors"
                        value={maxColors}
                        options={IMAGE_AI_MAX_COLOR_OPTIONS}
                        onClose={() => setMaxColorsPickerOpen(false)}
                        onConfirm={(next) => {
                          setMaxColors(next);
                          setMaxColorsPickerOpen(false);
                        }}
                      />

                      <AnimatePresence initial={false}>
                        {!composeMode ? (
                          <motion.div
                            key="form-footer"
                            className="w-full shrink-0"
                            variants={fpChromeCollapse}
                            initial="initial"
                            animate={{
                              opacity: maxColorsPickerOpen ? 0 : 1,
                              height: maxColorsPickerOpen ? 0 : "auto",
                            }}
                            exit="exit"
                            transition={{
                              opacity: { duration: FP_DURATION.fast, ease: FP_EASE.out },
                              height: fpSheetHeightTransition,
                            }}
                            style={{ pointerEvents: maxColorsPickerOpen ? "none" : "auto", overflow: "hidden" }}
                            aria-hidden={maxColorsPickerOpen}
                          >
                            <CanvaFixedFooter>
                              <CanvaFooterButton disabled={prompt.trim().length === 0} onClick={handleGenerate}>
                                Generate Image
                              </CanvaFooterButton>
                            </CanvaFixedFooter>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  ) : step === "preview" ? (
                    <motion.div
                      key="preview"
                      custom={stepDirection}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-[var(--Background-colorSurface,#FFF)]"
                    >
                      <MerchImageAiPreviewSheet
                        graphicPreview={activeGraphicPreview}
                        generationKey={generationKey}
                        skipLoadingAnimation={generationReadyKey === generationKey}
                        onGenerationReady={handleGenerationReady}
                        onBack={handleBack}
                        onClose={onClose}
                        onGraphicChange={setProcessedGraphicUrl}
                        onOpenRefine={handleOpenRefine}
                        onUseThis={handleUseThis}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="refine"
                      custom={stepDirection}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-[var(--Background-colorSurface,#FFF)]"
                    >
                      <MerchImageAiRefineSheet
                        graphicPreview={activeGraphicPreview}
                        editPrompt={editPrompt}
                        onEditPromptChange={setEditPrompt}
                        onBack={handleBack}
                        onClose={onClose}
                        onRegenerate={handleRegenerate}
                        composeMode={composeMode}
                        onPromptFocusChange={handlePromptFocusChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
