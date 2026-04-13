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
import { ShoppingCart, Home, Briefcase, Coffee, MoreHorizontal, ArrowDownLeft, ArrowUpRight, IndianRupee, Users, Book, ArrowLeft, Trash2 } from 'lucide-react';

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
      title={lang === 'en' ? "Family Money" : "Paisa-Paisa"}
      subtitle={lang === 'en' ? "Tracking every rupee for the future" : "Bachat hi asli kamayi hai"}
      onAdd={showAddForm ? undefined : () => setShowAddForm(true)}
      addLabel={lang === 'en' ? "Log Expense" : "Kharcha Likho"}
    >
      {showAddForm ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full bg-bg-secondary hover:bg-gold/10">
              <ArrowLeft className="w-5 h-5 text-text-tertiary" />
            </button>
            <h2 className="text-xl font-bold text-text-primary">
              {lang === 'hi' ? 'Naya Khata Likho' : 'Log Transaction'}
            </h2>
          </div>
          
          <div className="card p-6 flex flex-col gap-5">
            <div className="flex bg-bg-secondary p-1 rounded-xl border border-border-light">
              {(['expense', 'income'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setFType(t); setFCategory(t === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }}
                  className={`flex-1 p-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${fType === t ? (t === 'income' ? 'bg-bg-success text-text-success shadow-sm' : 'bg-bg-danger text-text-danger shadow-sm') : 'text-text-tertiary hover:text-text-primary'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Rakam (Amount)' : 'Amount (₹)'}</label>
              <input type="number" value={fAmount} onChange={e => setFAmount(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="₹0.00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Varg (Category)' : 'Category'}</label>
              <div className="flex flex-wrap gap-2">
                {(fType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <button key={c} onClick={() => setFCategory(c)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${fCategory === c ? 'bg-gold/10 text-gold border-gold/30' : 'bg-bg-secondary text-text-tertiary border-border-light'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Vivaran (Description)' : 'Description'}</label>
              <input type="text" value={fDesc} onChange={e => setFDesc(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder={lang === 'hi' ? 'Ration ka bill...' : 'Grocery bill...'} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Taareekh (Date)' : 'Date'}</label>
              <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" />
            </div>

            <button onClick={handleSave} disabled={!fAmount || !fDesc || !fCategory} className="w-full mt-4 bg-gold hover:opacity-90 text-white font-bold h-14 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {lang === 'hi' ? 'Save Karein' : 'Save Transaction'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
        
        {/* Top Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <MetricCard label="Total Balance" value={summary.balance} isCurrency status="default" trend={[15000, 20000, 18000, 25000, summary.balance]} />
              <MetricCard label="Monthly Income" value={summary.income} isCurrency status="success" />
              <MetricCard label="Monthly Expenses" value={summary.expense} isCurrency status="danger" trend={[5000, 12000, 8000, 15000, summary.expense]} />
              <MetricCard label="Savings Rate" value={summary.income > 0 ? ((summary.balance / summary.income) * 100).toFixed(0) : 0} unit="%" status="info" />
           </div>
           
           <div className="card p-6 flex flex-col items-center justify-center bg-bg-primary/50 border-dashed border-2 border-border-light">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-text-tertiary">Expense Split</div>
              <DonutChart data={donutData.length > 0 ? donutData : [{ label: 'Empty', value: 1, color: 'var(--bg-tertiary)' }]} size={140} thickness={16} />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                 {donutData.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                       <span className="text-[9px] font-bold text-text-tertiary uppercase">{d.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Transaction Ledger */}
        <div>
           <div className="flex items-center justify-between mb-6 px-1">
              <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                 Sovereign Ledger
              </div>
              <div className="flex bg-bg-secondary p-1 rounded-lg border border-border-light">
                 {(['all', 'income', 'expense'] as const).map(f => (
                   <button 
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-md transition-all ${filter === f ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>
           </div>

           <div className="card divide-y divide-border-light/30">
              {filteredTxns.length > 0 ? filteredTxns.map((t) => {
                const Icon = CATEGORY_ICONS[String(t.category)] || MoreHorizontal;
                const isIncome = t.type === 'income';
                return (
                  <div key={String(t.id)} className="py-5 px-5 flex items-center gap-5 group hover:bg-bg-secondary transition-all">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-105 ${isIncome ? 'bg-bg-success border-text-success/10 text-text-success' : 'bg-bg-danger border-text-danger/10 text-text-danger'}`}>
                       {isIncome ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-text-primary tracking-tight">{String(t.description)}</h4>
                          <span className={`text-base font-black tabular-nums tracking-tighter ${isIncome ? 'text-text-success' : 'text-text-danger'}`}>
                             {isIncome ? '+' : '-'}₹{Math.abs(Number(t.amount)).toLocaleString('en-IN')}
                          </span>
                       </div>
                       <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                               <Icon size={12} className="text-text-tertiary" />
                               <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                  {String(t.category)}
                               </span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-border-medium"></span>
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                               {new Date(String(t.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US')}
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteTransaction(String(t.id))}
                            className="p-1.5 rounded-md text-border-medium hover:bg-bg-danger hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-24 flex flex-col items-center justify-center opacity-30">
                   <IndianRupee className="w-20 h-20 mb-4" strokeWidth={1} />
                   <p className="font-black uppercase tracking-[0.3em] text-[10px]">No transaction history</p>
                </div>
              )}
            </div>
         </div>
       </div>
      )}
    </ModuleShell>
  );
}
