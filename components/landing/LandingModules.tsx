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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee, TrendingUp, Heart, GraduationCap, Flame, ShoppingCart,
  Calendar, Users, Milk, CheckSquare, BookOpen, Home, ArrowRight,
  Stethoscope, BookMarked, Syringe, Activity, Receipt, PiggyBank,
  Apple, Package, Star, Clock, Shield, Lock
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

export default function LandingModules() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const [activeId, setActiveId] = useState<string | null>(null);

  const MODULES = [
    {
      id: "family",
      icon: <Home size={26} />,
      name: t('landing.modules.family.title') || "Family Hub",
      subtitle: t('landing.modules.family.sub') || "Your Parivaar Identity",
      color: "from-gold/10 to-yellow-500/5",
      border: "hover:border-gold/40",
      iconBg: "bg-gold/10 text-gold-text border-gold/20",
      caps: ["Profiles", "Identity", "Biometrics", "Vault"],
      desc: t('landing.modules.family.desc') || "The core of Kutumbly. Create your family vault, add members, and secure identity.",
    },
    {
      id: "cash",
      icon: <IndianRupee size={26} />,
      name: t('landing.modules.cash.title') || "Cash Hub",
      subtitle: t('landing.modules.cash.sub') || "Financial Sovereignty",
      color: "from-amber-500/10 to-yellow-500/5",
      border: "hover:border-amber-400/40",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      caps: ["Ledger", "Splits", "Reports", "Monthly"],
      desc: t('landing.modules.cash.desc') || "Complete household cashflow management without cloud tracking.",
    },
    {
      id: "suvidha",
      icon: <Milk size={26} />,
      name: t('landing.modules.suvidha.title') || "Suvidha Hub",
      subtitle: t('landing.modules.suvidha.sub') || "Daily Logistics",
      color: "from-cyan-500/10 to-sky-500/5",
      border: "hover:border-cyan-400/40",
      iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
      caps: ["Milk Tally", "Bills", "Logs", "Payments"],
      desc: t('landing.modules.suvidha.desc') || "Manage daily recurring vendors and utility logistics simplified.",
    },
    {
      id: "saman",
      icon: <ShoppingCart size={26} />,
      name: t('landing.modules.saman.title') || "Saman Hub",
      subtitle: t('landing.modules.saman.sub') || "Pantry Manager",
      color: "from-lime-500/10 to-green-500/5",
      border: "hover:border-lime-400/40",
      iconBg: "bg-lime-50 text-lime-600 border-lime-100",
      caps: ["Inventory", "Alerts", "Lists", "Kitchen"],
      desc: t('landing.modules.saman.desc') || "Intelligent grocery and household inventory management.",
    },
    {
      id: "vidya",
      icon: <GraduationCap size={26} />,
      name: t('landing.modules.vidya.title') || "Vidya Hub",
      subtitle: t('landing.modules.vidya.sub') || "Knowledge Vault",
      color: "from-blue-500/10 to-indigo-500/5",
      border: "hover:border-blue-400/40",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      caps: ["Study", "Library", "Streaks", "Progress"],
      desc: t('landing.modules.vidya.desc') || "Digital homeschooling and knowledge persistence for generations.",
    },
    {
      id: "utsav",
      icon: <Calendar size={26} />,
      name: t('landing.modules.utsav.title') || "Utsav Hub",
      subtitle: t('landing.modules.utsav.sub') || "Event Registry",
      color: "from-purple-500/10 to-violet-500/5",
      border: "hover:border-purple-400/40",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      caps: ["Nevata", "Shagun", "Calendar", "Gifts"],
      desc: t('landing.modules.utsav.desc') || "Celebrating life's milestones privately with gift and shagun logs.",
    },
    {
      id: "sanskriti",
      icon: <Flame size={26} />,
      name: t('landing.modules.sanskriti.title') || "Sanskriti Hub",
      subtitle: t('landing.modules.sanskriti.sub') || "Digital Temple",
      color: "from-orange-500/10 to-yellow-500/5",
      border: "hover:border-orange-400/40",
      iconBg: "bg-orange-50 text-orange-600 border-orange-100",
      caps: ["Heritage", "Gotra", "Ancestry", "Calendar"],
      desc: t('landing.modules.sanskriti.desc') || "Preserve Dharma heritage and ancestral roots digitally.",
    },
    {
      id: "sehat",
      icon: <Heart size={26} />,
      name: t('landing.modules.sehat.title') || "Sehat Hub",
      subtitle: t('landing.modules.sehat.sub') || "Family Vaidya",
      color: "from-rose-500/10 to-pink-500/5",
      border: "hover:border-rose-400/40",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      caps: ["Vitals", "Rx", "History", "SOS"],
      desc: t('landing.modules.sehat.desc') || "Medical history and family health logs owned by you.",
    },
  ];

  return (
    <section className="py-32 bg-white px-6 relative z-10 overflow-hidden" id="modules">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-clinical border border-border-light rounded-full mb-8 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] font-inter">
              {t('landing.modules.tagline')}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight font-inter-tight leading-[1.05]">
            {t('landing.modules.header_top')}<br />
            <span className="text-gold">{t('landing.modules.header_bottom')}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg md:text-xl opacity-80 leading-relaxed">
            {t('landing.modules.desc')}
          </p>
        </motion.div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
              onHoverStart={() => setActiveId(mod.id)}
              onHoverEnd={() => setActiveId(null)}
              className={`group relative p-7 rounded-[2.5rem] border border-border-light bg-gradient-to-br ${mod.color} ${mod.border} hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300 cursor-default overflow-hidden`}
            >
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 shadow-sm transition-transform group-hover:scale-110 duration-300 ${mod.iconBg}`}>
                {mod.icon}
              </div>

              {/* Names */}
              <h3 className="text-xl font-black text-text-primary mb-1 font-inter-tight leading-tight">
                {mod.name}
              </h3>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] mb-4 opacity-70">
                {mod.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm text-text-secondary font-medium leading-relaxed mb-5 opacity-90">
                {mod.desc}
              </p>

              {/* Capability Tags */}
              <div className="flex flex-wrap gap-2">
                {mod.caps.map((cap, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 bg-white/60 border border-border-light/60 rounded-full text-[9px] font-black text-text-tertiary uppercase tracking-widest"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-10 bg-bg-tertiary border border-border-light rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
        >
          <div>
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2">{t('landing.privacy.verified')}</div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight font-inter-tight">{t('landing.modules.cta.title')}</h3>
            <p className="text-sm text-text-secondary font-medium mt-2 max-w-xl">{t('landing.modules.cta.desc')}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-5 py-3 bg-white border border-border-light rounded-2xl shadow-sm">
              <Shield size={14} className="text-gold" />
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white border border-border-light rounded-2xl shadow-sm">
              <Lock size={14} className="text-gold" />
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('landing.hero.specs.airgapped')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
