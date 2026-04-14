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
    { id: 1, title: 'No Sign-up, Ever.', desc: 'Hum data nahi mangte. No email, no mobile number, no OTP. Open app and start.' },
    { id: 2, title: 'Build Your Vault.', desc: 'Pick a mission name and set a 4-digit Sovereign PIN. Your encrypted .kutumb file is generated locally.' },
    { id: 3, title: 'Total Sovereignty.', desc: 'After first load, zero network calls. All family memories and wealth remain on your hardware.' },
  ];

  const MODULES = [
    { id: 'aangan',   label: 'Aangan (Command Center)', desc: 'Ek jhalak me pura kuber ka khazana aur parivar ka haal dekhein.', icon: BarChart3, color: 'bg-gold/10 text-gold' },
    { id: 'money',    label: 'Lekha-Jokha (Treasury)',    desc: 'Income aur Kharche ka sampurn hisaab-kitab ₹ me. Zero cloud sync.', icon: Wallet, color: 'bg-green-500/10 text-green-700' },
    { id: 'tasks',    label: 'Niyantran (Control)',           desc: 'Parivar ke har member ki zimmedari. Priority sorted — always right.', icon: CheckSquare, color: 'bg-blue-500/10 text-blue-700' },
    { id: 'health',   label: 'Swasthya (Wellness)',    desc: 'Medications, appointment notes, aur healthcare logs for every soul.', icon: HeartPulse, color: 'bg-red-500/10 text-red-700' },
    { id: 'invest',   label: 'Samridhi (Wealth)',      desc: 'Track MFs, Stocks, aur FDs. Private portfolio with zero broker login.', icon: TrendingUp, color: 'bg-indigo-500/10 text-indigo-700' },
    { id: 'nevata',   label: 'Parampara (Events)', desc: 'Janmdin, Shaadi, Pooja. Gift registry so honor is never forgotten.', icon: Gift, color: 'bg-amber-500/10 text-amber-700' },
  ];

  return (
    <section className="py-32 bg-bg-tertiary px-6 relative overflow-hidden" id="features">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Step by Step Section */}
        <div className="text-center mb-20">
           <div className="text-[12px] font-black text-gold uppercase tracking-[0.4em] mb-4">
             Mission Protocols
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-8 tracking-tighter">
              {t('FEAT_UP_IN_30')}
           </h2>
           <p className="text-text-secondary max-w-2xl mx-auto font-semibold text-lg md:text-xl leading-relaxed">
             Zero Cloud. Zero Compromise. <br className="hidden md:block" />
             Just pure family data sovereignty, engineered for local hardware.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {STEPS.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 bg-white border border-border-light rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-gold/5 hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-clinical rounded-2xl flex items-center justify-center text-gold mb-8 shadow-inner group-hover:bg-gold group-hover:text-white transition-all duration-500">
                <span className="text-xl font-black italic">0{step.id}</span>
              </div>
              
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-black text-text-primary tracking-tight font-inter-tight">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  {step.desc}
                </p>
                <div className="pt-6 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_8px_rgba(6,95,70,0.3)]" />
                   <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Autonomous Step Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
