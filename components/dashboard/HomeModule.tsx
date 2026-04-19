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
import { useAppStore } from '@/lib/store';
import { useSanskriti } from '@/modules/sanskriti';
import { useSaman } from '@/modules/saman';
import { useInvest } from '@/modules/invest';
import { useVidya } from '@/modules/vidya';
import { useCash } from '@/modules/cash';
import { useDiary } from '@/modules/diary';
import { useHealth } from '@/modules/health';
import { useSuvidha } from '@/modules/suvidha';
import { Shield, Clock, Plus, ArrowRight, Fingerprint, HardDrive, Activity, Heart, Zap, Milk, CheckCircle2, Package, TrendingUp, GraduationCap, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { hasBiometricRegistered } from '@/lib/biometric';
import { useTranslation, Language } from '@/lib/i18n';
import MetricCard from '../ui/MetricCard';

type MetricStatus = "success" | "default" | "warning" | "danger" | "info";

import { parseRichContent } from '@/lib/richContent';

export default function HomeModule() {
  const { db, lang, activeVault } = useAppStore();
  const t = useTranslation(lang as Language);
  const { summary } = useCash();
  const { entries } = useDiary();
  const { readings } = useHealth();
  const { vendors, logs, logDaily } = useSuvidha();
  const { items: inventory } = useSaman();
  const { summary: investSummary, goals } = useInvest();
  const { learners, getStats: getVidyaStats, getStreak } = useVidya();
  const { logs: ritualLogs } = useSanskriti();

  // 1. Calculate Custom Stats
  let tasksPending = 0;
  let eventsUpcoming = 0;
  if (db) {
    try { 
      const resT = db.exec("SELECT COUNT(*) FROM tasks WHERE status = 'pending'");
      tasksPending = resT[0]?.values[0][0] as number; 
    } catch {}
    try { 
      const resE = db.exec("SELECT COUNT(*) FROM utsav_events WHERE event_date >= date('now')");
      eventsUpcoming = resE[0]?.values[0][0] as number; 
    } catch {}
  }

  const bioActive = activeVault && hasBiometricRegistered(activeVault.id);
  const avgWeight = readings.length > 0 ? readings.reduce((acc, r) => acc + (r.weight || 0), 0) / readings.length : 0;
  const latestBP = readings[0] ? `${readings[0].bp_systolic}/${readings[0].bp_diastolic}` : '--/--';
  
  const lowStockItems = inventory.filter(i => i.current_stock <= (i.threshold ?? 0));
  const totalVidyaMins = learners.reduce((acc, l) => acc + getVidyaStats(l.id).totalMins, 0);
  const primaryLearnerStreak = learners.length > 0 ? getStreak(learners[0].id) : 0;

  const stats: { label: string; value: string | number; status: MetricStatus; isCurrency?: boolean; trend?: number[] }[] = [
    { 
      label: t('MONTHLY_BALANCE'), 
      value: summary.balance, 
      isCurrency: true, 
      trend: [20000, 25000, 22000, 30000, summary.balance as number],
      status: 'success'
    },
    { 
      label: 'Portfolio Value', 
      value: investSummary.currentValue, 
      isCurrency: true,
      status: 'info'
    },
    { 
      label: 'Inventory Alerts', 
      value: lowStockItems.length, 
      status: lowStockItems.length > 3 ? 'danger' : (lowStockItems.length > 0 ? 'warning' : 'success')
    },
    { 
      label: 'Learning Streak', 
      value: `${primaryLearnerStreak} Days`, 
      status: primaryLearnerStreak > 0 ? 'success' : 'default'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      {/* ── Sovereign Shield Hub ────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
         {[
           { icon: Shield, label: t('OS_SECURITY'), value: t('OS_LOCKDOWN') },
           { icon: Fingerprint, label: t('BIOMETRIC'), value: bioActive ? t('HARDWARE_ACTIVE') : t('PIN_REQUIRED') },
           { icon: HardDrive, label: t('SYNC_GRID'), value: t('LOCAL_DISCOVERY') }
         ].map((sh, idx) => (
           <div key={idx} className="bg-bg-primary border border-border-light rounded-2xl p-4 flex items-center gap-3 transition-all hover:border-gold/30 hover:shadow-md tap-highlight">
              <div className="w-10 h-10 rounded-xl bg-gold-light flex items-center justify-center text-gold-text border border-border-light flex-shrink-0">
                 <sh.icon size={19} />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="text-[8px] font-black uppercase tracking-[0.28em] text-text-tertiary mb-0.5 truncate">{sh.label}</div>
                 <div className="text-[10px] font-black text-text-primary uppercase tracking-wide truncate">{sh.value}</div>
              </div>
           </div>
         ))}
      </motion.div>

      {/* Dynamic Metric Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <MetricCard key={i} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Activity Feed */}
        <motion.section variants={item} className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
              {t('SOVEREIGN_ACTIVITY')}
            </div>
            <button className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] flex items-center gap-1.5 hover:underline decoration-gold-text/30 underline-offset-4">
              {t('VIEW_HISTORY')} <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {entries.length > 0 ? entries.slice(0, 4).map((a, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 4 }}
                className="bg-bg-primary border border-border-light p-5 rounded-[2rem] flex gap-5 items-start group shadow-black/[0.01] shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center flex-shrink-0 border border-border-light group-hover:border-gold/30 group-hover:bg-bg-primary transition-all shadow-sm">
                  <Clock className="w-5 h-5 text-text-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-[13px] font-bold text-text-secondary leading-relaxed line-clamp-3 overflow-hidden">
                      {parseRichContent(String(a.content))}
                   </div>
                   <div className="flex items-center gap-3 mt-3">
                     <span className="text-[8px] font-black text-gold-text uppercase tracking-[0.2em] bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                       {t('DIARY')}
                     </span>
                     <span className="text-[9px] text-text-tertiary font-black uppercase tracking-[0.2em] opacity-60">
                       {new Date(String(a.date)).toLocaleDateString(({ en: 'en-IN', hi: 'hi-IN', bho: 'hi-IN' } as any)[lang] ?? 'en-IN', { day: 'numeric', month: 'short' })}
                     </span>
                   </div>
                </div>
              </motion.div>
            )) : (
               <div className="bg-bg-primary border border-border-light border-dashed rounded-[3rem] py-20 flex flex-col items-center justify-center opacity-30">
                  <Shield className="w-14 h-14 mb-6 text-text-tertiary" strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t('NO_ACTIVITY')}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest mt-1">{t('ACTIVITY_EMPTY_SUB')}</p>
               </div>
            )}
          </div>
        </motion.section>

        {/* Health Pulse Sidebar */}
        <motion.section variants={item} className="space-y-5">
           <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] px-1">
              {t('HEALTH_PULSE')}
           </div>
           <div className="bg-bg-primary border border-border-light rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-text-danger/10 flex items-center justify-center text-text-danger border border-text-danger/15">
                    <Heart size={17} className="animate-pulse" />
                 </div>
                 <div className="text-[11px] font-black text-text-primary uppercase tracking-wide">{t('WELLNESS_PULSE')}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-bg-secondary p-3 rounded-xl border border-border-light">
                    <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1.5">{t('AVG_WEIGHT')}</div>
                    <div className="text-base font-black text-text-primary tabular-nums">{avgWeight > 0 ? `${avgWeight.toFixed(1)}kg` : '--'}</div>
                 </div>
                 <div className="bg-bg-secondary p-3 rounded-xl border border-border-light">
                    <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1.5">{t('LATEST_SUGAR')}</div>
                    <div className="text-base font-black text-text-primary tabular-nums">{readings[0]?.blood_sugar || '--'}<span className="text-[9px] ml-1 opacity-40">mg</span></div>
                 </div>
              </div>
              <button className="w-full py-3 bg-bg-secondary border border-border-light rounded-xl text-[9px] font-black uppercase tracking-[0.25em] text-text-tertiary hover:text-gold hover:border-gold/30 transition-all">
                 {t('FULL_VITALS_DATA')}
              </button>
           </div>
        </motion.section>
      </div>

      {/* ── Insight Cards ─────────────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Inventory Spotlight */}
        <div className="bg-bg-primary border border-border-light rounded-2xl p-5 flex flex-col justify-between group hover:border-gold/25 hover:shadow-md transition-all">
           <div>
             <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                 <Package size={18} />
               </div>
               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.25em]">{t('CRITICAL_STOCK')}</span>
             </div>
             <div className="space-y-3">
                {lowStockItems.length > 0 ? lowStockItems.slice(0, 3).map(invItem => (
                  <div key={invItem.id} className="flex items-center justify-between gap-2">
                     <span className="text-[12px] font-bold text-text-primary truncate">{invItem.name}</span>
                     <span className="text-[9px] font-black text-text-danger bg-bg-danger px-2 py-0.5 rounded-lg flex-shrink-0">Low</span>
                  </div>
                )) : (
                  <div className="flex items-center gap-2 text-text-success py-3">
                     <CheckCircle2 size={15} />
                     <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{t('PANTRY_FULL')}</span>
                  </div>
                )}
             </div>
           </div>
           <button className="mt-5 flex items-center gap-1.5 text-[9px] font-black text-gold uppercase tracking-widest group-hover:gap-2.5 transition-all">
              {t('NAV_SAMAN')} <ArrowRight size={12} />
           </button>
        </div>

        {/* Learning & Rituals */}
        <div className="bg-bg-primary border border-border-light rounded-2xl p-5 flex flex-col justify-between group hover:border-indigo-200 hover:shadow-md transition-all">
           <div>
             <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                 <GraduationCap size={18} />
               </div>
               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.25em]">{t('SMART_LEARNING')}</span>
             </div>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[12px] font-bold text-text-primary">{t('RITUAL')}</span>
                   <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${ritualLogs.length > 0 ? 'text-text-success bg-bg-success border-border-light' : 'text-text-tertiary bg-bg-secondary border-border-light'}`}>
                     {ritualLogs.length > 0 ? '✓' : '–'}
                   </span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[12px] font-bold text-text-primary">{t('LEARNERS')}</span>
                   <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                     {totalVidyaMins}m
                   </span>
                </div>
             </div>
           </div>
           <button className="mt-5 flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest group-hover:gap-2.5 transition-all">
              {t('NAV_VIDYA')} <ArrowRight size={12} />
           </button>
        </div>

        {/* Prosperity Goals */}
        <div className="bg-bg-primary border border-border-light rounded-2xl p-5 flex flex-col justify-between group hover:border-emerald-200 hover:shadow-md transition-all">
           <div>
             <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                 <TrendingUp size={18} />
               </div>
               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.25em]">{t('WEALTH_PORTFOLIO')}</span>
             </div>
             <div className="space-y-3">
                {goals.length > 0 ? goals.slice(0, 2).map(g => (
                  <div key={g.id} className="space-y-1.5">
                     <div className="flex justify-between items-center">
                       <span className="text-[12px] font-bold text-text-primary truncate pr-2">{g.name}</span>
                       <span className="text-[8px] font-black text-text-tertiary flex-shrink-0 tabular-nums">₹{g.target_amount.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(100, (g.current_progress / g.target_amount) * 100)}%` }}
                         transition={{ duration: 0.8, ease: 'easeOut' }}
                         className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                       />
                     </div>
                  </div>
                )) : (
                  <div className="py-3 text-[9px] font-black text-text-tertiary uppercase tracking-wider opacity-40">{t('NO_INVESTMENTS')}</div>
                )}
             </div>
           </div>
           <button className="mt-5 flex items-center gap-1.5 text-[9px] font-black text-emerald-700 uppercase tracking-widest group-hover:gap-2.5 transition-all">
              {t('NAV_INVEST')} <ArrowRight size={12} />
           </button>
        </div>
      </motion.div>

      {/* ── System Sync CTA ────────────────────────────────────── */}
      <motion.section variants={item}>
          <button className="w-full flex items-center justify-between p-5 bg-bg-primary border border-border-light rounded-2xl hover:border-gold/30 transition-all group hover:shadow-md active:scale-[0.99]">
              <div className="flex items-center gap-4">
                 <div className="w-11 h-11 rounded-xl bg-gold/8 text-gold flex items-center justify-center border border-gold/15 group-hover:bg-gold group-hover:text-white transition-all">
                    <Zap size={20} strokeWidth={2.5} />
                 </div>
                 <div className="text-left">
                    <div className="text-[13px] font-black text-text-primary tracking-tight">{t('SYNC_NOW')}</div>
                    <div className="text-[9px] text-text-tertiary uppercase font-black tracking-[0.25em] opacity-50 mt-0.5">{t('P2P_BEAM_GRID')}</div>
                 </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center group-hover:border-gold/40 group-hover:bg-gold/5 transition-all">
                 <ArrowRight className="text-text-tertiary group-hover:text-gold transition-colors" size={15} />
              </div>
          </button>
      </motion.section>
    </motion.div>
  );
}
