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

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://kutumbly.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
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
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
