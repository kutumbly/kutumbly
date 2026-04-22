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

import React from 'react';
import { Metadata } from 'next';
import LandingContent from '@/components/landing/LandingContent';
import { Language, SUPPORTED_LANGUAGES, DICTIONARY } from '@/lib/i18n';
import { metadata as baseMetadata } from '@/components/seo/metadata';

interface PageProps {
  params: Promise<{ lang: string }>;
}

// 1. Generate Static Folders during Build
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({
    lang: l.code,
  }));
}

// 2. Generate Localized Metadata for SEO
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: langParam } = await props.params;
  const lang = langParam as Language || 'en';
  
  const title = DICTIONARY["landing.meta.title"]?.[lang] || DICTIONARY["landing.meta.title"]?.['en'];
  const description = DICTIONARY["landing.meta.description"]?.[lang] || DICTIONARY["landing.meta.description"]?.['en'];

  return {
    title,
    description,
    alternates: {
      canonical: `https://kutumbly.com/${lang}`,
    },
  };
}

export default async function LocalizedLandingPage(props: PageProps) {
  const { lang: langParam } = await props.params;
  const lang = langParam as Language;
  return <LandingContent forcedLang={lang} />;
}
