import type { ReactNode } from "react";
import { DetailKalashFlowEmbed } from "@/components/detail-kalash-flow-embed";
import { KalashAppPreview } from "@/components/kalash-app-preview";
import { KalashSaveMorePreview } from "@/components/kalash-save-more-preview";
import { SaltmineFinGuardPreview } from "@/components/saltmine-finguard-preview";
import { MerchPhoneShell } from "@/components/merch-phone-shell";
import { SaltminePlanPreview } from "@/components/saltmine-plan-preview";
import { DETAIL_POPUP_MEDIA_CLASS } from "@/lib/detail-popup-media";
import { PHONE_FRAME, phoneFrameDropShadowStyle, phoneFrameStyle, phoneScreenInset, phoneScreenStyle } from "@/lib/phone-frame";
import { IPAD_FRAME, ipadFrameDropShadowStyle, ipadFrameStyle, ipadScreenInset, ipadScreenStyle } from "@/lib/ipad-frame";
import Image from "next/image";

type MockupFlow = "kalash" | "kalash-save-more" | "finguard" | "saltmine-plan" | "merch";

interface DetailMobileMockupProps {
  color: string;
  aspectRatio?: string;
  mockupAspectRatio?: string;
  imageSrc?: string;
  flow?: MockupFlow;
  title: string;
  compact?: boolean;
  /** Fill a variable-size editorial grid tile instead of using a fixed ratio. */
  fill?: boolean;
  /** Fixed 16:9 popup canvas — shared FreshPrints media area rule */
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
      <div className="relative h-full w-full overflow-hidden isolate" style={ipadFrameStyle}>
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
  /** Fit inside parent while preserving aspect ratio (grid tiles). */
  contain = false,
}: {
  children: ReactNode;
  className?: string;
  aspectRatio?: string;
  contain?: boolean;
}) {
  // Parse "393 / 852" (or "393/852") into width/height for contain sizing.
  const [arW, arH] = aspectRatio.split("/").map((part) => Number(part.trim()));
  const hasRatio = Number.isFinite(arW) && Number.isFinite(arH) && arW > 0 && arH > 0;

  return (
    <div
      className={`relative shrink-0 ${className ?? ""}`}
      style={{
        ...phoneFrameDropShadowStyle,
        aspectRatio,
        ...(contain && hasRatio
          ? {
              // Fit tile: never force both height and a narrower max-width (that stretches).
              height: `min(90cqh, calc(90cqw * ${arH} / ${arW}))`,
              width: `min(90cqw, calc(90cqh * ${arW} / ${arH}))`,
              maxHeight: "none",
              maxWidth: "none",
            }
          : {}),
      }}
    >
      <div className="relative h-full w-full overflow-hidden isolate" style={phoneFrameStyle}>
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
  fill = false,
  preview = false,
}: DetailMobileMockupProps) {
  const isKalashFlow = flow === "kalash" || flow === "kalash-save-more";
  const isIpadFlow = flow === "finguard" || flow === "saltmine-plan";
  const isMerchFlow = flow === "merch";
  const showKalashFlow = isKalashFlow && (preview || !compact);
  const showKalashLivePreview = isKalashFlow && compact && !preview;
  const embedInitialScreen =
    flow === "kalash-save-more" ? "save-more" : "app";

  if (isMerchFlow) {
    const phoneSizeClass = compact
      ? ""
      : preview
        ? "h-[90%] w-auto"
        : "h-[94%] w-auto max-w-[min(72%,22rem)] md:max-w-[min(36%,24rem)]";

    return (
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden ${
          compact || fill ? "[container-type:size] " : ""
        }${fill ? "h-full " : ""}${
          preview ? DETAIL_POPUP_MEDIA_CLASS : compact ? "" : "aspect-[4/5] md:aspect-video"
        }`}
        style={{ backgroundColor: color, ...(compact && aspectRatio ? { aspectRatio } : {}) }}
      >
        <PhoneDeviceFrame
          className={phoneSizeClass}
          aspectRatio={mockupAspectRatio}
          contain={compact || fill}
        >
          <MerchPhoneShell interactive={preview} />
        </PhoneDeviceFrame>
      </div>
    );
  }

  if (isIpadFlow) {
    const ipadSizeClass = compact
      ? "w-[101.2%] max-w-[101.2%]"
      : preview
        ? "w-[80%] max-w-[52.7rem]"
        : "w-[88%] max-w-[52rem]";
    return (
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden ${
          fill ? "h-full " : ""
        }${
          preview ? `${DETAIL_POPUP_MEDIA_CLASS} p-6 md:p-10` : compact ? "p-2" : "aspect-[16/10] p-6"
        }`}
        style={{
          backgroundColor: color,
          ...(compact && aspectRatio ? { aspectRatio } : {}),
        }}
      >
        <IpadDeviceFrame className={`relative z-10 ${ipadSizeClass}`}>
          {flow === "finguard" ? (
            <SaltmineFinGuardPreview interactive={preview} />
          ) : (
            <SaltminePlanPreview interactive={preview} />
          )}
        </IpadDeviceFrame>
      </div>
    );
  }

  const phoneSizeClass = compact
    ? ""
    : preview
      ? "h-[90%] w-auto"
      : "h-[94%] w-auto max-w-[min(72%,22rem)] md:max-w-[min(36%,24rem)]";

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${
        compact || fill ? "[container-type:size] " : ""
      }${fill ? "h-full " : ""}${
        preview ? DETAIL_POPUP_MEDIA_CLASS : compact ? "" : "aspect-[4/5] md:aspect-video"
      }`}
      style={{ backgroundColor: color, ...(compact && aspectRatio ? { aspectRatio } : {}) }}
    >
      <PhoneDeviceFrame
        className={phoneSizeClass}
        aspectRatio={mockupAspectRatio}
        contain={compact || fill}
      >
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
