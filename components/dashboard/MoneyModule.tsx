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

import React, { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useMoney } from '@/hooks/useMoney';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import DonutChart from '../ui/DonutChart';
import { ShoppingCart, Home, Briefcase, Coffee, MoreHorizontal, ArrowDownLeft, ArrowUpRight, IndianRupee, Users, Book, ArrowLeft, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function MoneyModule() {
  const { lang } = useAppStore();
  const { txns, summary, addTransaction, deleteTransaction } = useMoney();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [fType, setFType] = useState<'income' | 'expense'>('expense');
  const [fAmount, setFAmount] = useState('');
  const [fCategory, setFCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [fDesc, setFDesc] = useState('');
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!fAmount || !fDesc || !fCategory) return;
    addTransaction(fType, Number(fAmount), fCategory, fDesc, fDate);
    setShowAddForm(false);
    setFAmount('');
    setFDesc('');
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

  return (
    <ModuleShell 
      title={lang === 'en' ? "Family Money" : "Parivar ki Unnati"}
      subtitle={lang === 'en' ? "Tracking every rupee for the future" : "Bachat hi asli kamayi hai"}
      onAdd={showAddForm ? undefined : () => setShowAddForm(true)}
      addLabel={lang === 'en' ? "Add Entry" : "Khata Likho"}
    >
      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center hover:text-gold transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {lang === 'hi' ? 'Nayi Entry Karein' : 'New Entry'}
            </h2>
          </div>
          
          <div className="bg-white border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl shadow-black/[0.02]">
            <div className="flex bg-[#FAF9F6] p-1.5 rounded-2xl border border-border-light">
              {(['expense', 'income'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setFType(t); setFCategory(t === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${fType === t ? (t === 'income' ? 'bg-success text-white shadow-md' : 'bg-red-500 text-white shadow-md') : 'text-text-tertiary hover:text-text-primary'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'RAKAM' : 'AMOUNT (₹)'}</label>
              <input type="number" value={fAmount} onChange={e => setFAmount(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="₹0.00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'VARG' : 'CATEGORY'}</label>
              <div className="flex flex-wrap gap-2">
                {(fType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <button key={c} onClick={() => setFCategory(c)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fCategory === c ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-white text-text-tertiary border-border-light hover:border-gold/30'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'VIVARAN' : 'DESCRIPTION'}</label>
              <input type="text" value={fDesc} onChange={e => setFDesc(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={lang === 'hi' ? 'Kahan kharch kiya...' : 'Where did it go?...'} />
            </div>

            <button onClick={handleSave} disabled={!fAmount || !fDesc || !fCategory} className="w-full mt-4 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <Shield size={20} />
              {lang === 'hi' ? 'SURAKSHIT KAREN' : 'SAVE TO VAULT'}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8 md:space-y-12">
        
        {/* Top Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <MetricCard label={lang === 'hi' ? 'KUL JAMA' : 'Total Balance'} value={summary.balance} isCurrency status="default" trend={[15000, 20000, 18000, 25000, summary.balance]} />
              <MetricCard label={lang === 'hi' ? 'AYE' : 'Income'} value={summary.income} isCurrency status="success" />
              <MetricCard label={lang === 'hi' ? 'KHARCHA' : 'Expenses'} value={summary.expense} isCurrency status="danger" trend={[5000, 12000, 8000, 15000, summary.expense]} />
              <MetricCard label="Efficiency" value={summary.income > 0 ? ((summary.balance / summary.income) * 100).toFixed(0) : 0} unit="%" status="info" />
           </div>
           
           <div className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center justify-center border border-border-light shadow-xl shadow-black/[0.02]">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-text-tertiary">Expense Profile</div>
              <DonutChart data={donutData.length > 0 ? donutData : [{ label: 'Empty', value: 1, color: 'var(--bg-tertiary)' }]} size={160} thickness={18} />
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                 {donutData.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-border-light">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                       <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{d.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Transaction Ledger */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                 Family Ledger
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-border-light shadow-sm">
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
                  {filteredTxns.map((t, idx) => {
                    const Icon = CATEGORY_ICONS[String(t.category)] || MoreHorizontal;
                    const isIncome = t.type === 'income';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={String(t.id)} 
                        className="bg-white border border-border-light rounded-[2rem] p-5 flex items-center gap-5 group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all"
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
                           <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                   <Icon size={14} className="text-text-tertiary" />
                                   <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                                      {String(t.category)}
                                   </span>
                                </div>
                                <span className="text-[10px] font-black text-text-tertiary opacity-40">·</span>
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                   {new Date(String(t.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <button 
                                onClick={() => deleteTransaction(String(t.id))}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                      <IndianRupee size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="font-black uppercase tracking-[0.4em] text-[10px]">Vault Ledger Empty</p>
                </div>
              )}
           </div>
        </div>
       </div>
      )}
    </ModuleShell>
  );
}
