"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Crop, ImageMinus } from "lucide-react";
import { CanvaFixedFooter, CanvaFooterButton } from "@/components/merch/canva-fixed-footer";
import { ImageAiSheetHeader } from "@/components/merch/image-ai-sheet-header";
import {
  FP_DURATION,
  FP_EASE,
  FP_SPRING,
  fpFadeUp,
  fpReveal,
  fpSheetHeightTransition,
  fpStagger,
  fpStaggerItem,
  fpContainSheetWheel,
  FP_SHEET_SCROLL_CLASS,
} from "@/components/merch/merch-motion";
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

import { canRemoveImageBackground, removeImageBackground } from "@/lib/remove-image-background";

const HERO_HEIGHT = 300;
const IMAGE_AI_ICON = "/assets/merch/ic_image_ai.svg";
const CHECKERBOARD_BG =
  "repeating-conic-gradient(rgba(64, 87, 109, 0.09) 0% 25%, transparent 0% 50%) 50% / 14px 14px, #FFFFFF";
const GENERATION_MS = 2400;

function isImagePreview(preview: string) {
  return (
    preview.startsWith("http://") ||
    preview.startsWith("https://") ||
    preview.startsWith("blob:")
  );
}

function QuickEditChip({
  icon,
  label,
  delay = 0,
  onClick,
  disabled = false,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  delay?: number;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: FP_DURATION.base, ease: FP_EASE.out, delay }}
      whileTap={disabled ? undefined : { scale: 0.97, transition: FP_SPRING.snappy }}
      className="flex flex-1 items-center justify-center hover:border-[rgba(25,25,96,0.22)] hover:bg-[#FAFAFC] disabled:cursor-not-allowed disabled:opacity-55"
      style={{
        gap: 6,
        height: 36,
        margin: 0,
        padding: "0 12px",
        border: `1px solid rgba(${CANVA_PRIMARY_RGB}, ${active ? 0.35 : 0.14})`,
        borderRadius: CANVA_RADIUS.full,
        background: active ? `rgba(${CANVA_PRIMARY_RGB}, 0.06)` : "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: CANVA_FONT,
        fontSize: 13,
        lineHeight: "18px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: CANVA_PRIMARY,
      }}
    >
      <span className="flex shrink-0 items-center justify-center" style={{ width: 16, height: 16 }} aria-hidden>
        {icon}
      </span>
      {label}
    </motion.button>
  );
}

/** Image Preview — post-generate sheet with loading → reveal lifecycle. */
export function MerchImageAiPreviewSheet({
  graphicPreview,
  generationKey = 0,
  skipLoadingAnimation = false,
  onGenerationReady,
  onBack,
  onClose,
  onOpenRefine,
  onUseThis,
  onGraphicChange,
}: {
  graphicPreview: string;
  /** Bumps when user generates or regenerates — restarts the loading cycle. */
  generationKey?: number;
  /** When true, show the graphic immediately (e.g. returning from Refine). */
  skipLoadingAnimation?: boolean;
  onGenerationReady?: () => void;
  onBack: () => void;
  onClose: () => void;
  onOpenRefine?: () => void;
  onUseThis?: (graphicUrl: string) => void;
  onGraphicChange?: (graphicUrl: string) => void;
}) {
  const [ready, setReady] = useState(skipLoadingAnimation);
  const [displayUrl, setDisplayUrl] = useState(graphicPreview);
  const [bgRemoved, setBgRemoved] = useState(graphicPreview.startsWith("blob:"));
  const [removingBg, setRemovingBg] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);
  const processedBlobRef = useRef<string | null>(
    graphicPreview.startsWith("blob:") ? graphicPreview : null,
  );

  const bgRemovalSupported = canRemoveImageBackground(graphicPreview);

  useEffect(() => {
    if (skipLoadingAnimation) {
      setReady(true);
      return;
    }

    setReady(false);
    const timer = window.setTimeout(() => {
      setReady(true);
      onGenerationReady?.();
    }, GENERATION_MS);
    return () => window.clearTimeout(timer);
  }, [generationKey, graphicPreview, skipLoadingAnimation, onGenerationReady]);

  useEffect(() => {
    setDisplayUrl(graphicPreview);
    if (skipLoadingAnimation) {
      if (graphicPreview.startsWith("blob:")) {
        processedBlobRef.current = graphicPreview;
        setBgRemoved(true);
      }
      return;
    }

    if (processedBlobRef.current && processedBlobRef.current !== graphicPreview) {
      URL.revokeObjectURL(processedBlobRef.current);
    }
    processedBlobRef.current = graphicPreview.startsWith("blob:") ? graphicPreview : null;
    setBgRemoved(graphicPreview.startsWith("blob:"));
    setRemovingBg(false);
    setBgError(null);
  }, [graphicPreview, generationKey, skipLoadingAnimation]);

  const handleRemoveBackground = async () => {
    if (!ready || removingBg || bgRemoved || !bgRemovalSupported) return;

    setRemovingBg(true);
    setBgError(null);

    try {
      const nextUrl = await removeImageBackground(displayUrl);
      if (processedBlobRef.current) URL.revokeObjectURL(processedBlobRef.current);
      processedBlobRef.current = nextUrl;
      setDisplayUrl(nextUrl);
      setBgRemoved(true);
      onGraphicChange?.(nextUrl);
    } catch {
      setBgError("Couldn’t remove background. Try again.");
    } finally {
      setRemovingBg(false);
    }
  };

  return (
    <>
      <ImageAiSheetHeader title="Image Preview" variant="nested" onBack={onBack} onClose={onClose} />
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(0.92); opacity: 0.35; }
          50% { transform: scale(1); opacity: 0.7; }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="relative min-h-0 flex-1 overflow-hidden">
      <div className={FP_SHEET_SCROLL_CLASS} onWheel={fpContainSheetWheel}>
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
        <motion.div
          variants={fpStaggerItem}
          className="relative w-full overflow-hidden"
          style={{
            borderRadius: CANVA_RADIUS.lg,
            border: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.1)`,
            background: "#FFFFFF",
          }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: HERO_HEIGHT,
              background: ready
                ? bgRemoved
                  ? CHECKERBOARD_BG
                  : MERCH.primarySoft
                : `linear-gradient(155deg, ${MERCH.primarySoft} 0%, #FFFFFF 42%, rgba(${CANVA_PRIMARY_RGB}, 0.07) 100%)`,
            }}
            role="status"
            aria-live="polite"
            aria-busy={!ready}
          >
            <AnimatePresence mode="sync" initial={false}>
              {!ready ? (
                <motion.div
                  key="loading"
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ gap: CANVA_SPACE.md, padding: CANVA_SPACE.xl }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: FP_DURATION.fast, ease: FP_EASE.in }}
                >
                  <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `rgba(${CANVA_PRIMARY_RGB}, 0.12)`,
                        animation: "pulse-ring 2.4s ease-in-out infinite",
                      }}
                      aria-hidden
                    />
                    <motion.div
                      className="relative flex items-center justify-center rounded-full"
                      style={{
                        width: 52,
                        height: 52,
                        background: CANVA_PRIMARY,
                        boxShadow: `0 8px 24px rgba(${CANVA_PRIMARY_RGB}, 0.28)`,
                      }}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- bundled SVG asset */}
                      <img
                        src={IMAGE_AI_ICON}
                        alt=""
                        width={22}
                        height={22}
                        draggable={false}
                        aria-hidden
                        style={{ display: "block", filter: "brightness(0) invert(1)" }}
                      />
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center" style={{ gap: CANVA_SPACE.xs, textAlign: "center" }}>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: CANVA_FONT,
                        fontStyle: "normal",
                        ...canvaTypeStyle(CANVA_TYPE.label),
                        color: CANVA_PRIMARY,
                      }}
                    >
                      Creating your graphic…
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: CANVA_FONT,
                        fontStyle: "normal",
                        ...canvaTypeStyle(CANVA_TYPE.captionRegular),
                        color: "var(--Typography-colorTypographySecondary, #6B7280)",
                      }}
                    >
                      Usually ready in under 2 minutes
                    </p>
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-0 overflow-hidden"
                    style={{ height: 3, background: `rgba(${CANVA_PRIMARY_RGB}, 0.08)` }}
                    aria-hidden
                  >
                    <div
                      style={{
                        width: "40%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, rgba(${CANVA_PRIMARY_RGB}, 0.35), transparent)`,
                        animation: "shimmer-sweep 1.8s ease-in-out infinite",
                      }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="graphic" className="absolute inset-0" variants={fpReveal} initial="initial" animate="animate" exit="exit">
                  {isImagePreview(displayUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- generated / processed graphic
                    <img
                      src={displayUrl}
                      alt="Generated graphic"
                      className="h-full w-full object-contain object-center"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-full w-full" style={{ background: displayUrl }} aria-hidden />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {ready ? (
              <motion.div
                key="chips"
                className="flex w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: FP_DURATION.base, ease: FP_EASE.out, delay: 0.06 },
                  height: fpSheetHeightTransition,
                }}
                style={{
                  gap: CANVA_SPACE.sm,
                  padding: CANVA_SPACE.md,
                  borderTop: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.1)`,
                  overflow: "hidden",
                }}
              >
                <QuickEditChip
                  icon={<ImageMinus size={15} strokeWidth={2.25} />}
                  label={removingBg ? "Removing…" : bgRemoved ? "BG removed" : "Remove BG"}
                  delay={0.04}
                  onClick={handleRemoveBackground}
                  disabled={!bgRemovalSupported || removingBg || bgRemoved}
                  active={bgRemoved}
                />
                <QuickEditChip icon={<Crop size={15} strokeWidth={2.25} />} label="Crop" delay={0.1} />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {bgError ? (
            <p
              style={{
                margin: 0,
                padding: `0 ${CANVA_SPACE.md}px ${CANVA_SPACE.sm}px`,
                fontFamily: CANVA_FONT,
                ...canvaTypeStyle(CANVA_TYPE.captionRegular),
                color: "#B42318",
              }}
            >
              {bgError}
            </p>
          ) : null}
        </motion.div>

        <AnimatePresence>
          {ready ? (
            <motion.button
              key="refine"
              type="button"
              onClick={onOpenRefine}
              variants={fpFadeUp}
              initial="initial"
              animate="animate"
              exit="exit"
              whileTap={{ scale: 0.985, transition: FP_SPRING.snappy }}
              className="flex w-full items-center hover:bg-[#FAFAFC]"
              style={{
                gap: CANVA_SPACE.sm,
                padding: "14px 16px",
                margin: 0,
                border: `1px solid rgba(${CANVA_PRIMARY_RGB}, 0.12)`,
                borderRadius: CANVA_RADIUS.lg,
                background: "#FFFFFF",
                cursor: "pointer",
                fontFamily: CANVA_FONT,
                textAlign: "left",
              }}
            >
              <span className="flex shrink-0 items-center justify-center" style={{ width: 28, height: 28 }} aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element -- bundled SVG asset */}
                <img src={IMAGE_AI_ICON} alt="" width={26} height={26} draggable={false} style={{ display: "block" }} />
              </span>
              <span
                className="min-w-0 flex-1"
                style={{
                  ...canvaTypeStyle(CANVA_TYPE.bodySm),
                  fontWeight: 600,
                  color: "var(--Typography-colorTypographyPrimary, #0E1318)",
                }}
              >
                Refine with AI
              </span>
              <ChevronRight size={18} strokeWidth={2} style={{ flexShrink: 0, color: "#6B7280" }} aria-hidden />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </motion.div>
      </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0.55 }}
        transition={{ duration: FP_DURATION.base, ease: FP_EASE.out }}
      >
        <CanvaFixedFooter>
          <CanvaFooterButton disabled={!ready} onClick={() => onUseThis?.(displayUrl)} showNextArrow={ready}>
            Use this
          </CanvaFooterButton>
        </CanvaFixedFooter>
      </motion.div>
    </>
  );
}
