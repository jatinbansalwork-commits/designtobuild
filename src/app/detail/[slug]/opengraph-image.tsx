import { ImageResponse } from "next/og";
import { GRID_DETAILS, getDetailBySlug } from "@/lib/details-data";
import { OG_SIZE } from "@/lib/detail-seo";
import { SITE_NAME } from "@/lib/seo";

export const alt = "Project preview";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  const seen = new Set<string>();
  return GRID_DETAILS.filter((detail) => {
    if (seen.has(detail.slug)) return false;
    seen.add(detail.slug);
    return true;
  }).map((detail) => ({ slug: detail.slug }));
}

export default async function DetailOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getDetailBySlug(slug);

  if (!detail) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            color: "#fafafa",
            fontSize: 48,
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size },
    );
  }

  const categories = detail.categories.join(" · ");
  const accent = detail.ogAccent;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: `radial-gradient(circle, ${accent}33 0%, transparent 68%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              fontWeight: 600,
              color: "#a1a1aa",
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: accent,
              }}
            />
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#71717a",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {categories}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
            }}
          >
            {detail.title}
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "#d4d4d8",
              maxWidth: 920,
            }}
          >
            {detail.seoDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
            {detail.date}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 999,
              backgroundColor: `${accent}22`,
              border: `1px solid ${accent}55`,
              padding: "12px 22px",
              color: "#fafafa",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Live interactive preview
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
