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
import { useCash } from '@/modules/money';
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
      const resE = db.exec("SELECT COUNT(*) FROM nevata_events WHERE event_date >= date('now')");
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
      className="space-y-5 md:space-y-10"
    >
      {/* ── Sovereign Shield Hub ────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
         {[
           { icon: Shield, label: t('OS_SECURITY'), value: t('OS_LOCKDOWN') },
           { icon: Fingerprint, label: t('BIOMETRIC'), value: bioActive ? t('HARDWARE_ACTIVE') : t('PIN_REQUIRED') },
           { icon: HardDrive, label: t('SYNC_GRID'), value: t('LOCAL_DISCOVERY') }
         ].map((sh, idx) => (
           <div key={idx} className="bg-bg-primary border border-border-light rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 flex items-center gap-4 shadow-black/[0.02] shadow-xl transition-all hover:border-gold/30 tap-highlight">
              <div className="w-12 h-12 rounded-2xl bg-gold-light flex items-center justify-center text-gold-text border border-border-light shadow-sm">
                 <sh.icon size={22} />
              </div>
              <div className="flex-1">
                 <div className="text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-1">{sh.label}</div>
                 <div className="text-[11px] font-black text-text-primary uppercase tracking-wider">{sh.value}</div>
              </div>
           </div>
         ))}
      </motion.div>

      {/* Dynamic Metric Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <MetricCard key={i} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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

        {/* Quick Access & Health Pulse */}
        <div className="space-y-8">
           <motion.section variants={item} className="space-y-6">
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">
                 {t('HEALTH_PULSE')}
              </div>
              <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 space-y-8 shadow-xl shadow-black/[0.02]">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-text-danger/10 flex items-center justify-center text-text-danger border border-text-danger/20">
                       <Heart className="animate-pulse" size={20} />
                    </div>
                    <div className="text-sm font-black text-text-primary uppercase tracking-wider">{t('WELLNESS_PULSE')}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-tertiary p-4 rounded-2xl border border-border-light shadow-sm">
                       <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">{t('AVG_WEIGHT')}</div>
                       <div className="text-base font-black text-text-primary">{avgWeight > 0 ? `${avgWeight.toFixed(1)}kg` : '--'}</div>
                    </div>
                    <div className="bg-bg-tertiary p-4 rounded-2xl border border-border-light shadow-sm">
                       <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">{t('LATEST_SUGAR')}</div>
                       <div className="text-base font-black text-text-primary">{readings[0]?.blood_sugar || '--'}<span className="text-[10px] ml-1 opacity-40">mg</span></div>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-bg-primary border border-border-light rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-gold-text hover:border-gold-text transition-all">
                    {t('FULL_VITALS_DATA')}
                 </button>
              </div>
           </motion.section>

            {/* Sovereign Modern Insights Row */}
            <motion.section variants={item} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Inventory Spotlight */}
           <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] flex flex-col justify-between group hover:border-gold/30 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10">
                    <Package size={20} />
                  </div>
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Critical Inventory</span>
                </div>
                <div className="space-y-4">
                   {lowStockItems.length > 0 ? lowStockItems.slice(0, 3).map(item => (
                     <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-text-primary">{item.name}</span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10">Low: {item.current_stock}{item.unit}</span>
                     </div>
                   )) : (
                     <div className="flex items-center gap-3 text-text-success opacity-50 py-4">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stock is Stable</span>
                     </div>
                   )}
                </div>
              </div>
              <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-gold-text uppercase tracking-widest group-hover:gap-3 transition-all">
                 Restock Vault <ArrowRight size={14} />
              </button>
           </div>

           {/* Learning & Rituals */}
           <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] flex flex-col justify-between group hover:border-gold/30 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/5 text-indigo-600 flex items-center justify-center border border-indigo-500/10">
                    <GraduationCap size={20} />
                  </div>
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Learning & Traditions</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-text-primary">Daily Rituals</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${ritualLogs.length > 0 ? 'text-success bg-success/5 border-success/10' : 'text-text-tertiary bg-bg-tertiary border-border-light'}`}>
                        {ritualLogs.length > 0 ? 'COMPLETE' : 'PENDING'}
                      </span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-text-primary">Learning Pulse</span>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10">
                        {totalVidyaMins} Mins Logged
                      </span>
                   </div>
                </div>
              </div>
              <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                 Continue Path <ArrowRight size={14} />
              </button>
           </div>

           {/* Prosperity Goals */}
           <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] flex flex-col justify-between group hover:border-gold/30 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-success/5 text-success flex items-center justify-center border border-success/10">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Wealth Targets</span>
                </div>
                <div className="space-y-4">
                   {goals.length > 0 ? goals.slice(0, 2).map(g => (
                     <div key={g.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-text-primary">{g.name}</span>
                          <span className="text-[9px] font-black text-text-tertiary tracking-widest">₹{g.target_amount}</span>
                        </div>
                        <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden border border-border-light/40">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (g.current_progress / g.target_amount) * 100)}%` }}
                            className="h-full bg-success" 
                          />
                        </div>
                     </div>
                   )) : (
                     <div className="text-center py-4 text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-40">No Goals Set</div>
                   )}
                </div>
              </div>
              <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-text-success uppercase tracking-widest group-hover:gap-3 transition-all">
                 Growth Matrix <ArrowRight size={14} />
              </button>
           </div>
        </motion.section>

        {/* System Sync Row */}
        <motion.section variants={item} className="lg:col-span-3">
            <button className="w-full flex items-center justify-between p-6 bg-bg-primary border border-border-light rounded-[2rem] hover:border-gold-text transition-all group shadow-xl shadow-black/[0.02] active:scale-[0.98]">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10 group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                      <Zap size={24} strokeWidth={3} />
                   </div>
                   <div className="text-left">
                      <div className="text-[15px] font-black text-text-primary tracking-tight">{t('SYNC_NOW')}</div>
                      <div className="text-[9px] text-text-tertiary uppercase font-black tracking-[0.3em] opacity-60 mt-1">{t('P2P_BEAM_GRID')}</div>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center group-hover:border-gold-text group-hover:bg-gold-text/5 transition-all">
                   <ArrowRight className="text-border-medium group-hover:text-gold-text transition-colors" size={18} />
                </div>
            </button>
        </motion.section>
      </div>
    </div>
  </motion.div>
  );
}
