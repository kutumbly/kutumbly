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

// ═══════════════════════════════════════════════════════════
// FILE 1: app/sitemap.ts
// Place at: frontend/src/app/sitemap.ts
// ═══════════════════════════════════════════════════════════
//
// import type { MetadataRoute } from "next";
//
// const SITE_URL = "https://kutumbly.com";
//
// export default function sitemap(): MetadataRoute.Sitemap {
//   return [
//     {
//       url: SITE_URL,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 1.0,
//       alternates: {
//         languages: {
//           "en-IN": `${SITE_URL}/en`,
//           "hi-IN": `${SITE_URL}/hi`,
//         },
//       },
//     },
//     {
//       url: `${SITE_URL}/features`,
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.9,
//     },
//     {
//       url: `${SITE_URL}/privacy`,
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.7,
//     },
//     {
//       url: `${SITE_URL}/about`,
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//   ];
// }

// ═══════════════════════════════════════════════════════════
// FILE 2: app/robots.ts
// Place at: frontend/src/app/robots.ts
// ═══════════════════════════════════════════════════════════
//
// import type { MetadataRoute } from "next";
//
// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       {
//         userAgent: "*",
//         allow: "/",
//         disallow: ["/api/", "/_next/", "/scratch/"],
//       },
//     ],
//     sitemap: "https://kutumbly.com/sitemap.xml",
//     host: "https://kutumbly.com",
//   };
// }

/**
 * HOW TO USE:
 *
 * 1. Create frontend/src/app/sitemap.ts
 *    — Copy the sitemap code above (uncomment it)
 *
 * 2. Create frontend/src/app/robots.ts
 *    — Copy the robots code above (uncomment it)
 *
 * 3. These are Next.js 14 App Router native files.
 *    No extra packages needed.
 *
 * 4. After deploy, verify at:
 *    https://kutumbly.com/sitemap.xml
 *    https://kutumbly.com/robots.txt
 *
 * 5. Submit sitemap in Google Search Console:
 *    https://search.google.com/search-console
 *    → Sitemaps → Add: https://kutumbly.com/sitemap.xml
 */

export const SITEMAP_INSTRUCTIONS = `
SITEMAP & ROBOTS SETUP — KUTUMBLY SEO

Step 1: Create /frontend/src/app/sitemap.ts (code in this file)
Step 2: Create /frontend/src/app/robots.ts (code in this file)
Step 3: npm run build — verify no TypeScript errors
Step 4: Deploy to GitHub Pages
Step 5: Submit https://kutumbly.com/sitemap.xml to Google Search Console
Step 6: Submit to Bing Webmaster Tools as well
`;
