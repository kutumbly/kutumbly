/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
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

/**
 * SchemaOrg.tsx
 *
 * Renders all Schema.org JSON-LD blocks for Kutumbly.
 * Add this component inside <body> in layout.tsx.
 *
 * Usage:
 *   import SchemaOrg from "@/components/seo/SchemaOrg";
 *   // In layout.tsx body:
 *   <SchemaOrg />
 */

const SITE_URL = "https://kutumbly.com";

// ─────────────────────────────────────────────────────────────
// SCHEMA 1 — SoftwareApplication
// ─────────────────────────────────────────────────────────────
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kutumbly",
  alternateName: "कुटुंबली",
  url: SITE_URL,
  applicationCategory: "LifestyleApplication",
  applicationSubCategory: "FamilyManagement",
  operatingSystem: "Web, Windows, macOS, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/ComingSoon",
  },
  description:
    "India's first offline-first, encrypted Family Operating System. " +
    "Manage family finances, health records, diary, and cultural events — " +
    "all stored locally on your device. Zero Cloud. Total Privacy.",
  featureList: [
    "100% Offline — no internet required",
    "End-to-end encrypted .kutumb data files",
    "Family finance and home accounting",
    "Multi-member health record tracking",
    "Private family diary with mood analytics",
    "Cultural event and Nevata (gift) management",
    "Home staff attendance and salary ledger",
    "Bilingual — English and Hindi (Devanagari)",
  ],
  inLanguage: ["en-IN", "hi-IN"],
  screenshot: `${SITE_URL}/branding/screenshot-dashboard.png`,
  author: {
    "@type": "Organization",
    name: "AITDL Network",
    url: "https://aitdl.in",
  },
  publisher: {
    "@type": "Organization",
    name: "AITDL Network",
    url: "https://aitdl.in",
  },
};

// ─────────────────────────────────────────────────────────────
// SCHEMA 2 — Organization
// ─────────────────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AITDL Network",
  alternateName: "Kutumbly",
  url: "https://aitdl.in",
  logo: `${SITE_URL}/branding/logo-en.png`,
  sameAs: [
    "https://github.com/kutumbly",
    "https://aitdl.com",
    "https://aitdl.in",
  ],
  foundingDate: "2026",
  foundingLocation: {
    "@type": "Place",
    name: "Gorakhpur, Uttar Pradesh, India",
  },
  founder: {
    "@type": "Person",
    name: "Jawahar R. Mallahllah",
    jobTitle: "System Architect & Founder",
    url: "https://aitdl.in",
  },
  description:
    "AITDL Network builds Sovereign Indian workspaces — privacy-first, " +
    "offline-first software for Indian families and businesses.",
  areaServed: "IN",
  knowsAbout: [
    "Family Privacy Software",
    "Offline-First Applications",
    "Encrypted Data Storage",
    "Indian EdTech",
    "B2B SaaS India",
  ],
};

// ─────────────────────────────────────────────────────────────
// SCHEMA 3 — FAQPage (boosts featured snippets)
// ─────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kutumbly kya hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Kutumbly India ka pehla offline-first Family Operating System hai. " +
          "Isme aap apni family ki finances, health records, diary, aur cultural " +
          "events manage kar sakte hain — sab kuch aapke device par, kisi server par nahi.",
      },
    },
    {
      "@type": "Question",
      name: "What is Kutumbly?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Kutumbly is India's first offline-first, encrypted Family OS. " +
          "It lets Indian families manage finances, health, diary, and cultural " +
          "events with complete data privacy — all data stays on your device, " +
          "never on any cloud server.",
      },
    },
    {
      "@type": "Question",
      name: "Is Kutumbly free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Kutumbly is currently in pre-launch. The core family management " +
          "features will be available for free. Premium modules will be offered " +
          "at affordable pricing for Indian families.",
      },
    },
    {
      "@type": "Question",
      name: "Kutumbly mein data kahan store hota hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Kutumbly mein aapka data sirf aapke device par store hota hai — " +
          "ek encrypted .kutumb file mein. Koi cloud server nahi, koi tracking " +
          "nahi, koi third party access nahi.",
      },
    },
    {
      "@type": "Question",
      name: "Does Kutumbly work without internet?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Kutumbly is built 100% offline-first. Every feature works " +
          "without an internet connection. Your family's data never leaves your device.",
      },
    },
    {
      "@type": "Question",
      name: "Kutumbly aur doosre family apps mein kya fark hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Doosre apps aapka data unke servers par rakhte hain. Kutumbly " +
          "Zero Cloud philosophy pe kaam karta hai — aapka data sirf aapke " +
          "paas rahta hai, encrypted .kutumb file mein. Koi subscription, " +
          "koi data selling, koi ads nahi.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SCHEMA 4 — WebSite (enables Sitelinks Search Box)
// ─────────────────────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kutumbly",
  url: SITE_URL,
  inLanguage: ["en-IN", "hi-IN"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function SchemaOrg() {
  const schemas = [
    softwareApplicationSchema,
    organizationSchema,
    faqSchema,
    websiteSchema,
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
