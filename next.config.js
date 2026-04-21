/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    navigateFallbackDenylist: [/^\/$/],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // static export for portability
  images: { unoptimized: true },
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  env: {
    NEXT_PUBLIC_SITE_URL: "https://kutumbly.com",
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

module.exports = withPWA(nextConfig);
