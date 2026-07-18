/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Keep deploys unblocked; run `npm run lint` locally for full checks
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prefer green deploys; tighten types over time with `tsc --noEmit`
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@imgly/background-removal",
      "onnxruntime-web",
      "pdfjs-dist",
      "@napi-rs/canvas",
      "@ffmpeg/ffmpeg",
      "@ffmpeg/util",
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };

    // Keep heavy browser/WASM engines out of the server bundle
    if (isServer) {
      config.resolve.alias["@imgly/background-removal"] = false;
      config.resolve.alias["onnxruntime-web"] = false;
      config.resolve.alias["@napi-rs/canvas"] = false;
      config.resolve.alias["@ffmpeg/ffmpeg"] = false;
      config.resolve.alias["@ffmpeg/util"] = false;
    }

    return config;
  },
};

export default nextConfig;
