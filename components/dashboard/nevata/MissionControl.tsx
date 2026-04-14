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
  Activity, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNevataEngine } from '@/hooks/useNevataEngine';
import { NevataEvent } from '@/types/db';

interface MissionControlProps {
  event: NevataEvent;
  onNavigate: (view: 'inventory' | 'guests' | 'shagun') => void;
}

export default function MissionControl({ event, onNavigate }: MissionControlProps) {
  const { inventory, activityLogs } = useNevataEngine(event.id);

  const stats = {
    inventoryReceived: inventory.filter(i => i.status === 'RECEIVED' || i.status === 'IN_USE').length,
    inventoryTotal: inventory.length,
    pendingAlerts: inventory.filter(i => i.status === 'ORDERED' && i.delivery_date_expected && new Date(i.delivery_date_expected) < new Date()).length
  };

  const progressPercent = stats.inventoryTotal > 0 
    ? Math.round((stats.inventoryReceived / stats.inventoryTotal) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* 1. AI Insight Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gold/10 border border-gold/30 rounded-3xl p-5 flex items-center gap-4 group hover:bg-gold/15 transition-all cursor-default"
      >
        <div className="w-10 h-10 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
          <Activity size={20} className="animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">EOS Decision Engine Insight</p>
          <p className="text-sm font-bold text-text-primary">
            {stats.pendingAlerts > 0 
              ? `Attention: ${stats.pendingAlerts} inventory deliveries are delayed. Logistic chain at risk.` 
              : "All clear. Event logistics are currently operating within nominal parameters."}
          </p>
        </div>
      </motion.div>

      {/* 2. Top Tier Command Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Progress Card */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-bg-secondary rounded-2xl border border-border-light">
                    <TrendingUp size={24} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-text-primary">{progressPercent}%</span>
                    <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Readiness</p>
                  </div>
               </div>
               <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden border border-border-light">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gold-text shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  />
               </div>
               <p className="mt-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-relaxed">
                  {stats.inventoryReceived} of {stats.inventoryTotal} items received
               </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/10 transition-all" />
         </div>

         {/* Budget Forecast Card (Placeholder for now) */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl group hover:border-gold/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-bg-secondary rounded-2xl border border-border-light">
                 <Package size={24} className="text-gold" />
               </div>
               <div className="text-right">
                 <span className="text-2xl font-black text-text-primary">₹{event.budget?.toLocaleString() || '0'}</span>
                 <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Total Budget</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
               <span className="text-text-danger">⚠️ Risk: ₹12K Overload</span>
            </div>
         </div>

         {/* Responsibility Heatmap Card */}
         <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl group hover:border-gold/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-bg-secondary rounded-2xl border border-border-light">
                 <Users size={24} className="text-gold" />
               </div>
               <div className="text-right">
                 <span className="text-2xl font-black text-text-primary">{inventory.filter(i => i.status === 'ORDERED').length}</span>
                 <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Pending Assignments</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-text-success">
               <CheckCircle2 size={12} /> 4 Cousins Operations Active
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
               {activityLogs.slice(0, 4).map((log, idx) => (
                  <div key={log.id} className="flex gap-4 group">
                     <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                        {idx < 3 && <div className="w-0.5 h-full bg-border-light/50 my-1" />}
                     </div>
                     <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{log.action}</span>
                           <span className="text-[8px] font-bold text-text-tertiary/60">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                         <p className="text-xs font-bold text-text-primary group-hover:text-gold transition-all">
                            {JSON.parse(log.metadata || '{}').item_name || 'System Update'}
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
