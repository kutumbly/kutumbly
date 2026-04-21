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
            <h2 className="text-3xl mb-8">{t('legal.privacy.mission_statement')}</h2>
            
            <div className="space-y-12 mt-12">
              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec1_title')}</h3>
                <p>{t('legal.privacy.sec1_txt')}</p>
              </section>

              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec2_title')}</h3>
                <p>{t('legal.privacy.sec2_txt')}</p>
              </section>

              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec3_title')}</h3>
                <p>{t('legal.privacy.sec3_txt')}</p>
              </section>

              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec4_title')}</h3>
                <p>{t('legal.privacy.sec4_txt')}</p>
              </section>

              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec5_title')}</h3>
                <p>{t('legal.privacy.sec5_txt')}</p>
              </section>

              <section>
                <h3 className="text-xl text-gold mb-4">{t('legal.privacy.sec6_title')}</h3>
                <p>{t('legal.privacy.sec6_txt')}</p>
              </section>
            </div>

            <div className="mt-20 p-12 bg-clinical border border-border-light rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <div className="w-24 h-24 border-2 border-gold rounded-full" />
              </div>
              <h3 className="text-2xl font-black text-text-primary mb-6">
                {t('legal.privacy.founder_note_title')}
              </h3>
              <p className="italic text-lg text-text-secondary leading-relaxed opacity-90">
                "{t('legal.privacy.founder_note_txt')}"
              </p>
              <div className="mt-8 text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                — {t('landing.footer.founder')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
