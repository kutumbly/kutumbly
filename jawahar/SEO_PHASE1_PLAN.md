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

# SEO Phase 1 — Implementation Plan
> **Scope:** Technical SEO Foundation — GitHub Pages + Next.js 14  
> **Timeline:** Days 1–7  
> **Governed by:** aiprotocol.md + AI_GUIDELINES.md

---

## 1. Understanding
Kutumbly.com is deployed via GitHub Pages using Next.js static export. Currently zero SEO signals exist — no meta tags, no schema, no sitemap, no robots.txt. Goal is to build the complete technical SEO foundation before launch so Google can crawl, index, and rank the site correctly from day one.

**Key constraint:** GitHub Pages = static export only (`output: "export"` in next.config.js). No server-side rendering.

---

## 2. Plan

### Files to CREATE (new):
| File | Location | Purpose |
| :--- | :--- | :--- |
| `sitemap.ts` | `frontend/src/app/sitemap.ts` | Auto-generates sitemap.xml |
| `robots.ts` | `frontend/src/app/robots.ts` | Auto-generates robots.txt |
| `SchemaOrg.tsx` | `frontend/src/components/seo/SchemaOrg.tsx` | 4 JSON-LD schemas |
| `og-image.png` | `frontend/public/branding/og-image.png` | 1200×630 OG image |

### Files to MODIFY (existing):
| File | Change |
| :--- | :--- |
| `frontend/src/app/layout.tsx` | Add metadata export + SchemaOrg component |
| `frontend/next.config.js` | Add canonical URL + image config |

### Files to UPDATE (content):
| File | Change |
| :--- | :--- |
| `README.md` | Add SEO-optimized description + GitHub Topics |

---

## 3. Code

### Step 1 — layout.tsx changes

Find existing layout.tsx and:

**A) Add metadata export at top** (copy from `docs/seo/metadata.ts`):
```typescript
// Add after imports:
export { metadata, viewport } from "@/components/seo/metadata";
```

OR if metadata is inline, replace with the full metadata object from `docs/seo/metadata.ts`.

**B) Add SchemaOrg inside `<body>`:**
```typescript
import SchemaOrg from "@/components/seo/SchemaOrg";

// Inside <body>, before {children}:
<SchemaOrg />
{children}
```

---

### Step 2 — next.config.js

Verify these settings exist:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",           // GitHub Pages requirement
  trailingSlash: true,        // Better for static hosting
  images: {
    unoptimized: true,        // GitHub Pages can't optimize images
  },
  // Add if missing:
  env: {
    NEXT_PUBLIC_SITE_URL: "https://kutumbly.com",
  },
};
module.exports = nextConfig;
```

---

### Step 3 — Create sitemap.ts
```typescript
// frontend/src/app/sitemap.ts
import type { MetadataRoute } from "next";
const SITE_URL = "https://kutumbly.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
```

---

### Step 4 — Create robots.ts
```typescript
// frontend/src/app/robots.ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: "https://kutumbly.com/sitemap.xml",
    host: "https://kutumbly.com",
  };
}
```

---

### Step 5 — README.md GitHub Topics
Add to GitHub repo settings → Topics:
```
privacy, offline-first, india, family-os, nextjs, sqlite, local-first,
encrypted, hindi, zero-cloud, family-finance, sovereign
```

---

## 4. Test Cases

| TC | Action | Expected |
| :--- | :--- | :--- |
| TC-SEO-1 | `npm run build` | Zero TypeScript errors |
| TC-SEO-2 | Check `out/sitemap.xml` after build | File exists with all 4 URLs |
| TC-SEO-3 | Check `out/robots.txt` after build | File exists, sitemap URL correct |
| TC-SEO-4 | Open built index.html | `<meta name="description">` tag present |
| TC-SEO-5 | Check `<head>` in browser DevTools | JSON-LD script tags visible (4 schemas) |
| TC-SEO-6 | Google Rich Results Test | SoftwareApplication + FAQ schema valid |
| TC-SEO-7 | OG image check (opengraph.xyz) | 1200×630 image renders correctly |

---

## 5. Notes

### Critical: Static Export Limitation
GitHub Pages does not support Next.js Server Components with dynamic data.
All SEO files (sitemap.ts, robots.ts) must use static data only — no `fetch()` calls.

### OG Image
Create `frontend/public/branding/og-image.png` manually:
- Size: 1200 × 630 px
- Content: Kutumbly logo + tagline "India's Offline Family OS"
- Background: Deep Slate (#0f172a) with Gold accent
- This is the image shown when link is shared on WhatsApp, Twitter, LinkedIn

### Google Search Console Setup (after deploy)
1. Go to https://search.google.com/search-console
2. Add property: https://kutumbly.com
3. Verify via HTML tag method — paste token into `metadata.verification.google`
4. Submit sitemap: https://kutumbly.com/sitemap.xml
5. Request indexing for homepage

### Name Collision Risk
"Kutumb" app (community platform, 5Cr+ downloads) will compete for similar queries.
Always use full name "Kutumbly" in all content — never abbreviate to "Kutumb".
Target differentiating keywords: "offline family OS", "encrypted family data India",
"apna data apne paas" — not generic "family app India".

### README.md — IndexedDB Violation
Current README mentions `IndexedDB for persistence` — this violates AGENTS.md.
Update to: "encrypted .kutumb file via SQL.js (SQLite WASM)"
This also fixes an SEO inconsistency (terminology mismatch).
