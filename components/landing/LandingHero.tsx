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
import { ArrowRight, Shield, Lock, Cpu, Database } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingHero() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const STATS = [
    { value: "12", label: "Sovereign Hubs" },
    { value: "0", label: "Cloud Servers" },
    { value: "AES-256", label: "Encryption" },
    { value: "∞", label: "Offline Use" },
  ];

  return (
    <section className="relative pt-36 pb-24 overflow-hidden mission-grid">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[900px] gold-glow -z-10" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[180px] -z-10 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/50 border border-gold/30 rounded-full shadow-sm backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-black text-gold-text uppercase tracking-[0.35em]">
                {t('landing.hero.tagline') || "India's First Family Sovereign OS"}
              </span>
            </div>
          </motion.div>

          {/* Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[1.03] tracking-tight font-inter-tight">
              {t('landing.hero.title_part1') || "Your Family."}<br className="hidden md:block" />
              <span className="text-gold">{t('landing.hero.title_part2') || "Your OS."}</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary font-semibold leading-relaxed max-w-3xl mx-auto opacity-85 italic">
              {t('landing.hero.manifesto') || `"You own your data. No cloud, no server, no compromise."`}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/os"
              className="group relative px-10 py-5 bg-text-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out -z-10" />
              <span className="flex items-center gap-3">
                {t('landing.hero.init_btn') || "Launch Kutumbly"} <ArrowRight size={16} />
              </span>
            </Link>

            <Link
              href="/product"
              className="px-10 py-5 bg-white/50 border border-border-light text-text-primary rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md hover:bg-white hover:shadow-md transition-all"
            >
              {t('landing.hero.mission_btn') || "View All Modules"}
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6"
          >
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-5 bg-white/30 backdrop-blur-sm border border-white/50 rounded-[2rem] group hover:bg-white/60 transition-all">
                <div className="text-3xl font-black text-text-primary tracking-tighter font-inter-tight group-hover:text-gold transition-colors">
                  {s.value}
                </div>
                <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest text-center">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            {[
              { icon: <Shield size={13} />, label: t('landing.hero.specs.aes') || "AES-256-GCM" },
              { icon: <Lock size={13} />, label: t('landing.hero.specs.airgapped') || "Air-Gapped" },
              { icon: <Database size={13} />, label: t('landing.hero.specs.sql') || "Local .kutumb Vault" },
              { icon: <Cpu size={13} />, label: t('landing.hero.specs.agentic') || "Agentic AI Layer" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-border-light/60 rounded-full text-[9px] font-black text-text-tertiary uppercase tracking-widest shadow-sm backdrop-blur-sm">
                <span className="text-gold">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
