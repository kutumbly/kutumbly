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
const SITE_NAME = "Kutumbly — India's Offline Family OS";
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
    template: "%s | Kutumbly Sovereign OS",
  },
  description:
    "Kutumbly is India's first offline-first, encrypted Family Operating System. " +
    "Apni family ka data — finances, health, diary — 100% apne device par, " +
    "kisi server par nahi. Zero Cloud. Total Privacy. " +
    "Protect your parivar's legacy on your own terms.",

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
    "Sovereign OS",
    "bin internet ke family app",
    "purely offline family ledger",
    "safe family memories India",
    "Indian household OS"
  ],

  // ── Canonical & Alternate ──────────────────────────────────
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": `${SITE_URL}/en`,
      "hi-IN": `${SITE_URL}/hi`,
      "mr-IN": `${SITE_URL}/mr`,
      "gu-IN": `${SITE_URL}/gu`,
      "pa-IN": `${SITE_URL}/pa`,
      "ta-IN": `${SITE_URL}/ta`,
      "bho-IN": `${SITE_URL}/bho`,
      "kn-IN": `${SITE_URL}/kn`,
      "te-IN": `${SITE_URL}/te`,
      "ne-IN": `${SITE_URL}/ne`,
      "bn-IN": `${SITE_URL}/bn`,
      "mni-IN": `${SITE_URL}/mni`,
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
        url: "/branding/og-image.png",
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
  applicationName: "Kutumbly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kutumbly",
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

  // ── Verification ───────────────────────────────────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },

  // ── Category ───────────────────────────────────────────────
  category: "productivity",
};
