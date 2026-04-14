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
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingHero() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <div className="relative min-h-[90vh] bg-bg-tertiary flex flex-col pt-24 items-center px-6 text-center overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-primary border border-border-light shadow-sm mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-text-success animate-pulse" />
          <span className="text-[11px] font-bold text-text-secondary">Runs in your browser - No install needed</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-black text-text-primary tracking-tighter leading-[1.05] mb-8"
        >
          {t('HERO_TITLE_PART1')} <span className="text-gold">{t('HERO_TITLE_GOLD')}</span>,<br />
          {t('COMPLETELY_PRIVATE')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          {t('HERO_DESC')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <Link href="/os" className="h-16 px-10 bg-bg-primary border-2 border-border-light rounded-[2rem] flex items-center gap-3 font-black text-base text-text-primary hover:border-gold transition-all shadow-xl shadow-black/[0.02]">
            {t('NAV_OPEN_APP')} — Free
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* Mobile App Coming Soon */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="inline-flex items-center gap-3 px-6 py-3 bg-bg-secondary border border-border-light rounded-[1.5rem] mb-6 shadow-sm"
        >
           <span className="text-lg">📳</span>
           <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Installable app coming soon for Android & iOS</span>
        </motion.div>

        {/* Hero Footer Features */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary"
        >
           <div className="flex items-center gap-2">
              <Shield size={14} className="opacity-40" />
              <span>AES-256-GCM encrypted</span>
           </div>
           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border-light" />
           <div className="flex items-center gap-2">
              <Globe size={14} className="opacity-40" />
              <span>100% offline after first load</span>
           </div>
           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border-light" />
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border border-text-tertiary flex items-center justify-center text-[6px]">0</div>
              <span>Zero telemetry</span>
           </div>
        </motion.div>

      </div>

      {/* Hero Bottom Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[--bg-tertiary] to-transparent pointer-events-none" />
    </div>
  );
}
