import type { Metadata } from "next";
import type { DetailItem } from "@/lib/details-data";
import { SITE_LOCALE, SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { getAbsoluteUrl, getDetailShareUrl } from "@/lib/site-url";

const OG_SIZE = { width: 1200, height: 630 } as const;

export function getDetailShareDescription(detail: DetailItem) {
  return detail.seoDescription;
}

/** Stable static PNG LinkedIn/X can fetch without route handlers. */
export function getDetailOpenGraphImagePath(slug: string) {
  return `/og/${slug}.png`;
}

function toIsoDate(displayDate: string) {
  const parsed = Date.parse(displayDate);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

/** Per-project metadata for rich social previews (Slack, X, LinkedIn, etc.). */
export function buildDetailMetadata(detail: DetailItem): Metadata {
  const url = getDetailShareUrl(detail.slug);
  const description = getDetailShareDescription(detail);
  const title = detail.title;
  const imageUrl = getAbsoluteUrl(getDetailOpenGraphImagePath(detail.slug));
  const image = {
    url: imageUrl,
    secureUrl: imageUrl,
    type: "image/png" as const,
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    alt: `${detail.title} — ${SITE_NAME}`,
  };
  const publishedTime = toIsoDate(detail.date);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${detail.title} · ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "article",
      ...(publishedTime ? { publishedTime } : {}),
      authors: [detail.author],
      tags: [...detail.categories, ...(detail.portfolioTags ?? [])],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      creator: TWITTER_HANDLE,
      title: `${detail.title} · ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export { OG_SIZE };
