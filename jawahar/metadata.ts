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

import type { Metadata, Viewport } from "next";

// ─────────────────────────────────────────────────────────────
// SITE-WIDE SEO CONSTANTS
// ─────────────────────────────────────────────────────────────
const SITE_URL = "https://kutumbly.com";
const SITE_NAME = "Kutumbly";
const TWITTER_HANDLE = "@kutumbly";

// ─────────────────────────────────────────────────────────────
// VIEWPORT (separate export — Next.js 14+ requirement)
// ─────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#fcfaf7" },
  ],
};

// ─────────────────────────────────────────────────────────────
// ROOT METADATA
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Basic ──────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kutumbly — India's Offline Family OS | Zero Cloud Privacy",
    template: "%s | Kutumbly",
  },
  description:
    "Kutumbly is India's first offline-first, encrypted Family Operating System. " +
    "Apni family ka data — finances, health, diary — 100% apne device par, " +
    "kisi server par nahi. Zero Cloud. Total Privacy.",

  // ── Keywords ───────────────────────────────────────────────
  keywords: [
    "family privacy app India",
    "offline family management app",
    "encrypted family OS",
    "apna data apne paas",
    "family finance tracker India",
    "local first app India",
    "zero cloud family app",
    "kutumbly",
    "family OS India",
    "private family data India",
    "parivar data suraksha",
    "AITDL Network",
  ],

  // ── Canonical & Alternate ──────────────────────────────────
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": `${SITE_URL}/en`,
      "hi-IN": `${SITE_URL}/hi`,
    },
  },

  // ── Open Graph ─────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Kutumbly — India's Offline Family OS",
    description:
      "Apni family ka data 100% apne paas. No cloud. No tracking. " +
      "Finances, health, diary — sab encrypted, sab local.",
    images: [
      {
        url: "/branding/og-image.png",   // 1200×630 — create this file
        width: 1200,
        height: 630,
        alt: "Kutumbly — India's Sovereign Family OS",
      },
    ],
    locale: "en_IN",
  },

  // ── Twitter / X Card ───────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "Kutumbly — India's Offline Family OS",
    description:
      "Zero Cloud. Total Privacy. India's first encrypted Family OS. " +
      "Apna data, apne device par.",
    images: ["/branding/og-image.png"],
  },

  // ── App / PWA ──────────────────────────────────────────────
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  formatDetection: { telephone: false },

  // ── Robots ─────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Verification (fill after GSC / Bing setup) ─────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // yandex: "REPLACE_IF_NEEDED",
  },

  // ── Category ───────────────────────────────────────────────
  category: "productivity",
};
