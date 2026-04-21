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
import { ArrowLeft, Code, Star } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function FoundersPage() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
            <ArrowLeft size={16} /> {t('common.return_home')}
          </Link>
          
          <div className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-text-primary"
            >
              {t('FOUNDER_TITLE')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-sm md:text-base font-bold uppercase tracking-[0.2em] opacity-80 max-w-2xl mx-auto"
            >
              {t('landing.founders.subtitle')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pushpa D Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-secondary border border-border-light rounded-[3rem] p-10 md:p-14 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all font-inter"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-[200px] -z-10 group-hover:bg-gold/10 transition-all"></div>
               <div className="flex items-center gap-3 mb-10">
                  <Star className="text-gold" />
                  <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">{t('landing.founders.pd.role')}</h3>
               </div>
               
               <div className="mb-10 flex items-center gap-8">
                  <div className="w-28 h-28 bg-bg-primary border-4 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 scale-110">
                     <span className="text-4xl font-black text-text-primary">PD</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black tracking-tight text-text-primary mb-1">
                       {t('FOUNDER_PUSHPA')}
                    </h4>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em]">{t('landing.founders.pd.tagline')}</p>
                  </div>
               </div>

               <div className="text-base font-medium text-text-secondary leading-[1.8] space-y-6">
                  <p className="italic font-bold text-text-primary border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                    &quot;{t('landing.founders.pd.quote')}&quot;
                  </p>
                  <p>
                    {t('landing.founders.pd.bio_1')}
                  </p>
                  <p>
                    {t('landing.founders.pd.bio_2')}
                  </p>
               </div>
            </motion.div>

            {/* Jawahar M Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-bg-secondary border border-border-light rounded-[3rem] p-10 md:p-14 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all font-inter"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-[200px] -z-10 group-hover:bg-gold/10 transition-all"></div>
               <div className="flex items-center gap-3 mb-10">
                  <Code className="text-gold" />
                  <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">{t('landing.founders.jm.role')}</h3>
               </div>
               
               <div className="mb-10 flex items-center gap-8">
                  <div className="w-28 h-28 bg-bg-primary border-4 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 scale-110">
                     <span className="text-4xl font-black text-text-primary">JM</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black tracking-tight text-text-primary mb-1">
                      {t('FOUNDER_JAWAHAR')}
                    </h4>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em]">{t('landing.founders.jm.tagline')}</p>
                  </div>
               </div>

               <div className="text-base font-medium text-text-secondary leading-[1.8] space-y-6">
                  <p className="italic font-bold text-text-primary border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                    &quot;{t('landing.founders.jm.quote')}&quot;
                  </p>
                  <p>
                    {t('landing.founders.jm.bio_1')}
                  </p>
                  <p>
                    <span dangerouslySetInnerHTML={{ __html: t('landing.founders.jm.bio_2') }} />
                  </p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
