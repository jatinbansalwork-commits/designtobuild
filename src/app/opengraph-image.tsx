import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            top: -140,
            right: -60,
            width: 440,
            height: 440,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(79,70,229,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(255,122,40,0.32) 0%, transparent 68%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            color: "#a1a1aa",
            letterSpacing: "-0.02em",
          }}
        >
          Portfolio showcase
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "#d4d4d8",
              maxWidth: 920,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          <span style={{ display: "flex" }}>Kalash</span>
          <span style={{ display: "flex", color: "#52525b" }}>·</span>
          <span style={{ display: "flex" }}>FinGuard</span>
          <span style={{ display: "flex", color: "#52525b" }}>·</span>
          <span style={{ display: "flex" }}>Saltmine</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
