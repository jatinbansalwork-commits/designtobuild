import type { ReactNode } from "react";
import { DetailKalashFlowEmbed } from "@/components/detail-kalash-flow-embed";
import { KalashAppPreview } from "@/components/kalash-app-preview";
import { KalashSaveMorePreview } from "@/components/kalash-save-more-preview";
import { SaltmineFinGuardPreview } from "@/components/saltmine-finguard-preview";
import { PHONE_FRAME, phoneFrameDropShadowStyle, phoneFrameStyle, phoneScreenInset, phoneScreenStyle } from "@/lib/phone-frame";
import { IPAD_FRAME, ipadFrameDropShadowStyle, ipadFrameStyle, ipadScreenInset, ipadScreenStyle } from "@/lib/ipad-frame";
import Image from "next/image";

type MockupFlow = "kalash" | "kalash-save-more" | "finguard";

interface DetailMobileMockupProps {
  color: string;
  aspectRatio?: string;
  mockupAspectRatio?: string;
  imageSrc?: string;
  flow?: MockupFlow;
  title: string;
  compact?: boolean;
  /** 16:9 popup canvas — used in the detail preview modal */
  preview?: boolean;
}

function IpadDeviceFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 ${className ?? ""}`}
      style={{ ...ipadFrameDropShadowStyle, aspectRatio: IPAD_FRAME.aspectRatio }}
    >
      <div className="relative h-full w-full overflow-hidden" style={ipadFrameStyle}>
        <div
          className="absolute overflow-hidden"
          style={{ ...ipadScreenStyle, ...ipadScreenInset }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function PhoneDeviceFrame({
  children,
  className,
  aspectRatio = PHONE_FRAME.aspectRatio,
}: {
  children: ReactNode;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={`relative shrink-0 ${className ?? ""}`}
      style={{ ...phoneFrameDropShadowStyle, aspectRatio }}
    >
      <div className="relative h-full w-full overflow-hidden" style={phoneFrameStyle}>
        <div
          className="absolute overflow-hidden"
          style={{ ...phoneScreenStyle, ...phoneScreenInset }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function DetailMobileMockup({
  color,
  aspectRatio,
  mockupAspectRatio = PHONE_FRAME.aspectRatio,
  imageSrc,
  flow,
  title,
  compact = false,
  preview = false,
}: DetailMobileMockupProps) {
  const isKalashFlow = flow === "kalash" || flow === "kalash-save-more";
  const isFinguardFlow = flow === "finguard";
  const showKalashFlow = isKalashFlow && (preview || !compact);
  const showKalashLivePreview = isKalashFlow && compact && !preview;
  const embedInitialScreen =
    flow === "kalash-save-more" ? "save-more" : "app";

  if (isFinguardFlow) {
    const ipadSizeClass = compact
      ? "w-[101.2%] max-w-[101.2%]"
      : preview
        ? "w-[73%] max-w-[52.7rem]"
        : "w-[88%] max-w-[52rem]";
    return (
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden ${
          preview ? "aspect-video p-6 md:p-10" : compact ? "p-2" : "aspect-[16/10] p-6"
        }`}
        style={{
          backgroundColor: color,
          ...(compact && aspectRatio ? { aspectRatio } : {}),
        }}
      >
        <IpadDeviceFrame className={`relative z-10 ${ipadSizeClass}`}>
          <SaltmineFinGuardPreview interactive={preview} />
        </IpadDeviceFrame>
      </div>
    );
  }

  const phoneSizeClass = compact
    ? "h-[90%] w-auto max-w-[46%]"
    : preview
      ? "h-[90%] w-auto"
      : "h-[94%] w-auto max-w-[min(72%,22rem)] md:max-w-[min(36%,24rem)]";

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${
        preview ? "aspect-video" : compact ? "" : "aspect-[4/5] md:aspect-video"
      }`}
      style={{ backgroundColor: color, ...(compact && aspectRatio ? { aspectRatio } : {}) }}
    >
      <PhoneDeviceFrame className={phoneSizeClass} aspectRatio={mockupAspectRatio}>
        {showKalashFlow ? (
          <DetailKalashFlowEmbed initialScreen={embedInitialScreen} />
        ) : showKalashLivePreview ? (
          flow === "kalash-save-more" ? (
            <KalashSaveMorePreview />
          ) : (
            <KalashAppPreview />
          )
        ) : imageSrc ? (
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover object-top"
              sizes={compact ? "(min-width: 768px) 200px, 40vw" : "(min-width: 768px) 480px, 70vw"}
              priority={!compact}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-neutral-950" />
        )}
      </PhoneDeviceFrame>
    </div>
  );
}
