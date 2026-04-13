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
import { useAppStore } from '@/lib/store';
import { useMoney } from '@/hooks/useMoney';
import { useDiary } from '@/hooks/useDiary';
import { useHealth } from '@/hooks/useHealth';
import MetricCard from '../ui/MetricCard';
import { Shield, Clock, Plus, ArrowRight, Fingerprint, HardDrive, Activity, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { hasBiometricRegistered } from '@/lib/biometric';

export default function HomeModule() {
  const { db, lang, activeVault } = useAppStore();
  const { summary } = useMoney();
  const { entries } = useDiary();
  const { readings } = useHealth();

  // 1. Calculate Custom Stats
  let tasksPending = 0;
  let eventsUpcoming = 0;
  if (db) {
    try { tasksPending = db.exec("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")[0]?.values[0][0] as number; } catch {}
    try { eventsUpcoming = db.exec("SELECT COUNT(*) FROM nevata_events WHERE event_date >= date('now')")[0]?.values[0][0] as number; } catch {}
  }

  const bioActive = activeVault && hasBiometricRegistered(activeVault.id);
  const avgWeight = readings.length > 0 ? readings.reduce((acc, r) => acc + (r.weight || 0), 0) / readings.length : 0;
  const latestBP = readings[0] ? `${readings[0].bp_systolic}/${readings[0].bp_diastolic}` : '--/--';

  const stats = [
    { 
      label: lang === 'en' ? "Monthly Balance" : "Kul Jama", 
      value: summary.balance, 
      isCurrency: true, 
      trend: [20000, 25000, 22000, 30000, summary.balance as number],
      status: 'success' as const
    },
    { 
      label: lang === 'en' ? "Tasks Due" : "Baaki Kaam", 
      value: tasksPending as number, 
      status: (Number(tasksPending) > 5 ? 'danger' : 'warning') as const,
      trend: [2, 4, 3, 5, tasksPending as number]
    },
    { 
      label: lang === 'en' ? "Latest BP" : "Blood Pressure", 
      value: latestBP,
      status: 'info' as const
    },
    { 
      label: lang === 'en' ? "Expenses" : "Kharcha", 
      value: summary.expense, 
      isCurrency: true, 
      status: 'danger' as const,
      trend: [5000, 8000, 4000, 12000, summary.expense as number]
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
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="card glass border-l-4 border-l-gold py-3 px-4 flex items-center gap-3">
            <Shield size={18} className="text-gold" />
            <div className="flex-1">
               <div className="text-[8px] font-black uppercase tracking-[0.2em] text-text-tertiary">OS Security</div>
               <div className="text-[10px] font-bold text-text-primary">AES-256 Lockdown Active</div>
            </div>
         </div>
         <div className="card glass border-l-4 border-l-text-info py-3 px-4 flex items-center gap-3">
            <Fingerprint size={18} className="text-text-info" />
            <div className="flex-1">
               <div className="text-[8px] font-black uppercase tracking-[0.2em] text-text-tertiary">Biometric Enclave</div>
               <div className="text-[10px] font-bold text-text-primary">{bioActive ? 'Hardware Linked' : 'Unlinked (PIN Only)'}</div>
            </div>
         </div>
         <div className="card glass border-l-4 border-l-text-success py-3 px-4 flex items-center gap-3">
            <HardDrive size={18} className="text-text-success" />
            <div className="flex-1">
               <div className="text-[8px] font-black uppercase tracking-[0.2em] text-text-tertiary">Sync Grid</div>
               <div className="text-[10px] font-bold text-text-primary">P2P Peer Discovery Ready</div>
            </div>
         </div>
      </motion.div>

      {/* Dynamic Metric Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <MetricCard key={i} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.section variants={item} className="md:col-span-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">
              {lang === 'en' ? 'Sovereign Activity' : 'Parivar ki Halchal'}
            </div>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="card divide-y divide-border-light/30">
            {entries.length > 0 ? entries.slice(0, 4).map((a, i) => (
              <div key={i} className="p-4 flex gap-4 items-start group hover:bg-bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-xl bg-bg-tertiary flex items-center justify-center flex-shrink-0 border border-border-light group-hover:border-gold/30 transition-all">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-bold text-text-primary leading-tight line-clamp-2">
                      {String(a.content)}
                   </p>
                   <div className="flex items-center gap-2 mt-2">
                     <span className="text-[8px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10">
                       Diary
                     </span>
                     <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-wider">
                       {String(a.date)}
                     </span>
                   </div>
                </div>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center justify-center opacity-30">
                 <Shield className="w-12 h-12 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">No logs yet</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Quick Access & Health Pulse */}
        <div className="space-y-6">
           <motion.section variants={item}>
              <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
                 {lang === 'en' ? 'Family Health' : 'Parivar Sehat'}
              </div>
              <div className="card bg-bg-info/5 border-bg-info/20 p-5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Heart className="text-text-danger animate-pulse" size={20} />
                    <div className="text-sm font-black text-text-primary">Health Pulse</div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bg-primary p-3 rounded-xl border border-border-light/50">
                       <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Avg Weight</div>
                       <div className="text-sm font-black text-text-primary">{avgWeight > 0 ? `${avgWeight.toFixed(1)}kg` : '--'}</div>
                    </div>
                    <div className="bg-bg-primary p-3 rounded-xl border border-border-light/50">
                       <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Blood Sugar</div>
                       <div className="text-sm font-black text-text-primary">{readings[0]?.blood_sugar || '--'} mg</div>
                    </div>
                 </div>
              </div>
           </motion.section>

           <motion.section variants={item} className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-4 bg-bg-primary border border-border-light rounded-2xl hover:border-gold transition-all group shadow-sm active:scale-[0.98]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                      <Zap size={20} strokeWidth={3} />
                   </div>
                   <div className="text-left">
                      <div className="text-sm font-black text-text-primary">Sync Now</div>
                      <div className="text-[9px] text-text-tertiary uppercase font-black tracking-widest">P2P Beam</div>
                   </div>
                </div>
                <ArrowRight className="text-border-medium group-hover:text-gold transition-colors" size={16} />
              </button>
           </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
