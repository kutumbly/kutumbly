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

import React, { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useCash } from '@/modules/money';
import { useFamily } from '@/modules/family';
import ModuleShell from './ModuleShell';
import { useTranslation } from '@/lib/i18n';
import MetricCard from '../ui/MetricCard';
import DonutChart from '../ui/DonutChart';
import { ShoppingCart, Home, Briefcase, Coffee, MoreHorizontal, ArrowDownLeft, ArrowUpRight, IndianRupee, Users, Book, ArrowLeft, Trash2, Shield, CalendarDays, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/types/db';

type MoneyView = 'overview' | 'category-ledger' | 'voucher-view';

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Grocery', 'Utilities', 'Food', 'Staff', 'Housing', 'Education', 'Health', 'Other'];

const CATEGORY_ICONS: Record<string, any> = {
  'Grocery': ShoppingCart,
  'Salary': Briefcase,
  'Utilities': Home,
  'Food': Coffee,
  'Staff': Users,
  'Housing': Home,
  'Education': Book,
  'Grains': ShoppingCart,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Salary': 'var(--text-success)',
  'Grocery': 'var(--gold)',
  'Utilities': 'var(--text-info)',
  'Housing': '#6366F1',
  'Staff': '#EC4899',
  'Other': 'var(--text-tertiary)',
};

export default function CashModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const { txns, budgets, summary, addTransaction, deleteTransaction, setCategoryBudget, editTransaction } = useCash();
  const { familyMembers: members } = useFamily();

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Drill-Down States
  const [view, setView] = useState<MoneyView>('overview');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  // Form State
  const [fType, setFType] = useState<'income' | 'expense'>('expense');
  const [fAmount, setFAmount] = useState('');
  const [fCategory, setFCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [fDesc, setFDesc] = useState('');
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);
  const [fMember, setFMember] = useState<string>('');

  const handleSave = () => {
    if (!fAmount || !fDesc || !fCategory) return;
    
    // Strict numeric validation parsing to drop NaN anomalies
    const validatedAmount = Math.max(0, Number(fAmount));

    if (isEditing && activeVoucher) {
       editTransaction(String(activeVoucher.id), {
         type: fType,
         amount: validatedAmount,
         category: fCategory,
         description: fDesc,
         date: fDate,
         member_id: fMember || null
       });
       setIsEditing(false);
    } else {
       addTransaction({
         type: fType,
         amount: validatedAmount,
         category: fCategory,
         description: fDesc,
         date: fDate,
         member_id: fMember || null
       });
    }

    setShowAddForm(false);
    setFAmount('');
    setFDesc('');
    setFMember('');
    setActiveVoucher(null);
  };

  // 1. Prepare Donut Data
  const donutData = useMemo(() => {
    const expenseTxns = txns.filter(t => t.type === 'expense');
    const cats: Record<string, number> = {};
    expenseTxns.forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    
    return Object.entries(cats).map(([label, value]) => ({
      label,
      value,
      color: CATEGORY_COLORS[label] || CATEGORY_COLORS['Other']
    })).sort((a, b) => b.value - a.value);
  }, [txns]);

  const filteredTxns = txns.filter(t => 
    filter === 'all' ? true : t.type === filter
  );

  const getBreadcrumbs = () => {
    const b = [t('MONEY')];
    if (view === 'category-ledger' || view === 'voucher-view') b.push(activeCategory || '');
    if (view === 'voucher-view') b.push("Voucher");
    return b;
  };

  const handleBack = () => {
    if (view === 'voucher-view') setView('category-ledger');
    else if (view === 'category-ledger') setView('overview');
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? t('MONEY') :
        view === 'category-ledger' ? `${t('MONEY')} - ${activeCategory}` :
        t('MONEY')
      }
      subtitle={view === 'overview' ? t('MONEY_SUBTITLE') : undefined}
      onAdd={showAddForm || view === 'voucher-view' ? undefined : () => setShowAddForm(true)}
      addLabel={view === 'overview' ? t('MONEY_INCOME') : undefined}
      breadcrumbs={view !== 'overview' && !showAddForm ? getBreadcrumbs() : undefined}
      onBack={showAddForm ? () => { setShowAddForm(false); setIsEditing(false); } : (view !== 'overview' ? handleBack : undefined)}
    >
      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => { setShowAddForm(false); setIsEditing(false); }} className="w-10 h-10 rounded-full bg-bg-primary border border-border-light flex items-center justify-center hover:text-gold transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {isEditing ? "Edit Voucher Details" : t('MONEY_INCOME')}
            </h2>
          </div>
          
          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl shadow-black/[0.02]">
            <div className="flex bg-bg-tertiary p-1.5 rounded-2xl border border-border-light">
              {(['expense', 'income'] as const).map(t_type => (
                <button
                  key={t_type}
                  onClick={() => { setFType(t_type); setFCategory(t_type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${fType === t_type ? (t_type === 'income' ? 'bg-success text-white shadow-md' : 'bg-red-500 text-white shadow-md') : 'text-text-tertiary hover:text-text-primary'}`}
                >
                  {t_type === 'income' ? t('MONEY_INCOME') : t('MONEY_EXPENSE')}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('AMOUNT_LABEL')}</label>
              <input type="number" value={fAmount} onChange={e => setFAmount(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="₹0.00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('CATEGORY_LABEL')}</label>
              <div className="flex flex-wrap gap-2">
                {(fType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <button key={c} onClick={() => setFCategory(c)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fCategory === c ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('DESC_LABEL')}</label>
              <input type="text" value={fDesc} onChange={e => setFDesc(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('DESC_PH')} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">TAG FAMILY MEMBER</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFMember('')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${!fMember ? 'bg-bg-tertiary text-gold-text border-gold/30 shadow-sm' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}>General</button>
                {members.map(m => (
                  <button key={m.id} onClick={() => setFMember(m.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${fMember === m.id ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}>{m.name}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={!fAmount || !fDesc || !fCategory} className="w-full mt-4 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <Shield size={20} />
              {t('SAVE_TO_VAULT')}
            </button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
        {view === 'overview' && !showAddForm && (
        <motion.div 
           key="overview"
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           className="space-y-8 md:space-y-12"
        >
        
        {/* Top Stats Dashboard */}
        {/* ── Top Dashboard Section ────────────────────────────────── */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
           {/* Left: 2x2 Primary Metrics */}
           <div className="grid grid-cols-2 gap-4">
             <MetricCard label={t('MONEY_BALANCE')} value={summary.balance} isCurrency status="default" trend={[15000, 20000, 18000, 25000, summary.balance]} />
             <MetricCard label={t('MONEY_INCOME')} value={summary.income} isCurrency status="success" />
             <MetricCard label={t('MONEY_EXPENSE')} value={summary.expense} isCurrency status="danger" trend={[5000, 12000, 8000, 15000, summary.expense]} />
             <div className="bg-bg-primary rounded-[1.8rem] border border-border-light p-5 flex flex-col justify-between shadow-xl shadow-black/[0.02]">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] leading-tight">Savings Rate</span>
                 <span className="text-sm font-black text-text-success tabular-nums">{summary.income > 0 ? (((summary.income - summary.expense) / summary.income) * 100).toFixed(0) : 0}%</span>
               </div>
               <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(100, summary.income > 0 ? ((summary.income - summary.expense) / summary.income) * 100 : 0)}%` }}
                   className="h-full bg-success rounded-full"
                 />
               </div>
             </div>
           </div>
           
           {/* Right: Spending Profile (Donut Chart) */}
           <div className="bg-bg-primary rounded-[2.5rem] p-7 flex flex-col items-center justify-center border border-border-light shadow-xl shadow-black/[0.02]">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-7 text-text-tertiary">{t('EXPENSE_PROFILE')}</div>
              <DonutChart data={donutData.length > 0 ? donutData : [{ label: 'Empty', value: 1, color: 'var(--bg-tertiary)' }]} size={160} thickness={18} />
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                 {donutData.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-tertiary border border-border-light">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                       <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{d.label}</span>
                    </div>
                 ))}
              </div>
           </div>
         </div>

         {/* ── Middle Dashboard Section: Budgets & Actions ─────────── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Budget Tracking */}
           <section className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-2">
               <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Monthly Budget Status</div>
               <button 
                 onClick={() => {
                   const cat = window.prompt("Enter Category (e.g., Grocery):");
                   if (!cat) return;
                   const amt = window.prompt("Enter Monthly Limit (₹):");
                   if (!amt) return;
                   setCategoryBudget(cat, Number(amt));
                 }}
                 className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline"
               >
                 + Define Budget
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.length > 0 ? budgets.map((b) => {
                  const spent = txns.filter(t => t.category === b.category && t.type === 'expense').reduce((s, curr) => s + curr.amount, 0);
                  const perc = Math.min(100, (spent / b.monthly_limit) * 100);
                  return (
                    <div key={b.id} className="bg-bg-primary border border-border-light p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-black text-text-primary uppercase tracking-wider">{b.category}</span>
                         <span className="text-[9px] font-bold text-text-tertiary tabular-nums">₹{spent} / ₹{b.monthly_limit}</span>
                       </div>
                       <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-500 rounded-full ${perc > 90 ? 'bg-red-500' : perc > 70 ? 'bg-orange-400' : 'bg-gold'}`} style={{ width: `${perc}%` }} />
                       </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full py-12 text-center bg-bg-primary border border-border-light border-dashed rounded-[2rem] opacity-40">
                     <p className="text-[10px] font-black uppercase tracking-widest">No active budgets found in this vault</p>
                  </div>
                )}
             </div>
           </section>

           {/* Quick Actions Sidebar */}
           <div className="space-y-4">
             <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">Sovereign Treasury</div>
             
             <button
               onClick={() => setShowAddForm(true)}
               className="w-full p-5 bg-gold-text text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-95 transition-all shadow-xl shadow-gold/10"
             >
               <IndianRupee size={18} /> {t('MONEY_INCOME')}
             </button>

             <div className="bg-bg-primary border border-border-light rounded-[2rem] p-6 space-y-4 shadow-xl shadow-black/[0.01]">
               <div className="flex items-center justify-between">
                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Efficiency Rate</span>
                 <span className="text-[10px] font-black text-text-tertiary">HIGH</span>
               </div>
               <div className="w-full bg-bg-tertiary h-1 rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-gold" />
               </div>
               <p className="text-[10px] font-medium text-text-secondary leading-relaxed opacity-80 italic">"Your cash liquidity is high. Consider moving to Sovereign Invest for better yields."</p>
             </div>
           </div>
         </div>

         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donutData.map((d, i) => {
              const Icon = CATEGORY_ICONS[d.label] || MoreHorizontal;
              return (
                <motion.div 
                  key={i}
                  whileHover={{ y: -2 }}
                  onClick={() => { setActiveCategory(d.label); setView('category-ledger'); }}
                  className="card p-5 flex items-center justify-between cursor-pointer group hover:border-gold/30 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl flex items-center justify-center opacity-80 transition-all border border-border-light group-hover:scale-105" style={{ backgroundColor: `${d.color}15`, color: d.color }}>
                        <Icon size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-text-primary">{d.label}</h4>
                        <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">{t('EXPENSES_LABEL')}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-black text-text-primary">
                        ₹{d.value.toLocaleString()}
                     </div>
                  </div>
                </motion.div>
              );
            })}
         </div>

         {/* Transaction Ledger */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                 {t('FAMILY_LEDGER')}
              </div>
              <div className="flex bg-bg-primary p-1 rounded-xl border border-border-light shadow-sm">
                 {(['all', 'income', 'expense'] as const).map(f => (
                   <button 
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg transition-all ${filter === f ? 'bg-gold-text text-white shadow-md' : 'text-text-tertiary hover:text-text-primary'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              {filteredTxns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTxns.slice(0, 5).map((t, idx) => {
                    const Icon = CATEGORY_ICONS[String(t.category)] || MoreHorizontal;
                    const isIncome = t.type === 'income';
                    return (
                      <motion.div 
                        onClick={() => { setActiveVoucher(t); setActiveCategory(t.category); setView('voucher-view'); }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={String(t.id)} 
                        className="bg-bg-primary border border-border-light rounded-[2rem] p-5 flex items-center gap-5 group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] cursor-pointer transition-all"
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${isIncome ? 'bg-success/5 border-success/20 text-success' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                           {isIncome ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <h4 className="text-base font-black text-text-primary tracking-tight leading-none truncate max-w-[200px] md:max-w-md">{String(t.description)}</h4>
                              <span className={`text-xl font-black tabular-nums tracking-tighter ${isIncome ? 'text-success' : 'text-red-500'}`}>
                                 {isIncome ? '+' : '-'}₹{Math.abs(Number(t.amount)).toLocaleString('en-IN')}
                              </span>
                           </div>
                           <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                   <Icon size={14} className="text-text-tertiary" />
                                   <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                                      {String(t.category)}
                                   </span>
                                </div>
                                {t.member_id && (
                                  <>
                                    <span className="text-[10px] font-black text-text-tertiary opacity-40">·</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full bg-gold-light flex items-center justify-center text-[7px] font-black text-gold-text border border-gold/20">
                                         {members.find(m => m.id === t.member_id)?.avatar_initials || '?'}
                                      </div>
                                      <span className="text-[9px] font-black text-text-tertiary uppercase tracking-wider">{members.find(m => m.id === t.member_id)?.name}</span>
                                    </div>
                                  </>
                                )}
                                <span className="text-[10px] font-black text-text-tertiary opacity-40">·</span>
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                   {new Date(String(t.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-bg-primary border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                      <IndianRupee size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="font-black uppercase tracking-[0.4em] text-[10px]">{t('LEDGER_EMPTY')}</p>
                </div>
              )}
           </div>
        </div>
       </motion.div>
      )}

      {/* Level 2: Category Ledger Drill Down */}
      {view === 'category-ledger' && !showAddForm && (
        <motion.div
           key="category-ledger"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-4"
        >
          {txns.filter(t => t.category === activeCategory).map((t, idx) => {
            const isIncome = t.type === 'income';
            return (
              <motion.div 
                onClick={() => { setActiveVoucher(t); setView('voucher-view'); }}
                key={String(t.id)} 
                className="bg-bg-primary border border-border-light rounded-[2rem] p-5 flex items-center gap-5 group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] cursor-pointer transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${isIncome ? 'bg-success/5 border-success/20 text-success' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                   {isIncome ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h4 className="text-base font-black text-text-primary tracking-tight leading-none">{String(t.description)}</h4>
                      <span className={`text-xl font-black tabular-nums tracking-tighter ${isIncome ? 'text-success' : 'text-red-500'}`}>
                         {isIncome ? '+' : '-'}₹{Math.abs(Number(t.amount)).toLocaleString('en-IN')}
                      </span>
                   </div>
                   <div className="flex items-center gap-4 mt-2.5">
                      <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                         {new Date(String(t.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year:'numeric' })}
                      </span>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Level 3: Individual Voucher View Placeholder */}
      {view === 'voucher-view' && activeVoucher && !showAddForm && (
        <motion.div
           key="voucher-view"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="bg-bg-primary border border-border-light rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/[0.02] max-w-2xl mx-auto"
        >
          <div className="p-10 text-center border-b border-border-light bg-bg-tertiary relative">
            <div className={`absolute top-0 left-0 w-full h-1 ${activeVoucher.type === 'income' ? 'bg-success' : 'bg-red-500'}`}></div>
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border-2 mb-6 ${activeVoucher.type === 'income' ? 'bg-success/5 border-success/20 text-success' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
               <Receipt size={36} />
            </div>
            
            <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-3">VOUCHER No. {activeVoucher.id}</h3>
            <h2 className="text-4xl font-black text-text-primary tracking-tighter mb-2">₹{activeVoucher.amount.toLocaleString('en-IN')}</h2>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">
               <span>{activeVoucher.category}</span>
               <span>•</span>
               <span>{new Date(String(activeVoucher.date)).toDateString()}</span>
            </div>
          </div>
          
          <div className="p-10 space-y-8">
             <div>
                <label className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em]">{t('NARRATION_LABEL')}</label>
                <div className="mt-2 text-base font-bold text-text-secondary p-4 bg-bg-tertiary rounded-2xl border border-border-light">
                   {activeVoucher.description}
                </div>
             </div>
             
             <div className="flex gap-4">
                <button 
                  onClick={() => {
                     deleteTransaction(String(activeVoucher.id));
                     setView('category-ledger');
                  }}
                  className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border-2 border-red-500/20 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all focus:outline-none"
                >
                   <Trash2 size={16} /> Delete Voucher
                </button>
                 <button 
                  onClick={() => {
                     setFType(activeVoucher.type as 'income' | 'expense');
                     setFAmount(String(activeVoucher.amount));
                     setFCategory(activeVoucher.category);
                     setFDesc(activeVoucher.description);
                     setFDate(String(activeVoucher.date));
                     setFMember(activeVoucher.member_id || '');
                     setIsEditing(true);
                     setShowAddForm(true);
                  }}
                  className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border border-border-light text-text-primary font-black text-[11px] uppercase tracking-widest hover:bg-bg-tertiary transition-all"
                >
                   Edit Voucher
                </button>
             </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      )}
    </ModuleShell>
  );
}
