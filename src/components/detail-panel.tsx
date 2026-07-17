import type { DetailItem } from "@/lib/details-data";
import { DETAIL_POPUP_MEDIA_CLASS } from "@/lib/detail-popup-media";
import { DetailCanvasFrame } from "@/components/detail-canvas-frame";
import { DetailCanvasFrameContent } from "@/components/detail-canvas-frame-content";
import { DetailMobileMockup } from "@/components/detail-mobile-mockup";
import { DetailPopupImage } from "@/components/detail-popup-image";
import { DetailPopupMeta } from "@/components/detail-popup-meta";
import { DetailVideoPlayer } from "@/components/detail-video-player";

export function DetailPanel({
  detail,
  preview = false,
  onFilterSelect,
}: {
  detail: DetailItem;
  preview?: boolean;
  onFilterSelect?: (filter: string) => void;
}) {
  const media = (
    <div className="w-full shrink-0">
      {detail.media.type === "color" ? (
        detail.media.mockup ? (
          <DetailMobileMockup
            color={detail.media.color}
            mockupAspectRatio={detail.media.mockup.aspectRatio}
            imageSrc={detail.media.mockup.imageSrc}
            flow={detail.media.mockup.flow}
            title={detail.title}
            preview={preview}
          />
        ) : (
          <div
            className={`flex w-full overflow-hidden ${
              preview
                ? `${DETAIL_POPUP_MEDIA_CLASS}${detail.media.canvasFrame ? " bg-white p-8" : ""}`
                : ""
            }`}
            style={{
              aspectRatio: preview ? undefined : detail.media.aspectRatio,
              backgroundColor:
                preview && detail.media.canvasFrame
                  ? "#ffffff"
                  : detail.media.color,
            }}
          >
            {detail.media.canvasFrame ? (
              <DetailCanvasFrame
                width={detail.media.canvasFrame.width}
                height={detail.media.canvasFrame.height}
                src={detail.media.canvasFrame.src}
                title={detail.title}
                fill={preview}
              >
                <DetailCanvasFrameContent
                  frame={detail.media.canvasFrame}
                  interactive={preview}
                />
              </DetailCanvasFrame>
            ) : (
              <div className="h-full w-full" aria-hidden />
            )}
          </div>
        )
      ) : detail.media.type === "video" ? (
        <DetailVideoPlayer
          src={detail.media.src}
          title={detail.title}
          preview={preview}
        />
      ) : (
        <DetailPopupImage
          src={detail.media.src}
          title={detail.title}
          cover={false}
        />
      )}
    </div>
  );

  return (
    <>
      {media}
      <DetailPopupMeta detail={detail} onFilterSelect={onFilterSelect} />
    </>
  );
}
