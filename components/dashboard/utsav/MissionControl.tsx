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
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useUtsavEngine } from '@/modules/utsav';
import { UtsavEvent } from '@/types/db';

interface MissionControlProps {
  event: UtsavEvent;
  onNavigate: (view: 'inventory' | 'guests' | 'shagun') => void;
}

export default function MissionControl({ event, onNavigate }: MissionControlProps) {
  const { inventory, activityLogs, budgetStats } = useUtsavEngine(event.id);

  const stats = {
    inventoryReceived: inventory.filter(i => i.status === 'RECEIVED' || i.status === 'IN_USE').length,
    inventoryTotal: inventory.length,
    pendingAlerts: inventory.filter(i => i.status === 'ORDERED' && i.delivery_date_expected && new Date(i.delivery_date_expected) < new Date()).length
  };

  const progressPercent = stats.inventoryTotal > 0 
    ? Math.round((stats.inventoryReceived / stats.inventoryTotal) * 100) 
    : 0;

  const budgetTotal = event.budget || 0;
  const budgetRisk = budgetStats.forecasted > budgetTotal;
  const budgetRiskAmount = budgetStats.forecasted - budgetTotal;

  return (
    <div className="space-y-8">
      {/* 1. AI Insight Strip (Premium Glass) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gold/10 border border-gold/30 backdrop-blur-md rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-6 group hover:bg-gold/15 transition-all cursor-default relative overflow-hidden shadow-xl shadow-gold/5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="w-16 h-16 rounded-[1.5rem] bg-gold/20 flex items-center justify-center text-gold shadow-2xl shadow-gold/20 relative z-10 flex-shrink-0">
          <Activity size={32} className="animate-pulse" />
        </div>
        <div className="flex-1 relative z-10">
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2 opacity-80">Sovereign Decision Engine Insight</p>
          <p className="text-base font-black text-text-primary tracking-tight leading-relaxed">
            {budgetRisk 
              ? `Financial Risk Detected: Current forecast exceeds budget by ₹${budgetRiskAmount.toLocaleString()}. Strategy optimization required.`
              : stats.pendingAlerts > 0 
                ? `Attention: ${stats.pendingAlerts} inventory deliveries are delayed. Logistic chain at risk.` 
                : "All clear. Event logistics and financials are currently operating within nominal parameters."}
          </p>
        </div>
      </motion.div>

      {/* 2. Top Tier Command Stats (Standardized) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Progress Card */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:border-gold/30 transition-all card-lift">
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-light flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <TrendingUp size={28} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-text-primary tabular-nums tracking-tighter">{progressPercent}%</span>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1 opacity-60">Readiness</p>
                  </div>
               </div>
               <div className="w-full h-2.5 bg-bg-secondary rounded-full overflow-hidden border border-border-light shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="h-full bg-gold-text shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-full"
                  />
               </div>
               <div className="mt-6 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                 <p className="text-[11px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                    {stats.inventoryReceived} / {stats.inventoryTotal} Assets Optimized
                 </p>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/10 transition-all pointer-events-none" />
         </div>

         {/* Budget Forecast Card */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl group hover:border-gold/30 transition-all cursor-pointer overflow-hidden relative card-lift">
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-light flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Package size={28} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-text-primary tabular-nums tracking-tighter">₹{budgetStats.forecasted.toLocaleString('en-IN')}</span>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1 opacity-60">Projected Total</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  {budgetRisk ? (
                     <span className="text-text-danger bg-text-danger/5 px-3 py-1 rounded-full border border-text-danger/10">⚠️ Risk: Overload Detected</span>
                  ) : (
                     <span className="text-text-success bg-text-success/5 px-3 py-1 rounded-full border border-text-success/10">✅ Within Nominal Budget</span>
                  )}
               </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/10 transition-all pointer-events-none" />
            {budgetRisk && <div className="absolute inset-0 bg-text-danger/[0.03] animate-pulse-slow pointer-events-none" />}
         </div>

         {/* Responsibility Heatmap Card */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl group hover:border-gold/30 transition-all cursor-pointer card-lift">
            <div className="flex justify-between items-start mb-6">
               <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-light flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Users size={28} className="text-gold" />
               </div>
               <div className="text-right">
                 <span className="text-3xl font-black text-text-primary tabular-nums tracking-tighter">{inventory.filter(i => i.status === 'ORDERED').length}</span>
                 <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1 opacity-60">Pending Alerts</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-text-success uppercase tracking-[0.2em] bg-text-success/5 px-3 py-1.5 rounded-xl border border-text-success/10 inline-flex">
               <CheckCircle2 size={14} /> 4 Cousins Operations Active
            </div>
         </div>
      </div>

      {/* 3. Live Command Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Live Inventory Timeline (Mini) */}
         <div className="bg-bg-primary border border-border-light rounded-[3rem] p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between mb-2">
               <div>
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Mission Timeline</h3>
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Real-time EOS Log</p>
               </div>
               <button 
                  onClick={() => onNavigate('inventory')}
                  className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-[0.2em] hover:opacity-80 transition-all"
               >
                  Full Hub <ArrowRight size={14} />
               </button>
            </div>

            <div className="space-y-6">
               {activityLogs.slice(0, 6).map((log, idx) => (
                  <div key={log.id} className="flex gap-6 group relative">
                     <div className="flex flex-col items-center relative z-10">
                        <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.7)] group-hover:scale-125 transition-transform" />
                        {idx < 5 && <div className="w-0.5 h-full bg-border-light/40 my-2" />}
                     </div>
                     <div className="flex-1 pb-8 relative z-10">
                        <div className="flex justify-between items-center mb-1.5">
                           <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">{log.action}</span>
                           <span className="text-[9px] font-black text-text-tertiary tabular-nums bg-bg-tertiary px-2 py-0.5 rounded-lg border border-border-light/50">{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                         <p className="text-sm font-black text-text-primary group-hover:text-gold transition-colors leading-tight">
                            {JSON.parse(log.metadata || '{}').item_name || 'Protocol Update'}
                         </p>
                         <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <Clock size={10} /> Verified by Sovereign Engine
                         </p>
                     </div>
                  </div>
               ))}
               {activityLogs.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center opacity-30 text-center">
                     <Clock size={32} strokeWidth={1} className="mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">No activity logged yet</p>
                  </div>
               )}
            </div>
         </div>

         {/* At-Risk Responsibilities */}
         <div className="bg-bg-primary border border-border-light rounded-[3rem] p-8 shadow-xl space-y-6">
            <div>
               <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Accountability Heatmap</h3>
               <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Critical Responsibility Status</p>
            </div>

            <div className="space-y-4">
               {inventory.filter(i => i.status === 'ORDERED').slice(0, 3).map(item => (
                  <div key={item.id} className="bg-bg-secondary border border-border-light p-5 rounded-2xl flex items-center justify-between group hover:border-text-danger/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-danger border border-text-danger/10">
                           <AlertTriangle size={18} />
                        </div>
                        <div>
                           <h4 className="text-xs font-black text-text-primary">{item.item_name}</h4>
                           <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Assigned: {item.assigned_to_id || 'Unassigned'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-text-danger uppercase tracking-widest">AT RISK</p>
                        <p className="text-[8px] font-bold text-text-tertiary">{item.delivery_date_expected || 'No Deadline'}</p>
                     </div>
                  </div>
               ))}
               {inventory.filter(i => i.status === 'ORDERED').length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center opacity-30 text-center">
                     <CheckCircle2 size={32} strokeWidth={1} className="mb-4 text-text-success" />
                     <p className="text-[10px] font-black uppercase tracking-widest">All responsibilities cleared</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
