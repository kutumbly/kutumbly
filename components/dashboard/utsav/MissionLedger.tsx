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

import React, { useState, useMemo } from 'react';
import { useUtsavEngine } from '@/modules/utsav';
import { UtsavEvent, UtsavLedgerEntry } from '@/types/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Minus, History, 
  TrendingUp, TrendingDown, Info, Save, X 
} from 'lucide-react';
import RupeesDisplay from '../../ui/RupeesDisplay';

interface MissionLedgerProps {
  event: UtsavEvent;
}

export default function MissionLedger({ event }: MissionLedgerProps) {
  const { missionLedger, addLedgerEntry, suggestParampara } = useUtsavEngine(event.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Entry State
  const [formData, setFormData] = useState({
    family_name: '',
    amount: '',
    direction: 'mila' as 'mila' | 'diya',
    notes: ''
  });

  const filteredLedger = useMemo(() => {
    return missionLedger.filter(l => 
      l.family_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [missionLedger, searchTerm]);

  const stats = useMemo(() => {
    const totalMila = missionLedger.reduce((acc, l) => acc + (l.mila || 0), 0);
    const totalDiya = missionLedger.reduce((acc, l) => acc + (l.diya || 0), 0);
    return { totalMila, totalDiya, net: totalMila - totalDiya };
  }, [missionLedger]);

  const handleAddEntry = () => {
    if (!formData.family_name || !formData.amount) return;
    addLedgerEntry({
      family_name: formData.family_name,
      amount: Number(formData.amount),
      direction: formData.direction,
      notes: formData.notes
    });
    setFormData({ family_name: '', amount: '', direction: 'mila', notes: '' });
    setShowAddModal(false);
  };

  const suggestion = useMemo(() => {
    if (formData.family_name.length > 2) {
      return suggestParampara(formData.family_name);
    }
    return 0;
  }, [formData.family_name, suggestParampara]);

  return (
    <div className="space-y-8 pb-32">
      {/* 1. Statistics Ribbon */}
      {/* 1. Statistics Ribbon (Premium Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-text-success/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-text-success/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-text-success/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Total Mila (Received)</p>
              <h3 className="text-3xl font-black text-text-success tabular-nums tracking-tighter"><RupeesDisplay amount={stats.totalMila} /></h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-text-success/5 border border-text-success/10 flex items-center justify-center text-text-success shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
           </div>
        </div>

        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-text-danger/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-text-danger/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-text-danger/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Total Diya (Given)</p>
              <h3 className="text-3xl font-black text-text-danger tabular-nums tracking-tighter"><RupeesDisplay amount={stats.totalDiya} /></h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-text-danger/5 border border-text-danger/10 flex items-center justify-center text-text-danger shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <TrendingDown size={28} />
           </div>
        </div>

        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-gold/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Mission Balance</p>
              <h3 className="text-3xl font-black text-gold tabular-nums tracking-tighter"><RupeesDisplay amount={stats.net} /></h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <History size={28} />
           </div>
        </div>
      </div>

      {/* 2. Management Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search Family / Registry Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 bg-bg-primary border border-border-light rounded-[1.5rem] pl-16 pr-6 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50 shadow-lg transition-all"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="h-16 px-10 bg-gold-text text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          Lekha-Jokha Darj Karein
        </button>
      </div>

      {/* 3. Ledger Grid (Premium Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredLedger.map((l, i) => (
            <motion.div 
              key={l.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 group hover:border-gold/30 hover:shadow-2xl transition-all relative overflow-hidden card-lift"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-gold/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                    <h4 className="text-base font-black text-text-primary mb-1 group-hover:text-gold transition-colors">{l.family_name}</h4>
                    <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] opacity-60">
                      Authorized: {new Date(l.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                 </div>
                 <div className={`text-xl font-black tabular-nums tracking-tighter ${l.net >= 0 ? 'text-text-success' : 'text-text-danger'}`}>
                    {l.net > 0 ? '+' : ''}<RupeesDisplay amount={l.net} />
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center p-3 bg-bg-tertiary rounded-xl border border-border-light/50">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Diya (Given)</span>
                    <span className="text-[11px] font-black text-text-danger tabular-nums tracking-tight"><RupeesDisplay amount={l.diya} /></span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-bg-tertiary rounded-xl border border-border-light/50">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Mila (Received)</span>
                    <span className="text-[11px] font-black text-text-success tabular-nums tracking-tight"><RupeesDisplay amount={l.mila} /></span>
                 </div>
                 {l.notes && (
                   <div className="mt-6 p-4 bg-gold/5 border border-gold/10 rounded-2xl text-[11px] font-medium leading-relaxed text-text-secondary">
                      <span className="text-gold mr-1">“</span>{l.notes}<span className="text-gold ml-1">”</span>
                   </div>
                 )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Hisaab Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-bg-primary border border-border-light rounded-[3rem] shadow-2xl p-10"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-text-tertiary hover:text-text-primary">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-text-primary tracking-tight mb-8">Pavitra Lekha-Jokha</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Family / Recipient Name</label>
                  <input 
                    type="text"
                    value={formData.family_name}
                    onChange={(e) => setFormData({...formData, family_name: e.target.value})}
                    placeholder="Enter family name..."
                    className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50"
                  />
                  {suggestion > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-gold/5 border border-gold/20 rounded-xl flex items-center gap-2">
                       <Info size={14} className="text-gold" />
                       <p className="text-[10px] font-bold text-gold uppercase tracking-tighter">
                          Paramparik Shagun: <RupeesDisplay amount={suggestion} /> (Based on history)
                       </p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Amount (₹)</label>
                    <input 
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="501"
                      className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Direction</label>
                    <div className="flex bg-bg-secondary rounded-2xl border border-border-light p-1 h-[62px]">
                      <button 
                         onClick={() => setFormData({...formData, direction: 'mila'})}
                         className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.direction === 'mila' ? 'bg-bg-success text-white shadow-lg' : 'text-text-tertiary'}`}
                      >
                         Mila
                      </button>
                      <button 
                         onClick={() => setFormData({...formData, direction: 'diya'})}
                         className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.direction === 'diya' ? 'bg-bg-danger text-white shadow-lg' : 'text-text-tertiary'}`}
                      >
                         Diya
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Notes (Optional)</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="E.g., Sagon with Kanyadan..."
                    className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50 h-24 resize-none"
                  />
                </div>

                <button 
                  onClick={handleAddEntry}
                  className="w-full py-6 bg-gold-text text-white font-black rounded-3xl text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  Authorize Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
