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
import { motion } from 'framer-motion';
import { Star, Code } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingFounders() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <section className="py-24 bg-bg-primary px-6" id="founders">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">{t('landing.founders.title')}</h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg leading-relaxed opacity-80 italic">
            {t('landing.founders.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Founder 1 */}
           <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-16 bg-white border border-border-light rounded-[4rem] group hover:border-gold transition-all shadow-sm hover:shadow-xl hover:shadow-gold/5"
           >
              <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary mb-12">{t('landing.founders.pd.role_tag')}</h3>
              
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-24 h-24 bg-clinical border border-border-light rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-700">👩🏽‍🎨</div>
                
                <div>
                  <h4 className="text-3xl font-black tracking-tight text-text-primary mb-1">{t('landing.founders.pd.name')}</h4>
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">{t('landing.founders.pd.title')}</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-border-light/40">
                <p className="text-xl font-black text-text-primary leading-relaxed font-inter-tight italic">
                &quot;{t('landing.founders.pd.quote')}&quot;
                </p>
              </div>
           </motion.div>

           {/* Founder 2 */}
           <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-16 bg-white border border-border-light rounded-[4rem] group hover:border-gold transition-all shadow-sm hover:shadow-xl hover:shadow-gold/5"
           >
              <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary mb-12">{t('landing.founders.jm.role_tag')}</h3>
              
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-24 h-24 bg-clinical border border-border-light rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-700">👨🏾‍💻</div>
                
                <div>
                  <h4 className="text-3xl font-black tracking-tight text-text-primary mb-1">{t('landing.founders.jm.name')}</h4>
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">{t('landing.founders.jm.title')}</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-border-light/40">
                <p className="text-xl font-black text-text-primary leading-relaxed font-inter-tight italic">
                &quot;{t('landing.founders.jm.quote')}&quot;
                </p>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
