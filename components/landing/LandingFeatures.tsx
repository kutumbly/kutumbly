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
import { Shield, Lock, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingFeatures() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <section className="py-32 bg-bg-tertiary px-6 relative overflow-hidden" id="features">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      
      <div className="max-w-6xl mx-auto text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-clinical border border-border-light rounded-full mb-8 shadow-sm"
        >
           <Shield size={16} className="text-gold" />
           <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
             {t('landing.features.tagline')}
           </span>
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight font-inter-tight leading-[1.1]">
           {t('landing.features.title')}
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg md:text-xl opacity-80 leading-relaxed italic">
           {t('landing.features.desc')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
             id: "01",
             title: t('landing.hero.specs.aes'),
             desc: t('landing.features.card_aes.desc'),
             icon: <Lock size={32} />
          },
          {
             id: "02",
             title: t('landing.hero.specs.airgapped'),
             desc: t('landing.features.card_airgapped.desc'),
             icon: <Globe size={32} />
          },
          {
             id: "03",
             title: t('landing.hero.specs.agentic'),
             desc: t('landing.features.card_agentic.desc'),
             icon: <Shield size={32} />
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-white border border-border-light rounded-[3rem] group hover:border-gold transition-all shadow-sm hover:shadow-xl hover:shadow-gold/5"
          >
             <div className="flex justify-between items-start mb-10">
                 <div className="w-16 h-16 bg-clinical border border-border-light rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all shadow-inner">
                    {feature.icon}
                 </div>
                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('landing.features.verified')}</span>
             </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-text-primary tracking-tight font-inter-tight">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {feature.desc}
              </p>
              <div className="pt-6 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_8px_rgba(6,95,70,0.3)]" />
                 <span className="text-[9px] font-black text-text-success uppercase tracking-widest">{t('common.status.hardened')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
