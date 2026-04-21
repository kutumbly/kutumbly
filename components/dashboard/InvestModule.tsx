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
import { useInvest } from '@/modules/invest';
import { useFamily } from '@/modules/family';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { 
  TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Briefcase, 
  Landmark, Target, FileText, CalendarDays, ShieldCheck, Zap, 
  Heart, Home, GraduationCap, Car, Coins 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import { Investment, FamilyMember } from '@/types/db';

type InvestView = 'overview' | 'asset-list' | 'ledger' | 'goals';

export default function InvestModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const { 
    investments, summary, goals,
    addInvestment, editInvestment, deleteInvestment,
    addTransaction, getTransactions, updateValuation, 
    getWealthProjection,
    addGoal, editGoal, deleteGoal
  } = useInvest();
  
  const { familyMembers } = useFamily();
  
  const [view, setView] = useState<InvestView>('overview');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedHold, setSelectedHold] = useState<Investment | null>(null);

  const now = new Date();

  // Add Investment Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [iName, setIName] = useState('');
  const [iType, setIType] = useState('Mutual Fund');
  const [iPrincipal, setIPrincipal] = useState('');
  const [iValue, setIValue] = useState('');
  const [iSip, setISip] = useState('');
  const [iStartDate, setIStartDate] = useState('');
  const [iMemberId, setIMemberId] = useState('');
  const [iGoalId, setIGoalId] = useState('');
  const [iUnits, setIUnits] = useState('');

  // Add Goal Modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [gName, setGName] = useState('');
  const [gTarget, setGTarget] = useState('');
  const [gCategory, setGCategory] = useState('Education');
  const [gDeadline, setGDeadline] = useState('');
  const [gMemberId, setGMemberId] = useState('');

  // Add Transaction Modal state
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<'sip' | 'lumpsum' | 'withdrawal' | 'valuation'>('sip');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState('');
  const [txNotes, setTxNotes] = useState('');

  const getBreadcrumbs = () => {
    const list = [t('WEALTH_PORTFOLIO')];
    if (view === 'asset-list' || view === 'ledger') list.push(selectedType || '');
    if (view === 'ledger') list.push(selectedHold?.name || '');
    if (view === 'goals') list.push(lang === 'hi' ? 'Lakshya' : 'Financial Goals');
    return list;
  };

  const handleBack = () => {
    if (view === 'ledger') setView('asset-list');
    else if (view === 'asset-list' || view === 'goals') setView('overview');
  };

  const assetTypes = Array.from(new Set(investments.map(i => i.type)));

  const handleSaveInvestment = () => {
    if (!iName.trim() || !iPrincipal) return;
    addInvestment({
      name: iName,
      type: iType,
      member_id: iMemberId || null,
      goal_id: iGoalId || null,
      principal: Number(iPrincipal),
      current_value: Number(iValue) || Number(iPrincipal),
      units: iUnits || null,
      monthly_sip: Number(iSip) || null,
      start_date: iStartDate || new Date().toISOString().split('T')[0],
      maturity_date: null,
      notes: null,
    });
    setShowAddModal(false);
    resetInvestmentForm();
  };

  const resetInvestmentForm = () => {
    setIName(''); setIPrincipal(''); setIValue(''); setISip(''); setIUnits('');
    setIMemberId(''); setIGoalId('');
  };

  const handleSaveGoal = () => {
    if (!gName.trim() || !gTarget) return;
    addGoal({
      name: gName,
      target_amount: Number(gTarget),
      member_id: gMemberId || null,
      deadline: gDeadline || null,
      category: gCategory,
      is_completed: 0,
    });
    setShowGoalModal(false);
    setGName(''); setGTarget('');
  };

  const handleSaveTransaction = () => {
    if (!selectedHold || !txAmount) return;
    if (txType === 'valuation') {
      updateValuation(selectedHold.id, Number(txAmount), txNotes);
    } else {
      addTransaction({
        investment_id: selectedHold.id,
        type: txType as any,
        amount: Number(txAmount),
        date: txDate || new Date().toISOString().split('T')[0],
        notes: txNotes,
      });
    }
    setShowTxModal(false);
    setTxAmount(''); setTxNotes('');
  };

  const renderGoalCard = (goal: any) => {
    const percent = Math.min(100, Math.round((goal.current_progress / goal.target_amount) * 100));
    const Icon = goal.category === 'Education' ? GraduationCap : goal.category === 'Home' ? Home : goal.category === 'Marriage' ? Heart : goal.category === 'Vehicle' ? Car : Target;
    
    return (
      <motion.div 
        key={goal.id} 
        whileHover={{ y: -4 }}
        className="bg-bg-primary border border-border-light rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
            <Icon size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{goal.category}</span>
            <div className={`text-sm font-black mt-1 ${percent >= 100 ? 'text-text-success' : 'text-text-primary'}`}>
              {percent}%
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-base font-black text-text-primary tracking-tight">{goal.name}</h4>
          <div className="flex justify-between items-end mt-4">
            <div>
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Saved</div>
              <div className="text-sm font-bold text-text-secondary">₹{goal.current_progress.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Target</div>
              <div className="text-sm font-bold text-text-primary">₹{goal.target_amount.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-bg-tertiary rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className={`h-full rounded-full ${percent >= 100 ? 'bg-text-success' : 'bg-gold'}`}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? (lang === 'hi' ? 'Dhan Sanchay' : 'Wealth Hub') :
        view === 'asset-list' ? `${selectedType} Holdings` :
        view === 'goals' ? (lang === 'hi' ? 'Arthik Lakshya' : 'Financial Goals') :
        selectedHold?.name || "Ledger"
      }
      subtitle={view === 'overview' ? t('TRACKING_ASSETS') : undefined}
      onAdd={view === 'overview' && !showAddModal ? () => setShowAddModal(true) : undefined}
      addLabel={view === 'overview' ? t('ADD_HOLDING') : undefined}
      breadcrumbs={view !== 'overview' ? getBreadcrumbs() : undefined}
      onBack={view !== 'overview' ? handleBack : undefined}
    >
      <AnimatePresence mode="wait">
        {(view === 'overview' || view === 'goals') && (
          <motion.div 
            key="dashboard-base"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
          
          {/* Add Investment Modal overlay */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6 mb-8 relative z-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">{t('NEW_INVESTMENT')}</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('ASSET_NAME')} *</label>
                    <input type="text" value={iName} onChange={e => setIName(e.target.value)} placeholder="e.g. HDFC Index Fund"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Category</label>
                    <select value={iType} onChange={e => setIType(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold appearance-none">
                      <option>Mutual Fund</option>
                      <option>PPF</option>
                      <option>SSY (Sukanya)</option>
                      <option>Gold (SGB)</option>
                      <option>Gold (Physical)</option>
                      <option>FD / RD</option>
                      <option>LIC / Insurance</option>
                      <option>Real Estate</option>
                      <option>Stock</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Link to Family Member</label>
                    <select value={iMemberId} onChange={e => setIMemberId(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold appearance-none">
                      <option value="">Family Common</option>
                      {familyMembers.map((m: FamilyMember) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('INVESTED_PRINCIPAL')} *</label>
                    <input type="number" value={iPrincipal} onChange={e => setIPrincipal(e.target.value)} placeholder="₹"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('MARKET_VALUE')}</label>
                    <input type="number" value={iValue} onChange={e => setIValue(e.target.value)} placeholder="₹ (Current)"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{iType.includes('Gold') ? 'Grams / Units' : 'Units'} (If any)</label>
                    <input type="text" value={iUnits} onChange={e => setIUnits(e.target.value)} placeholder="e.g. 10g or 452.1 Units"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('MONTHLY_SIP')}</label>
                    <input type="number" value={iSip} onChange={e => setISip(e.target.value)} placeholder="₹"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Link to Goal</label>
                    <select value={iGoalId} onChange={e => setIGoalId(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold appearance-none">
                      <option value="">General Savings</option>
                      {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Start Date</label>
                    <input type="date" value={iStartDate} onChange={e => setIStartDate(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold" />
                  </div>
                </div>
                
                <button onClick={handleSaveInvestment} disabled={!iName.trim() || !iPrincipal}
                  className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:opacity-90 disabled:opacity-30 shadow-lg shadow-gold/20 flex items-center justify-center gap-3">
                  <ShieldCheck size={18} />
                  COMMIT TO VAULT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        
        {/* Wealth Dashboard Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('TOTAL_VALUE')} value={summary.currentValue} isCurrency status="success" />
           <MetricCard label={lang === 'hi' ? 'Tax Bachat (80C)' : '80C Potential'} value={summary.taxFreePotential} isCurrency status="info" />
           <MetricCard label={lang === 'hi' ? 'Sona (Gold)' : 'Gold Weight'} value={summary.goldWeightGrams} unit="g" status="warning" />
           <MetricCard label={lang === 'hi' ? 'Masik SIP' : 'Monthly SIP'} value={summary.monthlySIP} isCurrency status={summary.monthlySIP > 0 ? 'info' : 'default'} />
        </div>

        {/* Top Actions & Sub-nav */}
        <div className="flex flex-wrap items-center gap-2">
           <button onClick={() => setView('overview')} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-gold text-white' : 'bg-bg-secondary text-text-tertiary border border-border-light hover:border-gold/30'}`}>Dashboard</button>
           <button onClick={() => setView('goals')} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'goals' ? 'bg-gold text-white' : 'bg-bg-secondary text-text-tertiary border border-border-light hover:border-gold/30'}`}>Financial Goals</button>
           <button onClick={() => setShowGoalModal(true)} className="ml-auto px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-bg-tertiary text-gold border border-gold/20 hover:bg-gold/10 transition-all flex items-center gap-2">
             <Target size={14} /> {lang === 'hi' ? 'Naya Lakshya' : 'New Goal'}
           </button>
        </div>

        {view === 'overview' ? (
          <div className="space-y-8">
            {/* Wealth Projection Chart */}
            <section className="bg-bg-primary border border-border-light rounded-[3rem] p-10 overflow-hidden relative shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                     <h3 className="text-xl font-black text-text-primary tracking-tight">{lang === 'hi' ? 'Bhavishya ki Dhanrashi' : 'Wealth Trajectory'}</h3>
                     <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-1 opacity-60">10-Year Growth Projection @ 12% Avg.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-bg-tertiary px-6 py-3 rounded-2xl border border-border-light">
                     <Zap size={16} className="text-gold" />
                     <span className="text-xs font-black text-text-primary">
                       ₹{(getWealthProjection?.(10)?.slice(-1)[0]?.estimatedValue || 0).toLocaleString('en-IN')} 
                       <span className="text-[10px] opacity-40 uppercase ml-1">By {now.getFullYear() + 10}</span>
                     </span>
                  </div>
               </div>
               
               <div className="h-48 w-full flex items-end gap-2 px-2">
                  {(getWealthProjection?.(10) || []).map((p, i) => {
                     const projection = getWealthProjection(10);
                     const max = Math.max(...projection.map(x => x.estimatedValue));
                     const height = (p.estimatedValue / max) * 100;
                     return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${height}%` }}
                             className="w-full bg-gold/10 rounded-t-xl hover:bg-gold/30 transition-all relative border-t-2 border-gold/0 group-hover:border-gold/40"
                           >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 transition-all bg-bg-primary border border-border-light px-2 py-1 rounded text-[8px] font-black text-gold whitespace-nowrap shadow-xl z-10">
                                 ₹{Math.round(p.estimatedValue / 100000)}L
                              </div>
                           </motion.div>
                           <span className="text-[9px] font-black text-text-tertiary opacity-40">{p.year}</span>
                        </div>
                     );
                  })}
               </div>
            </section>

            {/* Modular Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Asset Classes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('ASSET_CLASSES')}</h3>
                  <div className="text-[10px] font-bold text-text-tertiary opacity-60">{assetTypes.length} Active Classes</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                         className="bg-bg-primary border border-border-light rounded-[2.5rem] p-6 flex flex-col gap-4 group hover:border-gold/30 hover:shadow-xl transition-all cursor-pointer shadow-sm overflow-hidden relative"
                      >
                         <div className="flex justify-between items-start">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isProfit ? 'bg-bg-success border-text-success/10 text-text-success' : 'bg-bg-danger border-text-danger/10 text-text-danger'}`}>
                              {type.includes('Gold') ? <Coins size={28} /> : type.includes('PPF') ? <Landmark size={28} /> : type.includes('License') ? <FileText size={28} /> : <TrendingUp size={28} />}
                            </div>
                            <div className="text-right">
                               <div className={`flex items-center justify-end gap-1 text-[10px] font-black uppercase tracking-widest ${isProfit ? 'text-text-success' : 'text-text-danger'}`}>
                                  {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {gain}%
                               </div>
                               <div className="text-lg font-black text-text-primary mt-1">₹{typeValue.toLocaleString('en-IN')}</div>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-base font-black text-text-primary tracking-tight leading-tight mb-1">{type}</h4>
                            <div className="flex items-center justify-between text-[10px] text-text-tertiary font-black uppercase tracking-widest opacity-60">
                               <span>{typeHoldings.length} Holdings</span>
                               <span>₹{typePrincipal.toLocaleString('en-IN')} Cost</span>
                            </div>
                         </div>
                      </motion.div>
                     );
                   })}
                   
                   {assetTypes.length === 0 && (
                     <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-border-light rounded-[3rem]">
                        <Briefcase size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">{t('NO_INVESTMENTS')}</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Goals Context Sidebar */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] px-1">{lang === 'hi' ? 'Sankalp' : 'Active Goals'}</h3>
                <div className="space-y-4">
                  {goals.slice(0, 3).map(renderGoalCard)}
                  {goals.length > 3 && (
                    <button onClick={() => setView('goals')} className="w-full py-4 text-[10px] font-black text-gold uppercase tracking-widest hover:bg-gold/5 rounded-2xl transition-all">
                      Show all {goals.length} Goals
                    </button>
                  )}
                  {goals.length === 0 && (
                    <div className="p-8 text-center bg-bg-tertiary rounded-[2rem] border border-dashed border-border-light opacity-40">
                      <Target size={32} className="mx-auto mb-3" />
                      <p className="text-[9px] font-black uppercase tracking-widest">No goals set yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Goals Full View */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {goals.map(renderGoalCard)}
               <button onClick={() => setShowGoalModal(true)} className="bg-bg-tertiary border border-dashed border-border-light rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-gold/40 hover:bg-gold/5 transition-all group">
                 <div className="w-12 h-12 rounded-full border border-border-light flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all text-text-tertiary">
                   +
                 </div>
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] group-hover:text-gold transition-colors">Add New Goal</span>
               </button>
            </div>
          </div>
        )}

        {/* Goal Add Modal */}
        <AnimatePresence>
          {showGoalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-bg-primary border border-gold/30 rounded-[3rem] p-10 shadow-2xl w-full max-w-xl space-y-8">
                <div>
                  <h3 className="text-xl font-black text-text-primary tracking-tight">Define Wealth Goal</h3>
                  <p className="text-xs text-text-tertiary mt-2">Associate your investments with these goals to track progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Goal Name</label>
                    <input type="text" value={gName} onChange={e => setGName(e.target.value)} placeholder="e.g. New Home Fund"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:border-gold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Category</label>
                    <select value={gCategory} onChange={e => setGCategory(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold appearance-none">
                      <option>Education</option>
                      <option>Home</option>
                      <option>Marriage</option>
                      <option>Vehicle</option>
                      <option>Retirement</option>
                      <option>Travel</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Target Amount (₹)</label>
                    <input type="number" value={gTarget} onChange={e => setGTarget(e.target.value)} placeholder="50,00,000"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:border-gold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Deadline</label>
                    <input type="date" value={gDeadline} onChange={e => setGDeadline(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold focus:border-gold" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowGoalModal(false)} className="flex-1 h-14 bg-bg-tertiary text-text-tertiary font-black rounded-2xl text-[10px] uppercase tracking-widest">Cancel</button>
                  <button onClick={handleSaveGoal} disabled={!gName.trim() || !gTarget} className="flex-[2] h-14 bg-gold text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20">Set Goal</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        </motion.div>
        )}

        {/* --- Asset List View --- */}
        {view === 'asset-list' && (
          <motion.div key="asset-list" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {investments.filter(i => i.type === selectedType).map(h => {
                 const isProfit = h.current_value >= h.principal;
                 return (
                   <motion.div key={h.id} whileHover={{ y: -4 }} onClick={() => { setSelectedHold(h); setView('ledger'); }} className="bg-bg-primary border border-border-light rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                     {h.isLTCG && <div className="absolute top-6 right-6 text-text-success" title="LTCG Qualified"><ShieldCheck size={20} /></div>}
                     <h4 className="text-xl font-black text-text-primary tracking-tight mb-2 pr-8">{h.name}</h4>
                     
                     <div className="flex flex-wrap gap-2 mb-6">
                       <span className="text-[9px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2 py-1 rounded border border-gold/10">{h.cagr}% CAGR</span>
                       {h.units && <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest bg-bg-tertiary px-2 py-1 rounded border border-border-light">{h.units}</span>}
                       {h.goal_id && <span className="text-[9px] font-black text-text-primary uppercase tracking-widest bg-bg-success px-2 py-1 rounded border border-text-success/10 flex items-center gap-1"><Target size={10} /> Linked</span>}
                     </div>

                     <div className="grid grid-cols-2 gap-4 border-t border-border-light/30 pt-6">
                        <div>
                           <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Invested</div>
                           <div className="text-base font-bold text-text-secondary">₹{h.principal.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Current Value</div>
                           <div className={`text-xl font-black ${isProfit ? 'text-text-success' : 'text-text-danger'}`}>₹{h.current_value.toLocaleString('en-IN')}</div>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}
            </div>
          </motion.div>
        )}

        {/* --- Ledger View --- */}
        {view === 'ledger' && selectedHold && (
          <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-bg-primary border border-border-light rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-border-light bg-bg-tertiary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-black text-text-primary tracking-tighter">{selectedHold.name}</h3>
                    <button onClick={() => { if(confirm('Delete investment?')) { deleteInvestment(selectedHold.id); setView('asset-list'); } }} className="p-2 text-text-tertiary hover:text-text-danger transition-colors opacity-40 hover:opacity-100">
                      <Briefcase size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest bg-bg-primary px-3 py-1 rounded-full border border-border-light shadow-sm">{selectedHold.type}</span>
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><CalendarDays size={14} className="text-gold"/> Since {new Date(selectedHold.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Asset Value</div>
                   <div className="text-4xl font-black text-text-primary tracking-tighter">₹{selectedHold.current_value.toLocaleString('en-IN')}</div>
                   <div className={`text-[11px] font-black mt-1 uppercase ${selectedHold.current_value >= selectedHold.principal ? 'text-text-success' : 'text-text-danger'}`}>
                     {selectedHold.current_value >= selectedHold.principal ? '+' : ''}₹{(selectedHold.current_value - selectedHold.principal).toLocaleString()} ({((selectedHold.current_value - selectedHold.principal) / selectedHold.principal * 100).toFixed(1)}%)
                   </div>
                </div>
              </div>
            </div>
            
            {showTxModal && (
              <div className="p-10 bg-bg-secondary border-b border-border-light animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3">
                    <Coins size={16} className="text-gold" /> Add Transaction / Voucher
                  </h3>
                  <button onClick={() => setShowTxModal(false)} className="text-text-tertiary hover:text-text-danger font-bold text-lg">✕</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest text-gold">Type</label>
                    <select value={txType} onChange={e => setTxType(e.target.value as any)}
                      className="bg-bg-primary border border-border-light rounded-2xl p-4 text-sm font-bold appearance-none shadow-sm">
                      <option value="sip">SIP / Monthly Deposit</option>
                      <option value="lumpsum">One-time / Lumpsum</option>
                      <option value="valuation">Valuation Adjustment</option>
                      <option value="withdrawal">Withdrawal / Redemption</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest text-gold">{txType === 'valuation' ? 'Corrected Value' : 'Amount'}</label>
                    <input type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="₹"
                      className="bg-bg-primary border border-border-light rounded-2xl p-4 text-sm font-bold shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest text-gold">Date</label>
                    <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)}
                      className="bg-bg-primary border border-border-light rounded-2xl p-4 text-sm font-bold shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest text-gold">Notes</label>
                    <input type="text" value={txNotes} onChange={e => setTxNotes(e.target.value)} placeholder="Notes..."
                      className="bg-bg-primary border border-border-light rounded-2xl p-4 text-sm font-bold shadow-sm" />
                  </div>
                </div>
                <button onClick={handleSaveTransaction} disabled={!txAmount}
                  className="w-full bg-gold-text text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-gold/10 flex items-center justify-center gap-3">
                  <FileText size={16} /> SEAL TO LEDGER
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-border-light bg-bg-primary">
                        <th className="p-8 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('COL_DATE')}</th>
                        <th className="p-8 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('COL_PARTICULARS')}</th>
                        <th className="p-8 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] text-right">{t('COL_TYPE')}</th>
                        <th className="p-8 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] text-right">{t('COL_AMOUNT')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light/40">
                     {getTransactions(selectedHold.id).length > 0 ? getTransactions(selectedHold.id).map((row, i) => (
                       <tr key={String(row.id)} className="hover:bg-bg-tertiary transition-colors group">
                          <td className="p-8 text-xs font-bold text-text-secondary">{new Date(row.date).toLocaleDateString('en-IN')}</td>
                          <td className="p-8">
                             <div className="flex items-center gap-4">
                                <FileText size={18} className="text-text-tertiary group-hover:text-gold transition-colors" />
                                <div>
                                   <div className="text-sm font-black text-text-primary tracking-tight">{row.notes || (row.type === 'sip' ? 'Systematic Investment' : 'Ledger Entry')}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${row.type === 'withdrawal' ? 'text-text-danger border-text-danger/10 bg-bg-danger' : 'text-text-success border-text-success/10 bg-bg-success'}`}>
                                {row.type}
                             </span>
                          </td>
                          <td className={`p-8 text-base font-black text-right ${row.type === 'withdrawal' ? 'text-text-danger' : 'text-text-success'}`}>
                            {row.type === 'withdrawal' ? '-' : '+'}₹{Number(row.amount).toLocaleString('en-IN')}
                          </td>
                       </tr>
                     )) : (
                       <tr><td colSpan={4} className="p-24 text-center text-[11px] font-black text-text-tertiary uppercase tracking-widest opacity-60">No transactions recorded</td></tr>
                     )}
                  </tbody>
               </table>
               
               <div onClick={() => setShowTxModal(true)} className="p-12 text-center text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] flex flex-col items-center gap-4 hover:text-gold cursor-pointer bg-bg-tertiary/30">
                 <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-light flex items-center justify-center text-xl">+</div>
                 Record New Movement
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModuleShell>
  );
}
