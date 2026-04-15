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

"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function PrivacyPolicy() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24">
        <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
            <ArrowLeft size={16} /> {t('common.return_home')}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">{t('legal.privacy.title')}</h1>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
            {t('common.last_updated')}{new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert prose-p:text-text-secondary prose-p:font-medium prose-p:leading-[1.8] prose-headings:font-black prose-headings:text-text-primary max-w-none">
            <h2>{t('legal.privacy.intro.title')}</h2>
            <p>
              {t('legal.privacy.intro.content')}
            </p>

            <h2>{t('legal.privacy.owner.title')}</h2>
            <p>
              {t('legal.privacy.owner.content')}
            </p>

            <h2>{t('legal.privacy.encryption.title')}</h2>
            <p>
              {t('legal.privacy.encryption.content')}
            </p>

            <h2>{t('legal.privacy.telemetry.title')}</h2>
            <p>
              {t('legal.privacy.telemetry.content')}
            </p>

            <h2>{t('legal.privacy.portability.title')}</h2>
            <p>
              {t('legal.privacy.portability.content')}
            </p>

            <div className="mt-16 p-8 bg-clinical border border-gold/20 rounded-[2rem] text-center">
              <h3 className="text-sm font-black text-gold uppercase tracking-widest mb-2 mt-0">{t('legal.privacy.guarantee.title')}</h3>
              <p className="text-xs mb-0">{t('legal.privacy.guarantee.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
