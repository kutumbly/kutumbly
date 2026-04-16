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

export default function LandingPrivacy() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <section id="privacy" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-clinical border border-border-light rounded-full mb-8"
          >
             <Lock size={16} className="text-gold" />
             <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               {t('landing.privacy.verified')}
             </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-8 leading-[1.1]">
            {t('landing.privacy.title')}
          </h2>
          <p className="text-text-secondary text-lg md:text-xl font-medium leading-relaxed mb-12 italic opacity-80">
             {t('landing.privacy.desc')}
          </p>
          
          <div className="w-1.5 h-16 bg-gold/20 mx-auto rounded-full mb-12" />
          
          <blockquote className="text-2xl md:text-3xl font-black text-text-primary tracking-tight font-inter-tight leading-snug">
             &quot;{t('landing.privacy.quote')}&quot;
          </blockquote>
        </div>

        {/* Clinical Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
           <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 bg-bg-tertiary border border-border-light rounded-[3rem] relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-gold/5 transition-all"
              >
                 <div className="absolute top-0 right-0 p-8">
                    <div className="w-2 h-2 rounded-full bg-text-success animate-pulse" />
                 </div>
                 
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-sm">
                       <Shield size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-1">
                      {t('landing.privacy.pipeline')}
                      </div>
                      <div className="text-xs font-black text-text-success uppercase tracking-widest">{t('common.status.hardened')}</div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {[
                        { label: t('landing.privacy.stats.encryption'), value: "AES-256-GCM" },
                        { label: t('landing.privacy.stats.network'), value: t('landing.privacy.stats.airgapped') },
                        { label: t('landing.privacy.stats.db'), value: t('landing.privacy.stats.vault_core') },
                        { label: t('landing.privacy.stats.memory'), value: t('landing.privacy.stats.zero_persistence') }
                    ].map((spec, i) => (
                       <div key={i} className="flex justify-between items-center py-4 border-b border-border-light/40 last:border-0">
                          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{spec.label}</span>
                          <span className="text-xs font-black text-text-primary tracking-tight font-inter-tight uppercase">{spec.value}</span>
                       </div>
                    ))}
                 </div>
              </motion.div>

              <div className="flex items-center gap-6 px-10">
                 <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <Lock size={24} />
                 </div>
                 <p className="text-sm font-bold text-text-secondary leading-relaxed">
                    {t('landing.privacy.infobar')}
                 </p>
              </div>
           </div>

           <div className="relative">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="aspect-square bg-bg-primary border border-border-light rounded-[4rem] flex flex-col items-center justify-center text-center p-16 shadow-2xl shadow-black/[0.02] relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="w-32 h-32 bg-white rounded-[3rem] border border-border-light flex items-center justify-center mb-12 shadow-sm group-hover:scale-110 transition-transform duration-700">
                    <Globe size={48} className="text-border-medium" />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em]">{t('landing.privacy.verified')}</div>
                    <div className="text-5xl font-black text-text-primary tracking-tighter">{t('landing.privacy.stats.airgapped')}</div>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
}
