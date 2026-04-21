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
import {
  Shield, Lock, Cpu, Database, Wifi, HardDrive,
  Fingerprint, RefreshCw, CloudOff, Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingFeatures() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const PILLARS = [
    {
      id: "01",
      icon: <Lock size={30} />,
      title: t('landing.features.card_aes.title'),
      desc: t('landing.features.card_aes.desc'),
      stat: "256-bit",
      statLabel: t('landing.features.card_aes.stat'),
    },
    {
      id: "02",
      icon: <CloudOff size={30} />,
      title: t('landing.features.card_airgapped.title'),
      desc: t('landing.features.card_airgapped.desc'),
      stat: "0 Servers",
      statLabel: t('landing.features.card_airgapped.stat'),
    },
    {
      id: "03",
      icon: <HardDrive size={30} />,
      title: t('landing.features.card_sovereign.title'),
      desc: t('landing.features.card_sovereign.desc'),
      stat: ".kutumb",
      statLabel: t('landing.features.card_sovereign.stat'),
    },
  ];

  return (
    <section className="py-32 bg-bg-tertiary px-6 relative overflow-hidden" id="features">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-border-light rounded-full mb-8 shadow-sm">
            <Shield size={14} className="text-gold" />
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
              {t('landing.features.tagline') || "Sovereign Architecture"}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight font-inter-tight leading-[1.1]">
            {t('landing.features.header_top') || "Built Different."}<br />
            <span className="text-gold">{t('landing.features.header_bottom') || "Not Just Private — Sovereign."}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg opacity-80 leading-relaxed italic">
            {t('landing.features.desc') || "Every architectural decision in Kutumbly was made with one priority: your family's data belongs to you — and only you — forever."}
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-10 bg-white border border-border-light rounded-[3rem] hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-clinical border border-border-light rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-inner">
                  {pillar.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-text-primary tracking-tighter font-inter-tight">{pillar.stat}</div>
                  <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-70">{pillar.statLabel}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-text-primary tracking-tight font-inter-tight leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium opacity-90">
                  {pillar.desc}
                </p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_8px_rgba(6,95,70,0.3)]" />
                  <span className="text-[9px] font-black text-text-success uppercase tracking-widest">
                    {t('common.status.hardened') || "Verified & Hardened"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Manifesto Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center p-16 bg-white border border-border-light rounded-[4rem] shadow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/3 via-transparent to-transparent" />
          <div className="relative">
            <div className="text-[10px] font-black text-gold-text uppercase tracking-[0.4em] mb-6">Sovereign Manifesto</div>
            <blockquote className="text-3xl md:text-4xl font-black text-text-primary tracking-tight font-inter-tight leading-[1.2] max-w-3xl mx-auto">
              {t('landing.hero.manifesto') || `"You own your data. No cloud, no server, no compromise."`}
            </blockquote>
            <div className="mt-8 text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
              — {t('landing.footer.founder') || "System Architect: Jawahar R. Mallah"}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
