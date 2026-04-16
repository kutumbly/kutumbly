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
import { useGrocery } from '@/hooks/useGrocery';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { ShoppingCart, Package, ListChecks, ArrowRight, MoreVertical, Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RupeesDisplay from '../ui/RupeesDisplay';
import { useTranslation, Language } from '@/lib/i18n';
import { GroceryItem } from '@/types/db';

type GroceryView = 'overview' | 'category-items' | 'item-detail';

export default function GroceryModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const { items, addItem, checkItem, deleteItem, clearChecked } = useGrocery();
  
  const [view, setView] = useState<GroceryView>('overview');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<GroceryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fName, setFName] = useState('');
  const [fCategory, setFCategory] = useState('Staples');
  const [fQty, setFQty] = useState('1');
  const [fUnit, setFUnit] = useState('kg');
  const [fPrice, setFPrice] = useState('');

  const handleAddItem = () => {
    if (!fName.trim()) return;
    addItem(fName, fCategory, fQty, fUnit, Number(fPrice) || 0);
    setFName('');
    setFPrice('');
    setShowAddForm(false);
  };

  // Group items by category
  const categories = Array.from(new Set(items.map(i => i.category)));
  const pendingCount = items.filter(i => !i.checked).length;
  const totalEstimated = items.filter(i => !i.checked).reduce((acc, i) => acc + i.estimated_price, 0);

  const getBreadcrumbs = () => {
    const b = [t('FAMILY_GROCERY')];
    if (view === 'category-items' || view === 'item-detail') b.push(activeCategory || '');
    if (view === 'item-detail') b.push(activeItem?.name || '');
    return b;
  };

  const handleBack = () => {
    if (view === 'item-detail') setView('category-items');
    else if (view === 'category-items') setView('overview');
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? t('FAMILY_GROCERY') :
        view === 'category-items' ? `${activeCategory} List` :
        activeItem?.name || "Item Details"
      }
      subtitle={view === 'overview' ? t('SMART_SHOPPING') : undefined}
      onAdd={view === 'overview' && !showAddForm ? () => setShowAddForm(true) : undefined}
      addLabel={t('ADD_SAAMAN')}
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
           className="space-y-10 md:space-y-12"
        >
        {/* Quick Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-gold/5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                  {t('KIRANA_ADD')}
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-text-tertiary hover:text-text-danger text-xs font-bold">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('ITEM_NAME')}</label>
                  <input autoFocus value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Basmati Rice"
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('STORE_CATEGORIES')}</label>
                  <select value={fCategory} onChange={e => setFCategory(e.target.value)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all">
                    {['Staples', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Snacks', 'Beverages', 'Personal Care', 'Cleaning', 'General'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('QTY')}</label>
                    <input value={fQty} onChange={e => setFQty(e.target.value)} placeholder="1"
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('UNIT')}</label>
                    <select value={fUnit} onChange={e => setFUnit(e.target.value)}
                      className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all">
                      {['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'pack', 'bottle'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('EST_PRICE')} (₹)</label>
                  <input type="number" value={fPrice} onChange={e => setFPrice(e.target.value)} placeholder="0"
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all" />
                </div>
              </div>
              <button onClick={handleAddItem} disabled={!fName.trim()}
                className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-gold/10">
                {t('KIRANA_ADD')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('ITEMS_TO_BUY')} value={pendingCount} status="warning" />
           <MetricCard label={t('ESTIMATED_TOTAL')} value={totalEstimated} isCurrency status="default" />
           <MetricCard label={t('STORE_CATEGORIES')} value={categories.length} status="info" />
           <MetricCard label={t('PANTRY_STATUS')} value={pendingCount > 0 ? t('PANTRY_STOCKING') : t('PANTRY_FULL')} status={pendingCount > 0 ? 'warning' : 'success'} />
        </div>

        {/* Categories Grid (replaces full list view) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {categories.map((cat, i) => {
             const catItems = items.filter(it => it.category === cat);
             const pendingCatCount = catItems.filter(it => !it.checked).length;
             return (
               <motion.div 
                 key={String(cat)}
                 whileHover={{ y: -2 }}
                 onClick={() => { setActiveCategory(cat); setView('category-items'); }}
                 className="card p-6 flex flex-col items-center justify-center text-center group hover:border-gold/30 hover:shadow-xl transition-all cursor-pointer"
               >
                 <div className="w-16 h-16 rounded-full bg-bg-tertiary text-text-tertiary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-gold transition-all shadow-inner border border-border-light relative">
                    <Package size={24} />
                    {pendingCatCount > 0 && (
                       <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white">
                         {pendingCatCount}
                       </div>
                    )}
                 </div>
                 <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">{String(cat)}</h4>
                 <div className="mt-4 px-3 py-1 bg-bg-tertiary rounded-full border border-border-light text-[9px] font-black text-text-secondary uppercase tracking-widest">
                    {catItems.length} items
                 </div>
               </motion.div>
             );
           })}

           {items.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[3rem] opacity-40">
                 <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={36} strokeWidth={1} className="text-text-tertiary" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.4em]">{t('PANTRY_FULL')}</h2>
              </div>
           )}
        </div>

        {/* Quick Add Shortcut */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-gold-text hover:shadow-2xl shadow-black/[0.02] transition-all cursor-pointer"
        >
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gold-light text-gold-text flex items-center justify-center border border-border-light group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                 <Plus size={32} strokeWidth={3} />
              </div>
              <div>
                 <h4 className="text-lg font-black text-text-primary tracking-tight">{lang === 'hi' ? 'Kuch aur chahiye?' : 'Need anything else?'}</h4>
                 <p className="text-[11px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-1 opacity-80">{lang === 'hi' ? 'Kirana list me jodein' : 'Quickly add to your items'}</p>
              </div>
           </div>
        </motion.div>

        </motion.div>
        )}

        {/* Level 2: Category Items List */}
        {view === 'category-items' && (
        <motion.div 
           key="category-items"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-4"
        >
          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-4">
             <div className="flex items-center justify-between px-6 py-4 border-b border-border-light/50 mb-2">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Item List</div>
             </div>
             
             {items.filter(it => it.category === activeCategory).map((item, idx) => (
                <motion.div 
                  layout
                  onClick={() => { setActiveItem(item); setView('item-detail'); }}
                  key={String(item.id)}
                  initial={{ opacity: 0, scale: 0.98, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className={`p-4 rounded-[2rem] flex items-center gap-6 group hover:bg-bg-tertiary transition-all duration-300 cursor-pointer ${item.checked ? 'opacity-40 grayscale select-none' : ''}`}
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
                            <div className={`text-lg font-black tracking-tighter tabular-nums ${item.checked ? 'text-text-tertiary' : 'text-text-primary'}`}>
                               <RupeesDisplay amount={item.estimated_price} />
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </motion.div>
        )}

        {/* Level 3: Item Detail Read Only View */}
        {view === 'item-detail' && activeItem && (
        <motion.div 
           key="item-detail"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="bg-bg-primary border border-border-light rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/[0.02] max-w-xl mx-auto"
        >
          <div className="p-10 text-center border-b border-border-light bg-bg-tertiary">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border-2 border-border-light bg-bg-primary text-text-tertiary mb-6 shadow-sm">
               <Package size={36} />
            </div>
            
            <h3 className="text-[12px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-3">{activeCategory}</h3>
            <h2 className="text-4xl font-black text-text-primary tracking-tighter mb-2">{activeItem.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] bg-bg-primary px-4 py-2 rounded-full border border-border-light inline-flex mx-auto shadow-sm">
               <span>{activeItem.quantity} {activeItem.unit}</span>
            </div>
          </div>
          
           <div className="p-0 border-b border-border-light">
              <table className="w-full text-left">
                 <tbody>
                    <tr className="border-b border-border-light/50">
                       <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] w-1/3">Status</td>
                       <td className="p-6 text-sm font-black text-text-secondary">
                          {activeItem.checked ? (
                             <span className="text-success flex items-center gap-2"><CheckCircle2 size={16}/> Purchased</span>
                          ) : (
                             <span className="text-warning flex items-center gap-2"><Clock size={16}/> Pending</span>
                          )}
                       </td>
                    </tr>
                    <tr className="border-b border-border-light/50">
                       <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Estimate</td>
                       <td className="p-6 text-xl font-black text-text-primary">
                          ₹{activeItem.estimated_price.toLocaleString()}
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 space-y-4">
              <button 
                onClick={() => {}}
                className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl bg-border-light text-text-primary font-black text-[11px] uppercase tracking-widest hover:bg-gold-text hover:text-white transition-all shadow-sm"
              >
                 Edit Item
              </button>
           </div>
        </motion.div>
        )}


      </AnimatePresence>
    </ModuleShell>
  );
}
