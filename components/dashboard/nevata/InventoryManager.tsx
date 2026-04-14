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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useNevataEngine } from '@/hooks/useNevataEngine';
import { useVault } from '@/hooks/useVault';
import { NevataEvent, NevataInventoryItem } from '@/types/db';

interface InventoryManagerProps {
  event: NevataEvent;
}

const CAT_COLORS: Record<string, string> = {
  'Catering': '#f59e0b',
  'Decor': '#ec4899',
  'Logistics': '#3b82f6',
  'Gift': '#10b981'
};

export default function InventoryManager({ event }: InventoryManagerProps) {
  const { inventory, addInventoryItem, updateInventoryStatus } = useNevataEngine(event.id);
  const { getFamilyMembers } = useVault();
  const family = getFamilyMembers();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ORDERED' | 'DISPATCHED' | 'RECEIVED' | 'RETURNED'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State
  const [inName, setInName] = useState('');
  const [inCat, setInCat] = useState('Catering');
  const [inQty, setInQty] = useState(1);
  const [inAssign, setInAssign] = useState(family?.[0]?.name || '');

  const filtered = inventory.filter(i => {
    const sMatch = searchTerm === '' || i.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const fMatch = filter === 'ALL' || i.status === filter;
    return sMatch && fMatch;
  });

  const handleAddItem = () => {
    if (!inName.trim()) return;
    addInventoryItem({
      item_name: inName,
      category: inCat,
      quantity_expected: inQty,
      quantity_received: 0,
      quantity_used: 0,
      unit: 'pcs',
      vendor_id: null,
      assigned_to_id: inAssign,
      backup_person_id: null,
      delivery_date_expected: null,
      delivery_date_actual: null,
      is_returnable: 0,
      return_deadline: null,
      cost_estimated: 0,
      cost_actual: 0,
      notes: null
    });
    setInName('');
    setShowAddModal(false);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'RECEIVED': return 'bg-text-success/10 text-text-success border-text-success/20';
      case 'DISPATCHED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ORDERED': return 'bg-gold/10 text-gold border-gold/20';
      default: return 'bg-bg-tertiary text-text-tertiary border-border-light';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Interactive Hub Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-gold transition-all" size={18} />
            <input 
               type="text" 
               placeholder="Search Saamaan..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-bg-primary border border-border-light rounded-full py-4 pl-16 pr-6 text-sm font-bold text-text-primary focus:outline-none focus:border-gold focus:shadow-2xl transition-all"
            />
         </div>

         <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
            {(['ALL', 'ORDERED', 'DISPATCHED', 'RECEIVED'] as const).map(f => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f ? 'bg-gold-text text-white border-gold shadow-lg shadow-gold/20' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}
               >
                  {f}
               </button>
            ))}
            <button 
               onClick={() => setShowAddModal(true)}
               className="ml-2 w-12 h-12 bg-gold-text text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all flex-shrink-0"
            >
               <Plus size={24} strokeWidth={3} />
            </button>
         </div>
      </div>

      {/* 2. Inventory Grid - Lifecycle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
               <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-primary border border-border-light rounded-[2.5rem] p-6 shadow-xl group hover:border-gold/30 hover:shadow-2xl transition-all relative overflow-hidden"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: `${CAT_COLORS[item.category] || '#ccc'}20`, borderColor: `${CAT_COLORS[item.category] || '#ccc'}40`, color: CAT_COLORS[item.category] }}>
                           <Package size={20} />
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-text-primary truncate max-w-[120px]">{item.item_name}</h3>
                           <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{item.category}</p>
                        </div>
                     </div>
                     <div className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                        {item.status}
                     </div>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-text-tertiary uppercase tracking-widest">Responsibility</span>
                        <div className="flex items-center gap-2 text-text-primary">
                           <User size={12} className="text-gold" /> {item.assigned_to_id || 'Anyone'}
                        </div>
                     </div>
                     <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-text-tertiary uppercase tracking-widest">Expected Qty</span>
                        <span className="text-text-primary">{item.quantity_expected} {item.unit}</span>
                     </div>
                  </div>

                  {/* Lifecycle Quick Actions (Cousin Mode) */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border-light/50">
                     {item.status === 'ORDERED' && (
                        <button 
                           onClick={() => updateInventoryStatus(item.id, 'RECEIVED')}
                           className="flex-1 bg-gold/10 text-gold py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-gold-text hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <ShieldCheck size={14} /> Mark Received
                        </button>
                     )}
                     {item.status === 'RECEIVED' && (
                        <button 
                           onClick={() => updateInventoryStatus(item.id, 'IN_USE')}
                           className="flex-1 bg-text-success/10 text-text-success py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-text-success hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Truck size={14} /> Move to Use
                        </button>
                     )}
                     <button className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-text-tertiary hover:text-text-primary transition-all">
                        <MoreVertical size={18} />
                     </button>
                  </div>

                  {/* Subtle Background Icon */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:scale-110 transition-all pointer-events-none">
                     <Package size={120} />
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>

         {filtered.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] opacity-30">
               <AlertCircle size={48} strokeWidth={1} className="mb-4" />
               <p className="text-[11px] font-black uppercase tracking-[0.4em]">No inventory items found</p>
            </div>
         )}
      </div>

      {/* Add Inventory Modal */}
      <AnimatePresence>
         {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowAddModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xl"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-xl bg-bg-primary border border-gold/30 rounded-[3rem] p-10 shadow-2xl space-y-8"
               >
                  <div>
                     <h2 className="text-xl font-black text-text-primary tracking-tight">Add New Saamaan</h2>
                     <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">Lifecycle Enrollment</p>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Item Name *</label>
                        <input 
                           type="text" value={inName} onChange={e => setInName(e.target.value)} placeholder="e.g. 500 Folding Chairs"
                           className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Category</label>
                           <select value={inCat} onChange={e => setInCat(e.target.value)} className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none">
                              {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Assign Responsibility</label>
                           <select value={inAssign} onChange={e => setInAssign(e.target.value)} className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none">
                              <option value="">Anyone</option>
                              {family.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={handleAddItem}
                     className="w-full py-5 bg-gold-text text-white font-black rounded-3xl text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-gold/20"
                  >
                     Enroll in System
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
