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
import LandingHero from '@/components/landing/LandingHero';
import LandingVaultPreview from '@/components/landing/LandingVaultPreview';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPrivacy from '@/components/landing/LandingPrivacy';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingModules from '@/components/landing/LandingModules';
import { motion } from 'framer-motion';
import {
  ArrowRight, X, Check, Shield, Globe, Lock,
  IndianRupee, Heart, GraduationCap, Flame, Database
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingPage() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const COMPARISON = [
    { feature: t('landing.compare.feat.offline') || "Works 100% offline", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.sub') || "No subscription / account", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.aes') || "AES-256 encryption", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.local') || "Data stays on your device", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.hubs') || "12 integrated family hubs", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.multilingual') || "Bhojpuri / Hindi UI", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.vansh') || "Vansh ancestry tree", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.calendar') || "Hindu calendar & rituals", kutumbly: true, others: false },
    { feature: t('landing.compare.feat.vault') || "Air-gapped vault file", kutumbly: true, others: false },
  ];

  const TESTIMONIAL_CARDS = [
    {
      quote: t('landing.test.ramesh.quote') || "Hamara poora family ka hisaab...",
      name: "Ramesh S.",
      role: t('landing.test.ramesh.role') || "Small Business Owner, Varanasi",
      emoji: "🙏",
    },
    {
      quote: t('landing.test.priya.quote') || "Finally an OS that respects Indian family values...",
      name: "Priya M.",
      role: t('landing.test.priya.role') || "Homemaker & Educator, Pune",
      emoji: "🌺",
    },
    {
      quote: t('landing.test.sunita.quote') || "Dudh wala, newspaper, kaamwali...",
      name: "Sunita D.",
      role: t('landing.test.sunita.role') || "Household Manager, Jaipur",
      emoji: "✨",
    },
  ];

  return (
    <main className="min-h-screen bg-bg-tertiary">
      <LandingHeader />
      <LandingHero />

      {/* Vault OS Preview */}
      <div className="relative z-20 bg-white">
        <LandingVaultPreview />
      </div>

      {/* All 12 Modules */}
      <LandingModules />

      {/* Why Kutumbly — Comparison Table */}
      <section className="py-32 bg-bg-tertiary px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gold/4 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-border-light rounded-full mb-8 shadow-sm">
              <Shield size={13} className="text-gold" />
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Why Kutumbly</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight font-inter-tight mb-4">
              {t('landing.compare.header_top') || "Everything Scattered Apps"}<br />
              <span className="text-gold">{t('landing.compare.header_bottom') || "Simply Cannot Do."}</span>
            </h2>
            <p className="text-text-secondary font-medium text-lg opacity-80 max-w-xl mx-auto leading-relaxed">
              Cloud apps ask for trust. Kutumbly asks for nothing — and gives everything.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-border-light rounded-[3rem] overflow-hidden shadow-sm"
          >
            {/* Table header */}
            <div className="grid grid-cols-3 border-b border-border-light">
              <div className="p-7 col-span-1 border-r border-border-light">
                <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-70">Feature</div>
              </div>
              <div className="p-7 text-center border-r border-border-light bg-gold/5">
                <div className="text-[10px] font-black text-gold-text uppercase tracking-[0.25em]">
                  {t('landing.compare.kutumbly') || "Kutumbly"}
                </div>
                <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60 mt-1">Sovereign OS</div>
              </div>
              <div className="p-7 text-center">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em]">
                  {t('landing.compare.cloud') || "Other Apps"}
                </div>
                <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60 mt-1">Cloud-Based</div>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-3 border-b border-border-light/50 last:border-0 hover:bg-clinical/30 transition-colors"
              >
                <div className="p-5 px-7 col-span-1 border-r border-border-light/50 flex items-center">
                  <span className="text-sm font-bold text-text-secondary">{row.feature}</span>
                </div>
                <div className="p-5 border-r border-border-light/50 bg-gold/5 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-text-success/10 border border-text-success/20 flex items-center justify-center">
                    <Check size={14} className="text-text-success" strokeWidth={3} />
                  </div>
                </div>
                <div className="p-5 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                    <X size={14} className="text-red-400" strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-4 opacity-70">
              Early Access Voices
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight font-inter-tight">
              {t('landing.testimonials.title') || "What Families Are Saying"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIAL_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-clinical border border-border-light rounded-[2.5rem] hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all"
              >
                <div className="text-3xl mb-6">{card.emoji}</div>
                <blockquote className="text-base font-semibold text-text-primary leading-relaxed mb-8 italic opacity-90">
                  &ldquo;{card.quote}&rdquo;
                </blockquote>
                <div className="border-t border-border-light pt-6">
                  <div className="text-sm font-black text-text-primary font-inter-tight">{card.name}</div>
                  <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-70 mt-1">{card.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sovereignty Features detail */}
      <LandingFeatures />
      <LandingPrivacy />

      {/* Waitlist / Early Access */}
      <section className="py-24 bg-bg-tertiary px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-border-light shadow-sm text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/3 via-transparent to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-12 bg-clinical border border-border-light rounded-2xl flex items-center justify-center text-gold shadow-sm">
                  <Database size={22} />
                </div>
                <div className="text-text-tertiary text-xl opacity-40">→</div>
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 shadow-sm">
                  <Lock size={22} className="text-gold" />
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-text-primary mb-4 tracking-tight font-inter-tight">
                {t('landing.waitlist.title') || "Join the Sovereign Early Access"}
              </h2>
              <p className="text-text-secondary font-medium leading-relaxed max-w-xl mx-auto mb-10 text-sm md:text-base opacity-85">
                {t('landing.waitlist.desc') || "Be among the first Indian families to run a fully sovereign, offline, encrypted family OS. No cloud. No waiting."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="aapka@email.com"
                  className="flex-1 h-14 px-6 rounded-2xl bg-bg-tertiary border border-border-light focus:border-gold outline-none font-bold text-sm transition-all"
                />
                <button className="h-14 px-8 bg-gold text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gold/20 hover:opacity-90 active:scale-95 transition-all">
                  {t('landing.waitlist.btn') || "Request Access"}
                </button>
              </div>

              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-6 opacity-60">
                {t('landing.waitlist.sub') || "No spam. No data sharing. Just early access."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 mission-grid opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[9px] font-black text-gold-text uppercase tracking-[0.4em] mb-6">Sovereign · Local · Forever</div>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tighter font-inter-tight leading-[1.05]">
              {t('landing.final_cta.title') || "Your Family Deserves"}<br />
              <span className="text-gold">A Sovereign OS.</span>
            </h2>
            <p className="text-text-secondary font-medium text-lg mb-12 opacity-75 max-w-xl mx-auto leading-relaxed">
              {t('landing.final_cta.sub') || "Start today. No account, no subscription. Just open your browser and initialize your vault."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/os"
                className="inline-flex h-16 px-12 bg-text-primary text-white rounded-2xl items-center gap-3 font-black text-sm tracking-tight hover:bg-gold transition-all shadow-xl shadow-black/10 hover:-translate-y-1 active:scale-95"
              >
                {t('landing.final_cta.btn') || "Launch Kutumbly OS"}
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/#modules"
                className="inline-flex h-16 px-12 bg-white border-2 border-border-light rounded-2xl items-center gap-3 font-black text-sm text-text-primary hover:border-gold transition-all shadow-sm"
              >
                {t('landing.hero.mission_btn') || "Explore All 12 Hubs"}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: <Shield size={13} />, text: "AES-256 Encrypted" },
                { icon: <Globe size={13} />, text: "100% Offline" },
                { icon: <Lock size={13} />, text: "No Account Needed" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-70">
                  <span className="text-gold">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
