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
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingHero() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden mission-grid">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] gold-glow -z-10" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/40 border border-gold/40 rounded-full shadow-sm backdrop-blur-md">
               <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
               <span className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em]">{t('landing.hero.tagline')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[1.05] tracking-tight font-inter-tight">
              {t('landing.hero.title_part1')} <br className="hidden md:block" />
              <span className="text-gold selection:bg-gold selection:text-white transition-colors duration-700">{t('landing.hero.title_part2')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary font-semibold leading-relaxed max-w-2xl mx-auto opacity-90 italic">
              {t('landing.hero.manifesto')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link 
              href="/product"
              className="group relative px-10 py-5 bg-text-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out -z-10" />
              <span className="flex items-center gap-3">
                {t('landing.hero.mission_btn')} <ArrowRight size={16} />
              </span>
            </Link>
            
            <button className="px-10 py-5 bg-white/40 border border-border-light text-text-primary rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md hover:bg-white/80 transition-all">
              {t('landing.hero.init_btn')}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10"
          >
            {[
              { icon: <Shield size={18} />, label: t('landing.hero.specs.aes') },
              { icon: <Globe size={18} />, label: t('landing.hero.specs.airgapped') },
              { icon: <Lock size={18} />, label: t('landing.hero.specs.sql') },
              { icon: <Shield size={18} />, label: t('landing.hero.specs.agentic') }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 bg-white/20 backdrop-blur-sm border border-white/40 rounded-[2rem] group hover:bg-white/40 transition-all cursor-default">
                 <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gold shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                 </div>
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
