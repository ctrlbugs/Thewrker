import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${BRAND.name} — ${BRAND.tagline}`;
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
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #072635 0%, #0f4c5c 45%, #13556a 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #01F0D0 0%, #0bd984 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 800,
              color: "#072635",
            }}
          >
            W
          </div>
          <div style={{ fontSize: "72px", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {BRAND.name}
          </div>
        </div>
        <div style={{ fontSize: "40px", fontWeight: 600, color: "#01F0D0", marginBottom: "20px" }}>
          {BRAND.tagline}
        </div>
        <div style={{ fontSize: "28px", lineHeight: 1.5, color: "rgba(255,255,255,0.88)", maxWidth: "900px" }}>
          {BRAND.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
