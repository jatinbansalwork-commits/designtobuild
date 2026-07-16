import Image from "next/image";
import type { DetailMedia } from "@/lib/details-data";
import { DetailCanvasFrame } from "@/components/detail-canvas-frame";
import { DetailCanvasFrameContent } from "@/components/detail-canvas-frame-content";
import { DetailMobileMockup } from "@/components/detail-mobile-mockup";

interface DetailMediaPreviewProps {
  media: DetailMedia;
  title: string;
  priority?: boolean;
  aspectRatio?: string;
  cover?: boolean;
}

export function DetailMediaPreview({
  media,
  title,
  priority = false,
  aspectRatio,
  cover = false,
}: DetailMediaPreviewProps) {
  const ratio = aspectRatio ?? media.aspectRatio;

  if (media.type === "color" && media.mockup) {
    return (
      <DetailMobileMockup
        color={media.color}
        aspectRatio={ratio}
        mockupAspectRatio={media.mockup.aspectRatio}
        imageSrc={media.mockup.imageSrc}
        flow={media.mockup.flow}
        title={title}
        compact={cover}
      />
    );
  }

  if (media.type === "color" && media.canvasFrame) {
    return (
      <div
        className="relative w-full shrink-0 overflow-hidden bg-surface"
        style={{ aspectRatio: ratio }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ backgroundColor: media.color }}
        >
          <DetailCanvasFrame
            width={media.canvasFrame.width}
            height={media.canvasFrame.height}
            src={media.canvasFrame.src}
            title={title}
            fill
          >
            <DetailCanvasFrameContent frame={media.canvasFrame} />
          </DetailCanvasFrame>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full shrink-0 overflow-hidden"
      style={{
        aspectRatio: ratio,
        backgroundColor:
          media.type === "color"
            ? media.color
            : media.type === "image" || media.type === "video"
              ? "transparent"
              : undefined,
      }}
    >
      {media.type === "color" ? (
        media.canvasFrame ? null : (
          <div className="h-full w-full" style={{ backgroundColor: media.color }} aria-hidden />
        )
      ) : media.type === "video" ? (
        <video
          src={media.src}
          loop
          muted
          playsInline
          autoPlay
          className={cover ? "absolute inset-0 h-full w-full object-cover" : "h-auto w-full"}
          aria-label={title}
        />
      ) : /\.gif(?:$|[?#])/i.test(media.src) ? (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIF needs native img
        <img
          src={media.src}
          alt={title}
          className={
            cover
              ? "absolute inset-0 h-full w-full object-cover"
              : "h-auto w-full"
          }
          draggable={false}
        />
      ) : cover ? (
        <Image
          src={media.src}
          alt={title}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(min-width: 768px) 350px, 100vw"
          priority={priority}
        />
      ) : (
        <Image
          src={media.src}
          alt={title}
          width={1920}
          height={1080}
          className="h-auto w-full transition-transform duration-500"
          sizes="(min-width: 768px) 350px, 100vw"
          priority={priority}
        />
      )}
    </div>
  );
}
