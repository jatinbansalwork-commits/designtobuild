/** Raster formats supported by in-browser background removal. */
export function canRemoveImageBackground(url: string) {
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("blob:")) {
    return false;
  }
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  return /\.(jpe?g|png|webp|heic|heif)$/.test(path) || url.startsWith("blob:");
}

async function loadImageInput(sourceUrl: string): Promise<string | Blob> {
  if (sourceUrl.startsWith("blob:") || sourceUrl.startsWith("/")) {
    return sourceUrl;
  }

  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(sourceUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error("Could not load image for background removal");
  }
  return response.blob();
}

/** Remove background in-browser via @imgly/background-removal (free, no API key). */
export async function removeImageBackground(
  sourceUrl: string,
  onProgress?: (fraction: number) => void,
): Promise<string> {
  const { removeBackground } = await import("@imgly/background-removal");
  const input = await loadImageInput(sourceUrl);

  const blob = await removeBackground(input, {
    progress: (_stage, current, total) => {
      if (total > 0) onProgress?.(current / total);
    },
  });

  return URL.createObjectURL(blob);
}
