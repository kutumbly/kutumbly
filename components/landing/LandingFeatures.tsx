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
  BarChart3, Wallet, CheckSquare, HeartPulse, 
  TrendingUp, Gift, BookOpen, ShoppingCart, Users, Settings
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingFeatures() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const STEPS = [
    { id: 1, title: t('FEAT_STEP1_TITLE'), desc: t('FEAT_STEP1_DESC') },
    { id: 2, title: 'Create your vault', desc: 'Pick a name, set a 4-digit PIN. Your encrypted .kutumb file is created instantly.' },
    { id: 3, title: 'Use it fully offline', desc: 'After first load, zero network calls. Your data never leaves your device — ever.' },
  ];

  const MODULES = [
    { id: 'aangan',   label: t('HOME'), desc: 'Family snapshot — finances, events, tasks, and health all at a glance.', icon: BarChart3, color: 'bg-gold-light/20 text-gold' },
    { id: 'money',    label: t('MONEY'),    desc: 'Log income and expenses in ₹. Monthly summaries without any bank sync.', icon: Wallet, color: 'bg-green-50 text-green-700' },
    { id: 'tasks',    label: t('TASKS'),           desc: 'Priority-sorted tasks for every family member. High, medium, low — always right.', icon: CheckSquare, color: 'bg-blue-50 text-blue-700' },
    { id: 'health',   label: t('HEALTH'),    desc: 'BP, weight, medications, appointment notes — for every member in one place.', icon: HeartPulse, color: 'bg-red-50 text-red-700' },
    { id: 'invest',   label: t('INVEST'),      desc: 'Track MFs, stocks, FDs. Private portfolio with simple XIRR — no broker login.', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'nevata',   label: t('NEVATA'), desc: 'Shaadi, pooja, birthdays. Gift registry so nothing is ever forgotten.', icon: Gift, color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <section className="py-24 bg-bg-tertiary px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Step by Step Section */}
        <div className="text-center mb-16">
           <div className="text-[11px] font-black text-gold uppercase tracking-[0.3em] mb-3">
             Simple by Design
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-6">{t('FEAT_UP_IN_30')}</h2>
           <p className="text-text-secondary max-w-xl mx-auto font-medium">
             No sign-up, no email, no OTP. Just open, create your vault, and start.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {STEPS.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.id * 0.1 }}
              className="bg-bg-primary p-8 rounded-[2rem] border border-border-light shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-xs font-black text-gold mb-6 group-hover:bg-gold-light/20 transition-colors">
                {step.id}
              </div>
              <h3 className="text-lg font-black text-text-primary mb-3">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 9 Modules Section */}
        <div className="text-center mb-16">
           <div className="text-[11px] font-black text-gold uppercase tracking-[0.3em] mb-3">
             9 Modules
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-6">Everything your family needs</h2>
           <p className="text-text-secondary max-w-xl mx-auto font-medium">
             From daily groceries to long-term investments — all private, all offline.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {MODULES.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-bg-primary p-8 rounded-[2rem] border border-border-light shadow-sm hover:border-gold/30 transition-all font-inter"
              >
                <div className={`w-12 h-12 ${m.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black text-text-primary mb-3">{m.label}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
