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

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useInvest } from '@/hooks/useInvest';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import SparkLine from '../ui/SparkLine';
import RupeesDisplay from '../ui/RupeesDisplay';
import { TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Briefcase, Landmark, Target, FileText, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Investment } from '@/types/db';

type InvestView = 'overview' | 'asset-list' | 'ledger';

export default function InvestModule() {
  const { lang } = useAppStore();
  const { investments, summary } = useInvest();
  
  const [view, setView] = useState<InvestView>('overview');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedHold, setSelectedHold] = useState<Investment | null>(null);

  const getBreadcrumbs = () => {
    const list = [lang === 'en' ? "Wealth" : "Nivesh"];
    if (view === 'asset-list' || view === 'ledger') list.push(selectedType || '');
    if (view === 'ledger') list.push(selectedHold?.name || '');
    return list;
  };

  const handleBack = () => {
    if (view === 'ledger') setView('asset-list');
    else if (view === 'asset-list') setView('overview');
  };

  const assetTypes = Array.from(new Set(investments.map(i => i.type)));

  return (
    <ModuleShell 
      title={
        view === 'overview' ? (lang === 'en' ? "Wealth Portfolio" : "Nivesh Vault") :
        view === 'asset-list' ? `${selectedType} Holdings` :
        selectedHold?.name || "Ledger"
      }
      subtitle={view === 'overview' ? (lang === 'en' ? "Tracking family assets & growth" : "Parivar ki bachat aur nivesh ka lekha") : undefined}
      onAdd={view === 'overview' ? () => {} : undefined}
      addLabel={view === 'overview' ? (lang === 'en' ? "Add Holding" : "Naya Nivesh") : undefined}
      breadcrumbs={view !== 'overview' ? getBreadcrumbs() : undefined}
      onBack={view !== 'overview' ? handleBack : undefined}
    >
      <AnimatePresence mode="wait">
        {view === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
        
        {/* Wealth Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Total Value" value={summary.currentValue} isCurrency status="success" trend={[summary.currentValue * 0.9, summary.currentValue * 0.95, summary.currentValue]} />
           <MetricCard label="Total Profit" value={summary.profit} isCurrency status={summary.profit >= 0 ? 'success' : 'danger'} />
           <MetricCard label="PnL Percent" value={summary.pnlPercent.toFixed(1)} unit="%" status={summary.pnlPercent >= 0 ? 'success' : 'danger'} />
           <MetricCard label="SIP Volume" value={investments.reduce((acc: number, i: Investment) => acc + (Number(i.monthly_sip) || 0), 0)} isCurrency status="info" />
        </div>

        {/* Portfolio Classes */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
             Asset Classes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {assetTypes.map((type) => {
               const typeHoldings = investments.filter(i => i.type === type);
               const typePrincipal = typeHoldings.reduce((acc, i) => acc + i.principal, 0);
               const typeValue = typeHoldings.reduce((acc, i) => acc + i.current_value, 0);
               const isProfit = typeValue >= typePrincipal;
               const gain = typePrincipal > 0 ? (((typeValue - typePrincipal) / typePrincipal) * 100).toFixed(1) : "0.0";
               
               return (
                <motion.div 
                   key={String(type)}
                   whileHover={{ y: -2 }}
                   onClick={() => { setSelectedType(String(type)); setView('asset-list'); }}
                   className="card p-6 flex flex-col gap-4 group hover:border-gold/30 hover:shadow-xl transition-all cursor-pointer"
                >
                   <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${isProfit ? 'bg-bg-success border-text-success/10 text-text-success' : 'bg-bg-danger border-text-danger/10 text-text-danger'}`}>
                        {type === 'Mutual Fund' ? <TrendingUp size={24} /> : type === 'PPF' ? <Landmark size={24} /> : <PieChart size={24} />}
                      </div>
                      <div className="text-right">
                         <div className={`flex items-center justify-end gap-1 text-[10px] font-black uppercase tracking-widest ${isProfit ? 'text-text-success' : 'text-text-danger'}`}>
                            {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {gain}%
                         </div>
                         <SparkLine data={[typePrincipal, typePrincipal * 1.05, typeValue]} color={isProfit ? 'var(--text-success)' : 'var(--text-danger)'} />
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-black text-text-primary tracking-tight leading-tight mb-1">{type}</h4>
                      <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{typeHoldings.length} Holdings</p>
                   </div>
                </motion.div>
               );
             })}
             
             {assetTypes.length === 0 && (
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

        </motion.div>
        )}

        {/* Level 2: Asset Class Holdings List */}
        {view === 'asset-list' && (
          <motion.div
            key="asset-list"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {investments.filter(i => i.type === selectedType).map(h => {
                 const isProfit = h.current_value >= h.principal;
                 return (
                   <motion.div 
                     key={String(h.id)}
                     whileHover={{ y: -2 }}
                     onClick={() => { setSelectedHold(h); setView('ledger'); }}
                     className="card p-6 flex flex-col gap-4 group hover:border-gold/30 hover:shadow-xl transition-all cursor-pointer"
                   >
                     <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-black text-text-primary tracking-tight leading-tight mb-1">{h.name}</h4>
                          <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest flex items-center gap-2">
                            <span>SIP: ₹{(Number(h.monthly_sip) || 0).toLocaleString()}</span>
                          </p>
                        </div>
                     </div>
                     <div className="flex justify-between items-end border-t border-border-light/30 pt-4 mt-2">
                        <div>
                           <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">Principal</div>
                           <div className="text-xs font-bold text-text-secondary">₹{h.principal.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">Market Value</div>
                           <div className={`text-sm font-black ${isProfit ? 'text-success' : 'text-danger'}`}>
                             ₹{h.current_value.toLocaleString('en-IN')}
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}
            </div>
          </motion.div>
        )}

        {/* Level 3: Individual Asset Ledger Placeholder */}
        {view === 'ledger' && selectedHold && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-bg-primary border border-border-light rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/[0.02]"
          >
            <div className="p-8 border-b border-border-light bg-bg-tertiary">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">{selectedHold.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest bg-bg-primary px-3 py-1 rounded-full border border-border-light">{selectedHold.type}</span>
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><CalendarDays size={12}/> Since {new Date(String(selectedHold.start_date)).getFullYear()}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Current NAV Value</div>
                   <div className="text-3xl font-black text-text-primary">₹{selectedHold.current_value.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="p-0">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border-light bg-bg-primary">
                        <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Date</th>
                        <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Particulars</th>
                        <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] text-right">Units</th>
                        <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] text-right">Debit (Investment)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {/* Mock Drill Down Ledger Data */}
                     {[
                       { d: '01 Apr 2026', p: 'Monthly SIP Auto-Debit', u: '+12.450', a: selectedHold.monthly_sip || 5000 },
                       { d: '01 Mar 2026', p: 'Monthly SIP Auto-Debit', u: '+12.102', a: selectedHold.monthly_sip || 5000 },
                       { d: '01 Feb 2026', p: 'Monthly SIP Auto-Debit', u: '+13.001', a: selectedHold.monthly_sip || 5000 },
                     ].map((row, i) => (
                       <tr key={i} className="border-b border-border-light/50 hover:bg-bg-tertiary transition-colors cursor-pointer group">
                          <td className="p-5 text-[11px] font-bold text-text-secondary">{row.d}</td>
                          <td className="p-5 text-sm font-black text-text-primary tracking-tight flex items-center gap-3">
                             <FileText size={14} className="text-text-tertiary group-hover:text-gold" />
                             {row.p}
                          </td>
                          <td className="p-5 text-xs font-bold text-text-secondary text-right">{row.u}</td>
                          <td className="p-5 text-sm font-black text-text-primary text-right text-success">₹{(Number(row.a)).toLocaleString()}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               
               <div className="p-8 text-center text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex flex-col items-center gap-3">
                 <div className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all cursor-pointer">
                    +
                 </div>
                 Enter Manual Voucher
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModuleShell>
  );
}
