"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import {
  Check,
  ChevronRight,
  Zap,
} from "lucide-react";
import { FP_DURATION, FP_EASE, FP_DRAG_TRANSITION, FP_PRODUCT_PREVIEW_TRANSITION, FP_SPRING, fpReveal } from "@/components/merch/merch-motion";
import { MerchImageAiActionSheet } from "@/components/merch/merch-image-ai-action-sheet";
import { notoSans } from "@/components/merch/canva-font";
import { IOS_SAFARI_COMPACT_HEIGHT, IosSafariChrome } from "@/components/ios-safari-chrome";
import { IOS_KEYBOARD_COMPACT_HEIGHT, IosSoftwareKeyboard } from "@/components/ios-software-keyboard";
import { IosStatusBar } from "@/components/ios-status-bar";
import {
  CANVA_RADIUS,
  CANVA_SPACE,
  CANVA_TYPE,
  canvaTypeStyle,
  MERCH,
  MERCH_HEIGHT,
  MERCH_COLOR_SWATCHES,
  MERCH_HERO_IMAGE,
  MERCH_HERO_BACK_IMAGE,
  CANVA_PRIMARY,
  type MerchColorId,
  MERCH_WIDTH,
} from "@/components/merch/merch-tokens";

const GRID_GUTTER = CANVA_SPACE.lg;
/** Vertical rhythm between stacked chrome blocks (card, tools, safari). */
const SECTION_GAP = CANVA_SPACE.sm;
const PROFILE_AVATAR_SIZE = 32;
/** Space below tool tiles before Safari chrome. */
const TOOLS_BOTTOM_GAP = CANVA_SPACE.sm;
/** Inner scroll track padding so tile shadows aren't clipped by overflow-x. */
const TOOL_SHADOW_BLEED = 6;

/** Product card + tool tile shadow — 30% lighter than original spec. */
const MERCH_CARD_SHADOW =
  "0 0 2px 0 rgba(145, 158, 171, 0.14), 0 12px 24px -4px rgba(145, 158, 171, 0.084)";

/** Tighter drop shadow for toolbar tiles — fits inside scroll bleed without clipping. */
const TOOL_TILE_SHADOW =
  "0 0 2px 0 rgba(145, 158, 171, 0.14), 0 4px 10px -4px rgba(145, 158, 171, 0.084)";

const TOOL_ITEMS = [
  {
    id: "image-ai",
    label: "Image AI",
    bg: "#EDEDF5",
    accent: CANVA_PRIMARY,
    iconSrc: "/assets/merch/ic_image_ai.svg",
  },
  {
    label: "Designs",
    bg: "#FDDCF2",
    accent: "#EB79C5",
    iconSrc: "/assets/merch/ic_design.svg",
  },
  {
    label: "Add Text",
    bg: "#CCE8E1",
    accent: "#32A687",
    iconSrc: "/assets/merch/ic_text.svg",
  },
  {
    id: "upload",
    label: "Upload",
    bg: "#CFDFF7",
    accent: "#337AB7",
    iconSrc: "/assets/merch/ic_upload.svg",
  },
  {
    label: "Greek",
    bg: "#E1D9FF",
    accent: "#8066F0",
    iconSrc: "/assets/merch/ic_element.svg",
  },
  {
    label: "Decorate",
    bg: "#FCDBB8",
    accent: "#F49B50",
    iconSrc: "/assets/merch/ic_decor.svg",
  },
  {
    label: "Clipart",
    bg: "#F3E8FF",
    accent: "#9333EA",
    iconSrc: "/assets/merch/ic_element.svg",
  },
  {
    label: "Prints",
    bg: "#E0F2FE",
    accent: "#0284C7",
    iconSrc: "/assets/merch/ic_text.svg",
  },
] as const;

/** Hero carousel pagination — front / back product views. */
const HERO_SLIDE_COUNT = 2;
const HERO_IMAGES = [MERCH_HERO_IMAGE, MERCH_HERO_BACK_IMAGE] as const;
const HERO_VIEW_LABELS = ["front", "back"] as const;
const HERO_SWIPE_OFFSET_PX = 48;
const HERO_SWIPE_VELOCITY = 380;
const HERO_DOT_SIZE = 12;
const HERO_DOT_INACTIVE_SIZE = 6;
const HERO_DOT_GAP = CANVA_SPACE.xs;
const HERO_DOT_STEP = HERO_DOT_SIZE + HERO_DOT_GAP;

function HeroCarouselSlide({
  image,
  color,
  label,
}: {
  image: string;
  color: string;
  label: string;
}) {
  return (
    <div className="relative h-full w-full shrink-0">
      <motion.div
        className="h-full w-full"
        animate={{ backgroundColor: color }}
        transition={FP_PRODUCT_PREVIEW_TRANSITION}
        style={{
          WebkitMaskImage: `url(${image})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${image})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
        role="img"
        aria-label={label}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- shading layer over flat fill */}
      <img
        src={image}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-[0.28] mix-blend-multiply"
        style={{ filter: "grayscale(1) contrast(1.12)" }}
        draggable={false}
        aria-hidden
      />
    </div>
  );
}

export function MerchUserFirstView({
  interactive = false,
  onImageAiSheetOpenChange,
}: {
  interactive?: boolean;
  onImageAiSheetOpenChange?: (open: boolean) => void;
}) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  const heroTrackX = useMotionValue(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeColor, setActiveColor] = useState<MerchColorId>("navy");
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string | null>(null);
  const [imageAiSheetOpen, setImageAiSheetOpen] = useState(false);
  const [promptFocused, setPromptFocused] = useState(false);

  useEffect(() => {
    onImageAiSheetOpenChange?.(imageAiSheetOpen);
  }, [imageAiSheetOpen, onImageAiSheetOpenChange]);

  useEffect(() => {
    if (!imageAiSheetOpen) setPromptFocused(false);
  }, [imageAiSheetOpen]);

  useEffect(() => {
    return () => {
      if (uploadedDesignUrl) URL.revokeObjectURL(uploadedDesignUrl);
    };
  }, [uploadedDesignUrl]);

  const activeSwatch = useMemo(
    () => MERCH_COLOR_SWATCHES.find((swatch) => swatch.id === activeColor) ?? MERCH_COLOR_SWATCHES[0],
    [activeColor],
  );

  useEffect(() => {
    const node = heroCarouselRef.current;
    if (!node) return;

    const measure = () => {
      // Layout width — getBoundingClientRect is post-transform and breaks inside scaled previews.
      setCarouselWidth(node.offsetWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (carouselWidth <= 0) return;
    animate(heroTrackX, -activeSlide * carouselWidth, FP_PRODUCT_PREVIEW_TRANSITION);
  }, [activeSlide, carouselWidth, heroTrackX]);

  const goToHeroSlide = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), HERO_SLIDE_COUNT - 1);
    setActiveSlide(clamped);
  };

  const handleHeroDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    let next = activeSlide;

    if (offset.x <= -HERO_SWIPE_OFFSET_PX || velocity.x <= -HERO_SWIPE_VELOCITY) {
      next = Math.min(activeSlide + 1, HERO_SLIDE_COUNT - 1);
    } else if (offset.x >= HERO_SWIPE_OFFSET_PX || velocity.x >= HERO_SWIPE_VELOCITY) {
      next = Math.max(activeSlide - 1, 0);
    }

    goToHeroSlide(next);
  };

  const openImageAiSheet = () => {
    if (!interactive) return;
    setImageAiSheetOpen(true);
  };

  const openNativeUpload = () => {
    if (!interactive) return;
    uploadInputRef.current?.click();
  };

  const handleUploadSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    setUploadedDesignUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  };

  const selectColor = (colorId: MerchColorId) => {
    if (!interactive) return;
    setActiveColor(colorId);
    goToHeroSlide(0);
  };

  const pointerClass = interactive ? "" : "pointer-events-none";
  const bottomChromeHeight =
    promptFocused && imageAiSheetOpen ? IOS_KEYBOARD_COMPACT_HEIGHT : IOS_SAFARI_COMPACT_HEIGHT;

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden ${notoSans.className} ${pointerClass}`}
      style={{
        width: MERCH_WIDTH,
        height: MERCH_HEIGHT,
        boxSizing: "border-box",
        paddingBottom: bottomChromeHeight,
        backgroundColor: MERCH.bg,
        fontFamily: "var(--font-noto-sans), sans-serif",
      }}
    >
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleUploadSelected}
      />

      <IosStatusBar />

      <header
        className="shrink-0"
        style={{
          display: "flex",
          width: 358,
          marginLeft: GRID_GUTTER,
          marginRight: GRID_GUTTER,
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: CANVA_SPACE.xs,
          paddingBottom: CANVA_SPACE.sm,
        }}
      >
        <div className="flex min-w-0 flex-1 items-center" style={{ gap: CANVA_SPACE.xs }}>
          <span
            className="min-w-0 text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--Dark-Gray-5, #474B6D)",
              fontFamily: '"Noto Sans"',
              fontSize: 14,
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "18px",
            }}
          >
            Save to see Price &amp; Shipping 👉
          </span>
        </div>
        <div className="flex items-center" style={{ gap: CANVA_SPACE.sm }}>
          <button
            type="button"
            className="shrink-0 text-white"
            style={{
              display: "flex",
              height: PROFILE_AVATAR_SIZE,
              justifyContent: "center",
              alignItems: "center",
              padding: "0 14px",
              margin: 0,
              border: "none",
              ...canvaTypeStyle(CANVA_TYPE.chip),
              borderRadius: CANVA_RADIUS.full,
              background: MERCH.primary,
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <div
            className="relative shrink-0 overflow-hidden border bg-white"
            style={{
              display: "flex",
              width: PROFILE_AVATAR_SIZE,
              height: PROFILE_AVATAR_SIZE,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: CANVA_RADIUS.full,
              borderColor: "#CFDFF7",
            }}
          >
            <Image
              src="/jb-avatar.png"
              alt="Profile"
              fill
              className="object-cover"
              sizes={`${PROFILE_AVATAR_SIZE}px`}
            />
          </div>
        </div>
      </header>

      <div
        className="relative min-h-0 flex-1"
        style={{
          marginLeft: GRID_GUTTER,
          marginRight: GRID_GUTTER,
          marginTop: SECTION_GAP,
        }}
      >
        <div
          className="flex h-full flex-col overflow-hidden"
          style={{
            gap: CANVA_SPACE.sm,
            padding: "8px 16px",
            borderRadius: 16,
            background: "var(--Light-Gray-2, #F5F6FA)",
          }}
        >
          <div
            ref={heroCarouselRef}
            className={`relative min-h-0 w-full flex-1 overflow-hidden${interactive ? " cursor-grab active:cursor-grabbing" : ""}`}
            style={{ borderRadius: CANVA_RADIUS.sm }}
          >
            <motion.div
              className="flex h-full"
              style={{
                width: carouselWidth > 0 ? carouselWidth * HERO_SLIDE_COUNT : "200%",
                x: heroTrackX,
                touchAction: interactive ? "none" : undefined,
              }}
              drag={interactive && carouselWidth > 0 ? "x" : false}
              dragConstraints={
                carouselWidth > 0
                  ? { left: -carouselWidth * (HERO_SLIDE_COUNT - 1), right: 0 }
                  : undefined
              }
              dragElastic={0.08}
              dragTransition={FP_DRAG_TRANSITION}
              onDragEnd={handleHeroDragEnd}
            >
              {HERO_IMAGES.map((image, index) => (
                <div
                  key={image}
                  className="h-full shrink-0"
                  style={{ width: carouselWidth > 0 ? carouselWidth : "50%" }}
                  aria-hidden={index !== activeSlide}
                >
                  <HeroCarouselSlide
                    image={image}
                    color={activeSwatch.color}
                    label={`${activeSwatch.name} — C1717 ${HERO_VIEW_LABELS[index]}`}
                  />
                </div>
              ))}
            </motion.div>
            {uploadedDesignUrl && (
              <motion.img
                key={uploadedDesignUrl}
                src={uploadedDesignUrl}
                alt="Uploaded design"
                className="pointer-events-none absolute left-1/2 top-[40%] max-h-[32%] max-w-[46%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-md"
                draggable={false}
                initial="initial"
                animate="animate"
                variants={fpReveal}
              />
            )}
          </div>

          <div
            className="relative shrink-0"
            style={{
              display: "flex",
              padding: "4px 0 0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="relative flex items-center"
              style={{ gap: HERO_DOT_GAP, height: HERO_DOT_SIZE }}
            >
              {Array.from({ length: HERO_SLIDE_COUNT }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => interactive && goToHeroSlide(index)}
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: HERO_DOT_SIZE,
                    height: HERO_DOT_SIZE,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: interactive ? "pointer" : "default",
                  }}
                  aria-label={`Slide ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: HERO_DOT_INACTIVE_SIZE,
                      height: HERO_DOT_INACTIVE_SIZE,
                      backgroundColor: MERCH.border,
                      opacity: index === activeSlide ? 0 : 1,
                    }}
                    aria-hidden
                  />
                </button>
              ))}
              <motion.span
                className="pointer-events-none absolute left-0 top-0 rounded-full"
                style={{
                  width: HERO_DOT_SIZE,
                  height: HERO_DOT_SIZE,
                  backgroundColor: MERCH.primary,
                }}
                initial={false}
                animate={{ x: activeSlide * HERO_DOT_STEP }}
                transition={FP_PRODUCT_PREVIEW_TRANSITION}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex shrink-0 flex-col items-center justify-center"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          width: 358,
          marginLeft: GRID_GUTTER,
          marginRight: GRID_GUTTER,
          marginTop: SECTION_GAP,
          padding: "6px 10px",
          borderRadius: 12,
          background: "var(--black-white-white, #FFF)",
          boxShadow: MERCH_CARD_SHADOW,
        }}
      >
        <div
          className="flex flex-col items-start self-stretch"
          style={{ gap: 2 }}
        >
          <div className="flex w-full items-start justify-between" style={{ gap: CANVA_SPACE.xs }}>
            <h2
              className="min-w-0 overflow-hidden text-ellipsis"
              style={{
                display: "-webkit-box",
                width: 225,
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                color: MERCH.chipText,
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "18px",
                letterSpacing: "0.14px",
              }}
            >
              Gildan Adult Heavy Blend Hooded
            </h2>
            <button
              type="button"
              className="flex shrink-0 items-center"
              style={{
                color: MERCH.primary,
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "18px",
                gap: 1,
              }}
            >
              Change
              <ChevronRight style={{ width: 12, height: 12 }} strokeWidth={2.5} />
            </button>
          </div>

          <p
            className="w-full overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--Light-Gray-5, #8D90AA)",
              fontFamily: '"Noto Sans"',
              fontSize: 12,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "0.24px",
            }}
          >
            Comfort Colors
            <span aria-hidden className="mx-1">
              ·
            </span>
            #C1717
            <span aria-hidden className="mx-1">
              ·
            </span>
            Min 24+
          </p>
        </div>

        <div className="flex w-full items-center" style={{ gap: 6 }}>
            {MERCH_COLOR_SWATCHES.map((swatch) => {
              const selected = swatch.id === activeColor;
              const isFast = "fast" in swatch && Boolean(swatch.fast);
              return (
                <motion.button
                  key={swatch.id}
                  type="button"
                  onClick={() => selectColor(swatch.id)}
                  whileTap={{ scale: 0.92 }}
                  transition={FP_SPRING.snappy}
                  className="relative shrink-0 rounded-full"
                  style={{
                    height: 32,
                    width: 32,
                    padding: 2,
                    border: selected ? `2px solid ${MERCH.primary}` : `1px solid ${MERCH.border}`,
                    backgroundColor: "#fff",
                    cursor: interactive ? "pointer" : "default",
                  }}
                  aria-label={`${swatch.name} color`}
                  aria-pressed={selected}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{
                      backgroundColor: swatch.color,
                      boxShadow: "inset 0 1px 1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <AnimatePresence>
                    {selected ? (
                      <motion.span
                        key="check"
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: FP_DURATION.fast, ease: FP_EASE.out }}
                      >
                        <Check className="text-white drop-shadow-sm" style={{ width: 12, height: 12 }} strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                  {selected && isFast ? (
                    <span
                      className="pointer-events-none absolute flex items-center justify-center rounded-full bg-[#FEF9C3]"
                      style={{ right: -3, top: -3, width: 14, height: 14 }}
                    >
                      <Zap style={{ width: 8, height: 8 }} className="text-[#854D0E]" fill="currentColor" strokeWidth={0} />
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded-full border border-dashed"
              style={{
                height: 32,
                width: 32,
                borderColor: MERCH.border,
                backgroundColor: MERCH.primarySoft,
                fontSize: 11,
                fontWeight: 600,
                color: MERCH.primary,
              }}
            >
              12+
            </button>
        </div>
      </div>

      <div
        className="shrink-0"
        style={{ marginTop: SECTION_GAP, marginBottom: TOOLS_BOTTOM_GAP }}
      >
        <div
          className={`overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${
            interactive ? "" : " pointer-events-auto"
          }`}
          role="toolbar"
          aria-label="Design tools"
          style={{
            WebkitOverflowScrolling: "touch",
            width: MERCH_WIDTH,
            scrollPaddingInline: GRID_GUTTER,
          }}
        >
          <div
            className="flex w-max flex-nowrap gap-2"
            style={{
              paddingInline: GRID_GUTTER,
              paddingBottom: TOOL_SHADOW_BLEED,
            }}
          >
          {TOOL_ITEMS.map((item) => {
            const isUpload = "id" in item && item.id === "upload";
            const isImageAi = "id" in item && item.id === "image-ai";
            const tileProps = {
              className: "flex shrink-0 flex-col items-center justify-center bg-white",
              style: {
                display: "flex" as const,
                flexDirection: "column" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                width: 64,
                height: 56,
                padding: "4px 2px",
                gap: 0,
                borderRadius: 12,
                backgroundColor: "#FFF",
                boxShadow: TOOL_TILE_SHADOW,
              },
            };
            const tileContent = (
              <div
                className="flex flex-col items-center"
                style={{ width: 56, gap: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- bundled SVG asset */}
                <img
                  src={item.iconSrc}
                  alt=""
                  width={26}
                  height={26}
                  className="block shrink-0"
                  style={{ margin: 0, padding: 0, display: "block" }}
                  draggable={false}
                />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: 56,
                    height: 20,
                    margin: 0,
                    padding: 0,
                    color: "var(--Dark-Gray-5, #474B6D)",
                    textAlign: "center",
                    fontFeatureSettings: "'liga' off, 'clig' off",
                    fontFamily: '"Noto Sans"',
                    fontSize: 11,
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "14px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );

            if (interactive && isUpload) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={openNativeUpload}
                  aria-label="Upload image"
                  {...tileProps}
                >
                  {tileContent}
                </button>
              );
            }

            if (interactive && isImageAi) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={openImageAiSheet}
                  aria-label="Image AI"
                  aria-expanded={imageAiSheetOpen}
                  {...tileProps}
                >
                  {tileContent}
                </button>
              );
            }

            return (
              <div key={item.label} {...tileProps}>
                {tileContent}
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[105]">
        <AnimatePresence mode="sync" initial={false}>
          {promptFocused && imageAiSheetOpen ? (
            <IosSoftwareKeyboard key="keyboard" interactive={interactive} />
          ) : (
            <motion.div
              key="safari"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: FP_DURATION.base, ease: FP_EASE.out }}
            >
              <IosSafariChrome url="freshprints.com" compact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MerchImageAiActionSheet
        open={imageAiSheetOpen}
        onClose={() => setImageAiSheetOpen(false)}
        bottomInset={bottomChromeHeight}
        onPromptFocusChange={setPromptFocused}
        onGraphicApplied={(graphicUrl) => setUploadedDesignUrl(graphicUrl)}
      />
    </div>
  );
}
