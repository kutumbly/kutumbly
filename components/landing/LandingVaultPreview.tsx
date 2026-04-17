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
import { motion } from 'framer-motion';
import {
  Shield, Lock, IndianRupee, Heart, GraduationCap, Flame,
  ShoppingCart, Calendar, Users, Milk, CheckSquare, BookOpen,
  Home, TrendingUp, Plus, Activity, ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function LandingVaultPreview() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  const NAV_MODULES = [
    { icon: <Home size={20} />, name: t('landing.modules.family.title') || "Family Hub", status: "Active Vault", color: "gold" },
    { icon: <IndianRupee size={20} />, name: t('landing.modules.cash.title') || "Cash Hub", status: "Hardened", color: "gold" },
    { icon: <TrendingUp size={20} />, name: t('landing.modules.vidya.title') || "Vidya Hub", status: "Hardened", color: "gold" },
    { icon: <Heart size={20} />, name: t('landing.modules.sehat.title') || "Health Hub", status: "Encrypted", color: "border-medium" },
    { icon: <GraduationCap size={20} />, name: t('landing.modules.utsav.title') || "Utsav Hub", status: "Secure", color: "border-medium" },
    { icon: <ShoppingCart size={20} />, name: t('landing.modules.saman.title') || "Saman Hub", status: "Hardened", color: "gold" },
  ];

  const DASHBOARD_METRICS = [
    { label: t('landing.vault.metrics.balance') || "Monthly Balance", value: "₹84,200", trend: "+12%", status: "success" },
    { label: t('landing.vault.metrics.portfolio') || "Portfolio Value", value: "₹9.2L", trend: "+8.4%", status: "success" },
    { label: t('landing.vault.metrics.streak') || "Learning Streak", value: "14 Days", trend: "Active", status: "info" },
    { label: t('landing.vault.metrics.pantry') || "Pantry Alerts", value: "3 Items", trend: "Low Stock", status: "warning" },
    { label: t('landing.vault.metrics.staff') || "Staff Present", value: "2 / 2", trend: "Today", status: "success" },
    { label: t('landing.vault.metrics.event') || "Upcoming Event", value: "Vivah Ann.", trend: "12 Days", status: "info" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/4 blur-[180px] pointer-events-none" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 border border-gold/20 rounded-full mb-6 shadow-sm backdrop-blur-md">
          <Shield size={13} className="text-gold" />
          <span className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em]">{t('landing.vault.live_preview')}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight font-inter-tight mb-4">
          {t('landing.vault.title')}
        </h2>
        <p className="text-text-secondary font-medium text-base max-w-xl mx-auto opacity-80">
          {t('landing.vault.desc')}
        </p>
      </motion.div>

      {/* OS Window Mock */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white/50 backdrop-blur-3xl rounded-[3rem] border border-white/70 shadow-[0_40px_120px_rgba(0,0,0,0.07)] overflow-hidden"
      >
        {/* Window chrome bar */}
        <div className="h-16 bg-white/90 border-b border-border-light flex items-center px-8 justify-between backdrop-blur-md">
          <div className="flex gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-300/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-300/60" />
            <div className="w-3 h-3 rounded-full bg-green-300/60" />
          </div>
          <div className="flex items-center gap-3 py-2 px-6 bg-clinical rounded-xl border border-border-light shadow-inner">
            <Shield size={12} className="text-gold" />
            <span className="text-[9px] font-black text-text-primary uppercase tracking-[0.3em]">
              {t('landing.vault.version_label')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-text-success uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-text-success animate-pulse" />
            {t('landing.vault.session_encrypted')}
          </div>
        </div>

        {/* OS Body */}
        <div className="flex min-h-[580px]">

          {/* Sidebar — All 12 modules */}
          <div className="w-72 bg-white/30 border-r border-border-light/40 flex flex-col">
            {/* Vault identity card */}
            <div className="p-5 border-b border-border-light/40">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-white border border-gold/20 rounded-2xl shadow-lg shadow-gold/5 cursor-default"
              >
                <div className="w-12 h-12 bg-clinical border border-border-light rounded-xl flex items-center justify-center text-2xl shadow-sm">🏘️</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-text-primary leading-none mb-1 font-inter-tight truncate">
                    {t('landing.vault.demo.name')}
                  </div>
                  <div className="text-[9px] text-text-success font-black uppercase tracking-widest">
                    {t('landing.vault.demo.status')}
                  </div>
                </div>
                <Lock size={12} className="text-gold flex-shrink-0" />
              </motion.div>
            </div>

            {/* Module list */}
            <div className="flex-1 overflow-hidden p-4 space-y-0.5">
              {NAV_MODULES.map((mod, i) => (
                <motion.div
                  key={i}
                  onHoverStart={() => setHoveredModule(i)}
                  onHoverEnd={() => setHoveredModule(null)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-default ${
                    i === 0 ? 'bg-gold/10 border border-gold/20' : 'hover:bg-white/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-${mod.color} bg-white border border-border-light/50 shadow-sm flex-shrink-0`}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-text-primary truncate font-inter-tight">{mod.name}</div>
                    <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-70">{mod.status}</div>
                  </div>
                  <Lock size={10} className="text-border-medium flex-shrink-0 opacity-60" />
                </motion.div>
              ))}
            </div>

            {/* Add Vault button */}
            <div className="p-4 border-t border-border-light/40">
              <button className="w-full py-3 text-[9px] font-black text-text-tertiary flex items-center justify-center gap-2 hover:text-gold transition-all uppercase tracking-widest border border-border-light/60 rounded-xl hover:bg-white hover:shadow-sm">
                <Plus size={12} /> {t('landing.vault.create')}
              </button>
            </div>
          </div>

          {/* Main Content — Home Dashboard Preview */}
          <div className="flex-1 bg-clinical/20 p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/4 rounded-full blur-[100px] -z-10" />

            {/* Dashboard title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-1">
                  {t('landing.vault.dashboard_title')}
                </div>
                <h3 className="text-xl font-black text-text-primary font-inter-tight">
                  {t('landing.vault.greeting')} 🙏
                </h3>
              </div>
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-gold" />
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {DASHBOARD_METRICS.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`p-5 bg-white border rounded-2xl shadow-sm group hover:shadow-md transition-all ${
                    m.status === 'success' ? 'border-green-100 hover:border-green-200' :
                    m.status === 'warning' ? 'border-yellow-100 hover:border-yellow-200' :
                    'border-border-light hover:border-blue-200'
                  }`}
                >
                  <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-2 opacity-70">{m.label}</div>
                  <div className="text-xl font-black text-text-primary tracking-tighter font-inter-tight">{m.value}</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-1.5 ${
                    m.status === 'success' ? 'text-text-success' :
                    m.status === 'warning' ? 'text-amber-600' :
                    'text-blue-500'
                  }`}>{m.trend}</div>
                </motion.div>
              ))}
            </div>

            {/* Sample recent activity */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-4">
                {t('landing.vault.activity.title')}
              </div>
              <div className="space-y-3">
                {[
                  { icon: "💰", text: t('landing.vault.activity.grocery'), time: "2m ago", color: "text-amber-500" },
                  { icon: "📚", text: t('landing.vault.activity.study'), time: "1h ago", color: "text-blue-500" },
                  { icon: "🏥", text: t('landing.vault.activity.health'), time: "3h ago", color: "text-rose-500" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="text-lg leading-none">{a.icon}</span>
                    <span className="flex-1 text-text-secondary font-medium">{a.text}</span>
                    <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status bar footer */}
        <div className="h-12 bg-white/80 border-t border-border-light px-8 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{t('landing.vault.tech.pipe') || "SQL.js · WASM"}</span>
            <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{t('landing.vault.tech.latency') || "Latency: <2ms"}</span>
            <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">12 {t('landing.modules.tagline').split(' ')[1]} · 1 Vault</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_8px_rgba(6,95,70,0.4)]" />
            <span className="text-[8px] font-black text-text-success uppercase tracking-widest">{t('landing.vault.tech.status')}</span>
          </div>
        </div>
      </motion.div>

      {/* CTA below preview */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-10"
      >
        <Link
          href="/os"
          className="inline-flex items-center gap-3 h-14 px-10 bg-text-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gold transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5"
        >
          {t('landing.vault.cta_btn')} <ArrowRight size={16} />
        </Link>
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-4 opacity-70">
          {t('landing.vault.cta_sub')}
        </p>
      </motion.div>
    </div>
  );
}
