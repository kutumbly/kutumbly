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
import { useInvest } from '@/hooks/useInvest';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import SparkLine from '../ui/SparkLine';
import RupeesDisplay from '../ui/RupeesDisplay';
import { TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Briefcase, Landmark, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvestModule() {
  const { lang } = useAppStore();
  const { investments, summary } = useInvest();

  return (
    <ModuleShell 
      title={lang === 'en' ? "Wealth Portfolio" : "Nivesh Vault"}
      subtitle={lang === 'en' ? "Tracking family assets & growth" : "Parivar ki bachat aur nivesh ka lekha"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "Add Holding" : "Naya Nivesh"}
    >
      <div className="space-y-8">
        
        {/* Wealth Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Total Value" value={summary.currentValue} isCurrency status="success" trend={[summary.currentValue * 0.9, summary.currentValue * 0.95, summary.currentValue]} />
           <MetricCard label="Total Profit" value={summary.profit} isCurrency status={summary.profit >= 0 ? 'success' : 'danger'} />
           <MetricCard label="PnL Percent" value={summary.pnlPercent.toFixed(1)} unit="%" status={summary.pnlPercent >= 0 ? 'success' : 'danger'} />
           <MetricCard label="SIP Volume" value={investments.reduce((acc, i) => acc + (Number(i.monthly_sip) || 0), 0)} isCurrency status="info" />
        </div>

        {/* Portfolio Holdings */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
             Active Asset Holdings
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {investments.length > 0 ? investments.map((h, i) => {
               const isProfit = h.current_value >= h.principal;
               const gain = h.principal > 0 ? (((h.current_value - h.principal) / h.principal) * 100).toFixed(1) : 0;
               
               return (
                <motion.div 
                   key={String(h.id)}
                   whileHover={{ y: -2 }}
                   className="card p-6 flex flex-col gap-4 group hover:border-gold/30 hover:shadow-xl transition-all"
                >
                   <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${isProfit ? 'bg-bg-success border-text-success/10 text-text-success' : 'bg-bg-danger border-text-danger/10 text-text-danger'}`}>
                        {h.type === 'Mutual Fund' ? <TrendingUp size={24} /> : h.type === 'PPF' ? <Landmark size={24} /> : <PieChart size={24} />}
                      </div>
                      <div className="text-right">
                         <div className={`flex items-center justify-end gap-1 text-[10px] font-black uppercase tracking-widest ${isProfit ? 'text-text-success' : 'text-text-danger'}`}>
                            {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {gain}%
                         </div>
                         <SparkLine data={[h.principal, h.principal * 1.05, h.current_value]} color={isProfit ? 'var(--text-success)' : 'var(--text-danger)'} />
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-black text-text-primary tracking-tight leading-tight mb-1">{String(h.name)}</h4>
                      <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{String(h.type)}</p>
                   </div>

                   <div className="flex justify-between items-end border-t border-border-light/30 pt-4 mt-2">
                      <div>
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">Principal</div>
                         <div className="text-xs font-bold text-text-secondary">₹{h.principal.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">Market Value</div>
                         <div className="text-sm font-black text-text-primary">₹{h.current_value.toLocaleString('en-IN')}</div>
                      </div>
                   </div>
                </motion.div>
               );
             }) : (
               <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-20">
                  <Briefcase size={48} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">No investments found</p>
               </div>
             )}
          </div>
        </section>

        {/* Goals / Targets (Placeholder for depth) */}
        <section className="bg-bg-primary border border-border-light rounded-2xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-gold/10 transition-all"></div>
           <div className="relative flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-inner">
                 <Target size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-base font-black text-text-primary tracking-tight">Financial Independence Target</h3>
                 <p className="text-xs font-bold text-text-secondary mt-1 max-w-md">Your current portfolio covers approximately 4% of your family's FIRE target. Consistent SIPs will accelerate this.</p>
              </div>
              <button className="btn bg-gold text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-[0.2em] border-none shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all">
                 Review Analysis
              </button>
           </div>
        </section>

      </div>
    </ModuleShell>
  );
}
