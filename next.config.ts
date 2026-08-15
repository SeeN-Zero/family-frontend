import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

// Content-Security-Policy applied to all routes in production builds.
// `'unsafe-inline'` for script/style is required by Next.js hydration payloads
// without a nonce-based setup; the header still blocks third-party script
// injection and restricts resource origins. Google Sign-In needs the
// accounts.google.com origins below.
const isProd = process.env.NODE_ENV === "production";
const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

if (isProd) {
  nextConfig.headers = async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://accounts.google.com https://*.googleapis.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.googleusercontent.com",
            `connect-src 'self' https://accounts.google.com https://*.googleapis.com ${apiBase}`,
            "font-src 'self' data:",
            "frame-src https://accounts.google.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ];
}

export default nextConfig;
