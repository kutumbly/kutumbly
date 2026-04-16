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

"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function TermsOfService() {
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
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">{t('legal.terms.title')}</h1>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
            {t('common.last_updated')}{new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert prose-p:text-text-secondary prose-p:font-medium prose-p:leading-[1.8] prose-headings:font-black prose-headings:text-text-primary max-w-none">
            <h2>{t('legal.terms.acceptance.title')}</h2>
            <p>
              {t('legal.terms.acceptance.content')}
            </p>

            <h2>{t('legal.terms.desc.title')}</h2>
            <p>
              {t('legal.terms.desc.content')}
            </p>

            <h2>{t('legal.terms.responsibility.title')}</h2>
            <p>
              {t('legal.terms.responsibility.content')}
            </p>

            <h2>{t('legal.terms.liability.title')}</h2>
            <p>
              {t('legal.terms.liability.content')}
            </p>

            <h2>{t('legal.terms.ip.title')}</h2>
            <p>
              {t('legal.terms.ip.content')}
            </p>

            <h2>{t('legal.terms.sovereignty.title')}</h2>
            <p>
              {t('legal.terms.sovereignty.content')}
            </p>

          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
