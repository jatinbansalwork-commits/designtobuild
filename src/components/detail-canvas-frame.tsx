import Image from "next/image";
import type { ReactNode } from "react";

/** Centered mockup frame on a color canvas (e.g. Saltmine 920×710). */
export function DetailCanvasFrame({
  width,
  height,
  src,
  title,
  fill = false,
  children,
}: {
  width: number;
  height: number;
  src?: string;
  title: string;
  /** Scale frame to fill its container (grid card). */
  fill?: boolean;
  children?: ReactNode;
}) {
  const frameClass = fill
    ? "relative h-full min-h-0 w-full overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.06]"
    : "relative max-h-full max-w-full shrink-0 overflow-hidden bg-white shadow-[0_24px_64px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06]";

  const frameStyle = fill
    ? undefined
    : { width, height, aspectRatio: `${width} / ${height}` as const };

  return (
    <div className={frameClass} style={frameStyle}>
      {children ??
        (src ? (
          <Image
            src={src}
            alt={title}
            width={width}
            height={height}
            className="h-full w-full object-cover"
            priority
          />
        ) : null)}
    </div>
  );
}
