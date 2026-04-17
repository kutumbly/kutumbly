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

const MODULES = [
  {
    id: "cash",
    icon: <IndianRupee size={26} />,
    name: "Cash Hub",
    subtitle: "Parivaar Ka Khazana",
    color: "from-amber-500/10 to-yellow-500/5",
    border: "hover:border-amber-400/40",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    caps: ["Ledger", "Income & Expense", "Member Splits", "Monthly Reports"],
    desc: "Complete household cashflow management. Log every rupee, split expenses across family members, and track monthly balance with encrypted local ledger.",
  },
  {
    id: "invest",
    icon: <TrendingUp size={26} />,
    name: "Invest Hub",
    subtitle: "Wealth Command Center",
    color: "from-emerald-500/10 to-teal-500/5",
    border: "hover:border-emerald-400/40",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    caps: ["Mutual Funds", "Stocks", "Gold", "Real Estate"],
    desc: "Track your complete investment portfolio offline. Monitor SIPs, equity, gold, and property — all in one encrypted sovereign vault.",
  },
  {
    id: "health",
    icon: <Heart size={26} />,
    name: "Health Hub",
    subtitle: "Parivaar Ka Vaidya",
    color: "from-rose-500/10 to-pink-500/5",
    border: "hover:border-rose-400/40",
    iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    caps: ["Vitals Tracking", "Prescriptions", "Vaccinations", "SOS Profile"],
    desc: "Encrypted family medical records. Log vitals (BP, sugar, weight), manage prescriptions with Rx scheduling, track vaccinations, and store SOS emergency cards.",
  },
  {
    id: "vidya",
    icon: <GraduationCap size={26} />,
    name: "Vidya Hub",
    subtitle: "Sovereign Study Companion",
    color: "from-blue-500/10 to-indigo-500/5",
    border: "hover:border-blue-400/40",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    caps: ["Study Sessions", "YouTube Library", "Progress Streaks", "Subject Tracking"],
    desc: "Digital homeschooling for every learner in the family. Track subjects, log study sessions, bookmark YouTube resources, and monitor learning streaks offline.",
  },
  {
    id: "sanskriti",
    icon: <Flame size={26} />,
    name: "Sanskriti Hub",
    subtitle: "Digital Temple",
    color: "from-orange-500/10 to-yellow-500/5",
    border: "hover:border-orange-400/40",
    iconBg: "bg-orange-50 text-orange-600 border-orange-100",
    caps: ["Gotra & Kul", "Vansh Vriksha", "Hindu Calendar", "Sankalpa Generator"],
    desc: "Preserve your Dharma heritage. Record Gotra, Kul, Vedic lineage, track Hindu festivals and tithi, build your Vansh ancestry tree, and generate formal Sankalpas.",
  },
  {
    id: "saman",
    icon: <ShoppingCart size={26} />,
    name: "Saman Hub",
    subtitle: "Smart Pantry Manager",
    color: "from-lime-500/10 to-green-500/5",
    border: "hover:border-lime-400/40",
    iconBg: "bg-lime-50 text-lime-600 border-lime-100",
    caps: ["Pantry Inventory", "Low Stock Alerts", "Grocery Lists", "Baseline Setup"],
    desc: "Intelligent grocery and household inventory management. Set stock thresholds, auto-detect low stock, maintain category-wise lists, and initialize with Indian kitchen essentials.",
  },
  {
    id: "utsav",
    icon: <Calendar size={26} />,
    name: "Utsav Hub",
    subtitle: "Events & Shagun Registry",
    color: "from-purple-500/10 to-violet-500/5",
    border: "hover:border-purple-400/40",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    caps: ["Nevata Logs", "Shagun Ledger", "Events Calendar", "Gift Tracking"],
    desc: "Never forget a family occasion. Log social obligations (nevata), track shagun given and received, manage event calendars, and maintain ceremonial gift records.",
  },
  {
    id: "sewak",
    icon: <Users size={26} />,
    name: "Sewak Hub",
    subtitle: "Household Staff Manager",
    color: "from-slate-500/10 to-zinc-500/5",
    border: "hover:border-slate-400/40",
    iconBg: "bg-slate-50 text-slate-600 border-slate-100",
    caps: ["Payroll", "Attendance", "KYC Records", "Staff Ledger"],
    desc: "Professional household staff management. Maintain KYC, mark daily attendance (present/absent/unpaid), calculate monthly payroll, and generate salary ledgers.",
  },
  {
    id: "suvidha",
    icon: <Milk size={26} />,
    name: "Suvidha Hub",
    subtitle: "Daily Utility Command",
    color: "from-cyan-500/10 to-sky-500/5",
    border: "hover:border-cyan-400/40",
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
    caps: ["Milk Tally", "Vendor Bills", "Daily Logs", "Payment Tracking"],
    desc: "Manage daily recurring vendors — milkman, newspaper, gas, water. Log daily quantities, track cumulative bills, and record vendor payments with a built-in tally calendar.",
  },
  {
    id: "tasks",
    icon: <CheckSquare size={26} />,
    name: "Tasks Hub",
    subtitle: "Sovereign To-Do Engine",
    color: "from-teal-500/10 to-cyan-500/5",
    border: "hover:border-teal-400/40",
    iconBg: "bg-teal-50 text-teal-600 border-teal-100",
    caps: ["Priority Levels", "Due Dates", "Member Assignment", "Offline-First"],
    desc: "Granular family task management. Create tasks with priority levels, assign to family members, set due dates, and track completion — all offline without any cloud dependency.",
  },
  {
    id: "diary",
    icon: <BookOpen size={26} />,
    name: "Diary Hub",
    subtitle: "Encrypted Memory Vault",
    color: "from-fuchsia-500/10 to-pink-500/5",
    border: "hover:border-fuchsia-400/40",
    iconBg: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    caps: ["Rich Journals", "Mood Tracking", "Voice Notes", "Memory Tags"],
    desc: "Sovereign personal journaling. Write rich diary entries, tag memories, track mood journeys, and preserve your life story in a fully encrypted, air-gapped local vault.",
  },
  {
    id: "family",
    icon: <Home size={26} />,
    name: "Family Hub",
    subtitle: "Your Parivaar Identity",
    color: "from-gold/10 to-yellow-500/5",
    border: "hover:border-gold/40",
    iconBg: "bg-gold/10 text-gold-text border-gold/20",
    caps: ["Member Profiles", "Aadhaar Links", "Biometric Lock", "Vault Identity"],
    desc: "The heart of Kutumbly. Create your family vault, add members with complete profiles, link Aadhaar, and secure the entire OS with a biometric-backed sovereign identity.",
  },
];

export default function LandingModules() {
  const [activeId, setActiveId] = useState<string | null>(null);

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
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">12 Sovereign Hubs</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight font-inter-tight leading-[1.05]">
            One OS.<br />
            <span className="text-gold">Every Role of Your Home.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg md:text-xl opacity-80 leading-relaxed">
            Kutumbly replaces 12+ scattered apps with one sovereign, encrypted, offline-first ecosystem — built for the Indian family.
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
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2">Sovereign Architecture</div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight font-inter-tight">All 12 Hubs. One encrypted <span className="text-gold">.kutumb</span> file.</h3>
            <p className="text-sm text-text-secondary font-medium mt-2 max-w-xl">Every hub runs fully offline. Your data never leaves your device. No subscriptions, no cloud, no compromise.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-5 py-3 bg-white border border-border-light rounded-2xl shadow-sm">
              <Shield size={14} className="text-gold" />
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white border border-border-light rounded-2xl shadow-sm">
              <Lock size={14} className="text-gold" />
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Zero Cloud</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
