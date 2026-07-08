import type { DetailCanvasFrame as DetailCanvasFrameConfig } from "@/lib/details-data";
import { SaltminePlanPreview } from "@/components/saltmine-plan-preview";

export function DetailCanvasFrameContent({
  frame,
  interactive = false,
}: {
  frame: DetailCanvasFrameConfig;
  interactive?: boolean;
}) {
  if (frame.flow === "saltmine-plan") {
    return <SaltminePlanPreview interactive={interactive} />;
  }

  return null;
}
