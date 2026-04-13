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
import { useGrocery } from '@/hooks/useGrocery';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { ShoppingCart, Package, ListChecks, ArrowRight, MoreVertical, Plus, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RupeesDisplay from '../ui/RupeesDisplay';

export default function GroceryModule() {
  const { lang, db } = useAppStore();
  const { items } = useGrocery();

  // Group items by category
  const categories = Array.from(new Set(items.map(i => i.category)));
  const pendingCount = items.filter(i => !i.checked).length;
  const totalEstimated = items.filter(i => !i.checked).reduce((acc, i) => acc + i.estimated_price, 0);

  return (
    <ModuleShell 
      title={lang === 'en' ? "Smart Grocery" : "Kirana List"}
      subtitle={lang === 'en' ? "Grouped shopping lists with budget tracking" : "Rasoi ka saaman aur budget ka hisab"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "Add Item" : "Saaman Jodein"}
    >
      <div className="space-y-8">
        
        {/* Shopping Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Pending Items" value={pendingCount} status="warning" />
           <MetricCard label="Est. Total" value={totalEstimated} isCurrency status="default" />
           <MetricCard label="Categories" value={categories.length} status="info" />
           <MetricCard label="Shopping Status" value={pendingCount > 0 ? "Incomplete" : "Stocked"} status={pendingCount > 0 ? 'warning' : 'success'} />
        </div>

        {/* Categorized list */}
        <div className="space-y-10">
           {categories.map((cat, i) => {
             const catItems = items.filter(it => it.category === cat);
             return (
               <section key={String(cat)}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                       {String(cat)}
                    </div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{catItems.length} Items</span>
                  </div>
                  
                  <div className="card divide-y divide-border-light/30">
                     <AnimatePresence mode="popLayout">
                        {catItems.map((item) => (
                          <motion.div 
                            layout
                            key={String(item.id)}
                            className={`p-5 flex items-center gap-5 group hover:bg-bg-secondary transition-all ${item.checked ? 'opacity-40 grayscale' : ''}`}
                          >
                             <button className={`p-1 rounded-full transition-all ${item.checked ? 'text-gold' : 'text-border-medium hover:text-gold'}`}>
                                {item.checked ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} strokeWidth={2} />}
                             </button>
                             
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h4 className={`text-sm font-black tracking-tight ${item.checked ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                                         {String(item.name)}
                                      </h4>
                                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">
                                         {String(item.quantity)} {String(item.unit)}
                                      </p>
                                   </div>
                                   <div className="text-right">
                                      <div className={`text-sm font-black tracking-tighter tabular-nums ${item.checked ? 'text-text-tertiary' : 'text-text-primary'}`}>
                                         <RupeesDisplay amount={item.estimated_price} />
                                      </div>
                                      <div className="text-[9px] font-bold text-text-tertiary uppercase tracking-tighter mt-0.5">Estimated</div>
                                   </div>
                                </div>
                             </div>
                             
                             <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-text-tertiary hover:bg-bg-tertiary transition-all">
                                <MoreVertical size={16} />
                             </button>
                          </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
               </section>
             );
           })}

           {items.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center opacity-20">
                 <ShoppingCart size={48} strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Refrigerator is full!</p>
              </div>
           )}
        </div>

        {/* Floating Add Shortcut (Conceptual) */}
        <div className="bg-bg-primary border border-border-light rounded-2xl p-6 flex items-center justify-between group hover:border-gold transition-all cursor-pointer">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/5 text-gold flex items-center justify-center border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all shadow-inner">
                 <Plus size={24} strokeWidth={3} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-text-primary tracking-tight">Need more items?</h4>
                 <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-0.5">Quickly add to your Kirana List</p>
              </div>
           </div>
           <ArrowRight className="text-border-medium group-hover:text-gold transition-colors" size={20} />
        </div>

      </div>
    </ModuleShell>
  );
}
