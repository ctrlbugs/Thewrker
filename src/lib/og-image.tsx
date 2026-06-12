import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";
export const ogImageAlt = `${BRAND.name} — ${BRAND.tagline}`;

function siteOrigin(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.siteUrl;
  return url.replace(/\/$/, "");
}

export function buildOgImage() {
  const logoUrl = `${siteOrigin()}${BRAND.logoIcon}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        <img src={logoUrl} width={280} height={280} alt="" />
      </div>
    ),
    { ...ogImageSize },
  );
}
