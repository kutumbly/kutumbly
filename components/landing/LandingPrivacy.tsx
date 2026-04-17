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
import { Shield, Lock, Globe, Database, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingPrivacy() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const PRIVACY_SPECS = [
    { label: t('landing.privacy.spec.algo') || "Encryption Algorithm", value: "AES-256-GCM" },
    { label: t('landing.privacy.spec.net') || "Network Dependency", value: "Zero (Air-Gapped)" },
    { label: t('landing.privacy.spec.storage') || "Storage Format", value: ".kutumb Vault (SQLite)" },
    { label: t('landing.privacy.spec.auth') || "Authentication", value: "PIN + Biometric" },
    { label: t('landing.privacy.spec.residency') || "Data Residency", value: "Device Only" },
    { label: t('landing.privacy.spec.sync') || "Cloud Sync", value: "Never" },
    { label: t('landing.privacy.spec.telemetry') || "Analytics / Telemetry", value: "None" },
    { label: t('landing.privacy.spec.access') || "Third-Party Access", value: "Impossible" },
  ];

  const GUARANTEES = [
    t('landing.privacy.guarantee.0') || "No user data ever leaves your device",
    t('landing.privacy.guarantee.1') || "No backend servers or APIs involved",
    t('landing.privacy.guarantee.2') || "No subscription or account required",
    t('landing.privacy.guarantee.3') || "No analytics, tracking, or fingerprinting",
    t('landing.privacy.guarantee.4') || "Full offline functionality, always",
    t('landing.privacy.guarantee.5') || "Your PIN is the only encryption key",
  ];

  return (
    <section id="privacy" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="container mx-auto px-6 relative">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-clinical border border-border-light rounded-full mb-8 shadow-sm"
          >
            <Lock size={14} className="text-gold" />
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
              {t('landing.privacy.verified')}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-6 leading-[1.1]">
            {t('landing.privacy.title')}<br />
            <span className="text-gold">{t('common.privacy')}</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium leading-relaxed italic opacity-80 mb-10">
            {t('landing.privacy.desc')}
          </p>

          <div className="w-1 h-16 bg-gradient-to-b from-gold/40 to-transparent mx-auto rounded-full mb-10" />

          <blockquote className="text-2xl md:text-3xl font-black text-text-primary tracking-tight font-inter-tight leading-snug">
            &quot;{t('landing.privacy.quote')}&quot;
          </blockquote>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Technical Spec Sheet */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-10 bg-bg-tertiary border border-border-light rounded-[3rem] shadow-sm hover:shadow-xl hover:shadow-gold/5 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6">
              <div className="w-2 h-2 rounded-full bg-text-success animate-pulse" />
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gold shadow-sm border border-border-light">
                <Shield size={26} />
              </div>
              <div>
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-1">
                  {t('landing.privacy.pipeline')}
                </div>
                <div className="text-xs font-black text-text-success uppercase tracking-widest">
                  {t('common.status.hardened')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {PRIVACY_SPECS.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-border-light/40 last:border-0">
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{spec.label}</span>
                  <span className="text-xs font-black text-text-primary tracking-tight font-inter-tight uppercase">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Guarantees + Visual */}
          <div className="space-y-8">
            {/* Guarantees list */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-10 bg-bg-primary border border-border-light rounded-[3rem] shadow-sm hover:shadow-xl hover:shadow-gold/5 transition-all"
            >
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-8">
                {t('landing.footer.manifesto_header')}
              </div>
              <div className="space-y-4">
                {GUARANTEES.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-text-success/10 border border-text-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={13} className="text-text-success" />
                    </div>
                    <span className="text-sm font-bold text-text-secondary leading-relaxed">{g}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Air-Gapped Feature Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 p-8 bg-gold/5 border border-gold/20 rounded-[2.5rem] group hover:border-gold/40 transition-all"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gold shadow-sm border border-gold/10 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Globe size={30} />
              </div>
              <div>
                <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-1">
                  {t('landing.privacy.verified')}
                </div>
                <div className="text-3xl font-black text-text-primary tracking-tighter font-inter-tight">
                  {t('landing.hero.specs.airgapped')}
                </div>
                <div className="text-xs font-medium text-text-secondary mt-1 opacity-80">
                  {t('landing.privacy.airgapped_sub')}
                </div>
              </div>
            </motion.div>

            {/* Infobar */}
            <div className="flex items-start gap-5 px-8 py-6 bg-clinical border border-border-light rounded-2xl">
              <Lock size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-text-secondary leading-relaxed">
                {t('landing.privacy.infobar')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
