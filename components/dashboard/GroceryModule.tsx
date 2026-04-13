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
      title={lang === 'en' ? "Family Grocery" : "Parivar ka Kirana"}
      subtitle={lang === 'en' ? "Smart shopping lists with budget tracking" : "Rasoi ka saaman aur budget ka hisab"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "Add Item" : "Saaman Jodein"}
    >
      <div className="space-y-10 md:space-y-12">
        
        {/* Shopping Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Items to Buy" value={pendingCount} status="warning" />
           <MetricCard label="Estimated Total" value={totalEstimated} isCurrency status="default" />
           <MetricCard label="Store Categories" value={categories.length} status="info" />
           <MetricCard label="Pantry Status" value={pendingCount > 0 ? (lang === 'hi' ? 'Baaki Hai' : 'Stocking') : (lang === 'hi' ? 'Poora Hai' : 'Full')} status={pendingCount > 0 ? 'warning' : 'success'} />
        </div>

        {/* Categorized list */}
        <div className="space-y-10">
           {categories.map((cat, i) => {
             const catItems = items.filter(it => it.category === cat);
             return (
               <section key={String(cat)} className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold-text shadow-[0_0_8px_rgba(184,134,11,0.4)]"></div>
                       {String(cat)}
                    </div>
                    <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">{catItems.length} {lang === 'hi' ? 'Items' : 'Items'}</span>
                  </div>
                  
                  <div className="space-y-3">
                     <AnimatePresence mode="popLayout">
                        {catItems.map((item, idx) => (
                          <motion.div 
                            layout
                            key={String(item.id)}
                            initial={{ opacity: 0, scale: 0.98, x: -5 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: idx * 0.04 }}
                            className={`bg-white border border-border-light p-6 rounded-[2rem] flex items-center gap-6 group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all duration-300 ${item.checked ? 'opacity-40 grayscale select-none' : ''}`}
                          >
                             <button className={`p-1 rounded-full transition-all transform active:scale-75 ${item.checked ? 'text-gold-text' : 'text-border-medium hover:text-gold-text'}`}>
                                {item.checked ? <CheckCircle2 size={26} strokeWidth={3} /> : <Circle size={26} strokeWidth={2} />}
                             </button>
                             
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h4 className={`text-base font-black tracking-tight leading-tight ${item.checked ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                                         {String(item.name)}
                                      </h4>
                                      <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.15em] mt-1.5 opacity-80">
                                         {String(item.quantity)} {String(item.unit)}
                                      </p>
                                   </div>
                                   <div className="text-right">
                                      <div className={`text-base font-black tracking-tighter tabular-nums ${item.checked ? 'text-text-tertiary' : 'text-text-primary'}`}>
                                         <RupeesDisplay amount={item.estimated_price} />
                                      </div>
                                      <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-60">{lang === 'hi' ? 'Anumaan' : 'Estimate'}</div>
                                   </div>
                                </div>
                             </div>
                             
                             <button className="opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center rounded-xl text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-all">
                                <MoreVertical size={18} />
                             </button>
                          </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
               </section>
             );
           })}

           {items.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center bg-white border border-border-light border-dashed rounded-[3rem] opacity-40">
                 <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={36} strokeWidth={1} className="text-text-tertiary" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.4em]">{lang === 'hi' ? 'Rasoi Bhari Hai' : 'Pantry is full!'}</h2>
              </div>
           )}
        </div>

        {/* Quick Add Shortcut */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-border-light rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-gold-text hover:shadow-2xl shadow-black/[0.02] transition-all cursor-pointer"
        >
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#fdfaf5] text-gold-text flex items-center justify-center border border-border-light group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                 <Plus size={32} strokeWidth={3} />
              </div>
              <div>
                 <h4 className="text-lg font-black text-text-primary tracking-tight">{lang === 'hi' ? 'Kuch aur chahiye?' : 'Need anything else?'}</h4>
                 <p className="text-[11px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-1 opacity-80">{lang === 'hi' ? 'Kirana list me jodein' : 'Quickly add to your items'}</p>
              </div>
           </div>
           <div className="w-12 h-12 rounded-full border border-border-light flex items-center justify-center group-hover:border-gold-text group-hover:bg-gold-text/5 transition-all">
              <ArrowRight className="text-border-medium group-hover:text-gold-text transition-colors" size={24} />
           </div>
        </motion.div>

      </div>
    </ModuleShell>
  );
}
