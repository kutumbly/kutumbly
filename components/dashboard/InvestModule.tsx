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

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useCash } from '@/modules/cash';
import { useFamily } from '@/modules/family';
import ModuleShell from './ModuleShell';
import GlassCard from '../ui/GlassCard';
import MetricCard from '../ui/MetricCard';
import EmptyState from '../ui/EmptyState';
import { 
  TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Briefcase, 
  Landmark, Target, FileText, CalendarDays, ShieldCheck, Zap, 
  Heart, Home, GraduationCap, Car, Coins, X, PlusCircle, Trash2, Edit3, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import { Investment, FamilyMember, InvestmentTransaction } from '@/types/db';

type InvestView = 'overview' | 'asset-list' | 'ledger' | 'goals';

export default function InvestModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const { 
    investments, goals,
    addInvestment, deleteInvestment,
    addInvestmentTransaction, getInvestmentTransactions,
    addGoal, editGoal, deleteGoal
  } = useCash();
  
  const { familyMembers } = useFamily();
  
  const [view, setView] = useState<InvestView>('overview');
  const [selectedHold, setSelectedHold] = useState<Investment | null>(null);

  // Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [fName, setFName] = useState('');
  const [fType, setFType] = useState('Mutual Fund');
  const [fPrincipal, setFPrincipal] = useState('');
  const [fCurrent, setFCurrent] = useState('');
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);
  const [fNotes, setFNotes] = useState('');
  
  // Transaction States
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<'sip' | 'lumpsum' | 'valuation' | 'withdrawal'>('sip');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txNotes, setTxNotes] = useState('');

  const totalWealth = useMemo(() => {
    return investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0);
  }, [investments]);

  const totalReturns = useMemo(() => {
    const principal = investments.reduce((sum, inv) => sum + (inv.principal || 0), 0);
    return totalWealth - principal;
  }, [totalWealth, investments]);

  const handleSaveHold = () => {
    if (!fName || !fPrincipal) return;
    addInvestment({
      name: fName,
      type: fType,
      principal: Number(fPrincipal),
      current_value: Number(fCurrent) || Number(fPrincipal),
      start_date: fDate,
      notes: fNotes
    });
    setShowAddModal(false);
    setFName(''); setFPrincipal(''); setFCurrent('');
  };

  const handleSaveTransaction = () => {
    if (!selectedHold || !txAmount) return;
    addInvestmentTransaction({
      investment_id: selectedHold.id,
      type: txType,
      amount: Number(txAmount),
      date: txDate,
      notes: txNotes
    });
    setShowTxModal(false);
    setTxAmount(''); setTxNotes('');
  };

  return (
    <ModuleShell 
      variant="glass"
      title={view === 'overview' ? t('NAV_INVEST') : t('NAV_INVEST')}
      onAdd={() => setShowAddModal(true)}
      addLabel="New Asset"
      onBack={view !== 'overview' ? () => setView('overview') : undefined}
    >
      <AnimatePresence mode="wait">
        {view === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Master Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <MetricCard 
                label="Consolidated Wealth" 
                value={totalWealth} 
                isCurrency 
                status="default" 
               />
               <MetricCard 
                label="Net Gain/Loss" 
                value={totalReturns} 
                isCurrency 
                status={totalReturns >= 0 ? 'success' : 'danger'} 
               />
               <MetricCard 
                label="Growth Rate" 
                value={totalWealth > 0 ? (totalReturns / (totalWealth - totalReturns) * 100).toFixed(1) + '%' : '0%'} 
                status="default" 
               />
            </div>

            {/* Asset Classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">Current Holdings</h3>
                  <div className="grid grid-cols-1 gap-3">
                     {investments.length > 0 ? investments.map((inv) => (
                       <GlassCard 
                        key={inv.id} 
                        onClick={() => { setSelectedHold(inv); setView('ledger'); }}
                        className="p-5 flex items-center justify-between group cursor-pointer"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:scale-105 transition-transform">
                                <Briefcase size={20} />
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-text-primary tracking-tight">{inv.name}</h4>
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-0.5">{inv.type}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black text-text-primary">₹{inv.current_value.toLocaleString()}</div>
                             <div className={`text-[9px] font-black uppercase ${inv.current_value >= inv.principal ? 'text-success' : 'text-danger'}`}>
                               {inv.current_value >= inv.principal ? '+' : ''}{((inv.current_value - inv.principal) / inv.principal * 100).toFixed(1)}%
                             </div>
                          </div>
                       </GlassCard>
                     )) : (
                       <EmptyState icon={TrendingUp} title="No assets in vault" />
                     )}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">Wealth Goals</h3>
                  <div className="grid grid-cols-1 gap-3">
                     {goals.length > 0 ? goals.map((goal) => {
                       const progress = Math.min(100, (totalWealth / goal.target_amount) * 100);
                       return (
                        <GlassCard key={goal.id} className="p-5">
                           <div className="flex justify-between items-center mb-3">
                             <div className="flex items-center gap-3">
                               <Target size={16} className="text-gold" />
                               <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">{goal.name}</span>
                             </div>
                             <span className="text-[9px] font-bold text-text-tertiary">₹{goal.target_amount.toLocaleString()}</span>
                           </div>
                           <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden">
                             <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-gold rounded-full"
                             />
                           </div>
                        </GlassCard>
                       );
                     }) : (
                       <EmptyState icon={Target} title="No active goals" />
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {view === 'ledger' && selectedHold && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-10 shadow-xl">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-text-primary tracking-tighter">{selectedHold.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest bg-bg-tertiary px-3 py-1 rounded-full">{selectedHold.type}</span>
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Since {new Date(selectedHold.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-4xl font-black text-text-primary tracking-tighter">₹{selectedHold.current_value.toLocaleString()}</div>
                   <div className={`text-xs font-black mt-1 ${selectedHold.current_value >= selectedHold.principal ? 'text-success' : 'text-danger'}`}>
                     {selectedHold.current_value >= selectedHold.principal ? '+' : ''}{((selectedHold.current_value - selectedHold.principal) / selectedHold.principal * 100).toFixed(1)}%
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mb-10">
                 <button 
                  onClick={() => setShowTxModal(true)}
                  className="flex-1 bg-gold-text text-white font-black uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                 >
                    <PlusCircle size={18} /> Record Movement
                 </button>
                 <button 
                  onClick={() => {
                    if (window.confirm('Delete this asset and all records?')) {
                      deleteInvestment(selectedHold.id);
                      setView('overview');
                    }
                  }}
                  className="px-6 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-50"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Transaction Ledger</h4>
                 <div className="space-y-2">
                    {getInvestmentTransactions(selectedHold.id).map((tx: InvestmentTransaction) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-2xl border border-border-light">
                         <div className="flex gap-4 items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'withdrawal' ? 'bg-red-500/10 text-red-500' : 'bg-success/10 text-success'}`}>
                               <Coins size={18} />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-text-primary capitalize">{tx.type}</div>
                               <div className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{new Date(tx.date).toDateString()}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className={`text-sm font-black ${tx.type === 'withdrawal' ? 'text-red-500' : 'text-success'}`}>
                               {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                            </div>
                            {tx.notes && <div className="text-[9px] text-text-tertiary italic">{tx.notes}</div>}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-primary w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-border-light"
           >
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-text-primary tracking-tight">New Sovereign Asset</h2>
                 <button onClick={() => setShowAddModal(false)}><X /></button>
              </div>
              <div className="space-y-4">
                 <input value={fName} onChange={e => setFName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold" placeholder="Asset Name (e.g. NIFTY 50 MF)" />
                 <select value={fType} onChange={e => setFType(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold appearance-none">
                    <option>Mutual Fund</option>
                    <option>Stocks</option>
                    <option>Fixed Deposit</option>
                    <option>Gold</option>
                    <option>Real Estate</option>
                    <option>Other</option>
                 </select>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={fPrincipal} onChange={e => setFPrincipal(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold" placeholder="Principal (Cost)" />
                    <input type="number" value={fCurrent} onChange={e => setFCurrent(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold" placeholder="Current Value" />
                 </div>
                 <button onClick={handleSaveHold} className="w-full bg-gold-text text-white font-black h-16 rounded-2xl shadow-xl mt-4 uppercase tracking-widest">Seal to Vault</button>
              </div>
           </motion.div>
        </div>
      )}

      {showTxModal && selectedHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-primary w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-border-light"
           >
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-text-primary tracking-tight">Record Movement</h2>
                 <button onClick={() => setShowTxModal(false)}><X /></button>
              </div>
              <div className="space-y-4">
                 <select value={txType} onChange={e => setTxType(e.target.value as any)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold appearance-none">
                    <option value="sip">SIP / Monthly Deposit</option>
                    <option value="lumpsum">One-time / Lumpsum</option>
                    <option value="valuation">Valuation Adjustment</option>
                    <option value="withdrawal">Withdrawal / Redemption</option>
                 </select>
                 <input type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold text-2xl" placeholder="₹ Amount" />
                 <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 font-bold" />
                 <button onClick={handleSaveTransaction} className="w-full bg-gold-text text-white font-black h-16 rounded-2xl shadow-xl mt-4 uppercase tracking-widest">Update Ledger</button>
              </div>
           </motion.div>
        </div>
      )}
    </ModuleShell>
  );
}
