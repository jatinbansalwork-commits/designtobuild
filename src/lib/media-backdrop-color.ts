/**
 * Sample edge pixels from an image/video frame to fill letterbox/pillarbox
 * blank space with a color that matches the media background.
 */
export function sampleMediaEdgeColor(
  source: HTMLImageElement | HTMLVideoElement,
): string | null {
  const width =
    source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const height =
    source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;

  if (!width || !height) return null;

  const sampleW = Math.min(48, width);
  const sampleH = Math.min(48, height);
  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.drawImage(source, 0, 0, sampleW, sampleH);
  } catch {
    return null;
  }

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  const push = (x: number, y: number) => {
    const px = Math.max(0, Math.min(sampleW - 1, Math.floor(x)));
    const py = Math.max(0, Math.min(sampleH - 1, Math.floor(y)));
    const data = ctx.getImageData(px, py, 1, 1).data;
    if (data[3] < 128) return;
    r += data[0];
    g += data[1];
    b += data[2];
    count += 1;
  };

  const step = 2;
  for (let x = 0; x < sampleW; x += step) {
    push(x, 0);
    push(x, sampleH - 1);
  }
  for (let y = 0; y < sampleH; y += step) {
    push(0, y);
    push(sampleW - 1, y);
  }

  if (count === 0) return null;

  return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
}
