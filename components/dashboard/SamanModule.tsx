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

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useSaman } from '@/modules/saman';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { ShoppingCart, Package, ListChecks, ArrowRight, MoreVertical, Plus, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RupeesDisplay from '../ui/RupeesDisplay';
import { useTranslation, Language } from '@/lib/i18n';
import { SamanItem } from '@/types/db';

type SamanView = 'overview' | 'category-items' | 'item-detail';

export default function SamanModule() {
  const { lang, mode } = useAppStore();
  const t = useTranslation(lang as Language);
  const isAdvanced = mode === 'advanced';
  const { items, addItem, checkItem, deleteItem, clearChecked, applyBaseline, editItem } = useSaman();

  const [view, setView] = useState<SamanView>('overview');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<SamanItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [fName, setFName] = useState('');
  const [fCategory, setFCategory] = useState('Staples');
  const [fQty, setFQty] = useState('');
  const [fUnit, setFUnit] = useState('kg');
  const [fPrice, setFPrice] = useState('');
  const [fStock, setFStock] = useState('');
  const [fThreshold, setFThreshold] = useState('');

  const handleAddItem = () => {
    if (!fName.trim()) return;
    const price = Math.max(0, Number(fPrice) || 0); // Validation: No negative prices
    const qv = Math.max(0, Number(fQty) || 1); // Validation: Minimum 0
    
    addItem(
      fName,
      fCategory,
      qv.toString(),
      fUnit,
      price,
      0,
      1
    );
    setFName(''); setFQty(''); setFPrice(''); setFStock(''); setFThreshold('');
    setShowAddForm(false);
  };

  const handleUpdateItem = () => {
    if (!activeItem || !fName.trim()) return;
    const price = Math.max(0, Number(fPrice) || 0);
    const qv = Math.max(0, Number(fQty) || 1);
    
    // Using the scoped editItem functionality
    if (activeItem.id) {
       editItem(activeItem.id, {
          name: fName,
          category: fCategory,
          quantity: qv.toString(),
          unit: fUnit,
          estimated_price: price,
          current_stock: Number(fStock) || 0,
          threshold: Number(fThreshold) || 1
       });
       setFName(''); setFQty(''); setFPrice(''); setFStock(''); setFThreshold('');
       setIsEditing(false);
       setShowAddForm(false);
       setView('category-items');
       setActiveItem(null); // Return to default
    }
  };

  const handleApplyBaseline = () => {
    if (window.confirm(t('SAMAN_INIT_PROMPT'))) {
      applyBaseline();
      setShowAddForm(false);
    }
  };

  // Group items by category
  const categories = Array.from(new Set(items.map(i => i.category)));
  const pendingCount = items.filter(i => !i.checked).length;
  const totalEstimated = items.filter(i => !i.checked).reduce((acc, i) => acc + i.estimated_price, 0);

  const getBreadcrumbs = () => {
    const b = [t('SAMAN_HUB')];
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
        view === 'overview' ? t('SAMAN_HUB') :
        view === 'category-items' ? `${activeCategory} ${t('SAMAN_ITEM_LIST')}` :
        activeItem?.name || t('SAMAN_ITEM_DETAILS')
      }
      subtitle={view === 'overview' ? t('SAMAN_SUBTITLE') : undefined}
      onAdd={view === 'overview' && !showAddForm ? () => setShowAddForm(true) : undefined}
      addLabel={t('SAMAN_ADD_ITEM')}
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
                  {t('SAMAN_KIRANA_ADD_MDL')}
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-text-tertiary hover:text-text-danger text-xs font-bold">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('SAMAN_ITEM_NAME')}</label>
                  <input autoFocus value={fName} onChange={e => setFName(e.target.value)} placeholder={t('SAMAN_BASMATI_PH')}
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
                {t('SAMAN_KIRANA_ADD')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics — Advanced only */}
        {isAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label={t('ITEMS_TO_BUY')} value={pendingCount} status="warning" />
            <MetricCard label={t('ESTIMATED_TOTAL')} value={totalEstimated} isCurrency status="default" />
            <MetricCard label={t('STORE_CATEGORIES')} value={categories.length} status="info" />
            <MetricCard label={t('PANTRY_STATUS')} value={pendingCount > 0 ? t('PANTRY_STOCKING') : t('PANTRY_FULL')} status={pendingCount > 0 ? 'warning' : 'success'} />
          </div>
        )}

        {/* Categories Grid (Premium Card Layout) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {categories.map((cat, i) => {
             const catItems = items.filter(it => it.category === cat);
             const pendingCatCount = catItems.filter(it => !it.checked).length;
             return (
               <motion.div 
                 key={String(cat)}
                 whileHover={{ y: -4 }}
                 onClick={() => { setActiveCategory(cat); setView('category-items'); }}
                 className="card-lift bg-bg-primary border border-border-light p-8 flex flex-col items-center justify-center text-center group hover:border-gold/30 hover:shadow-2xl transition-all cursor-pointer rounded-[3rem] relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
                 
                 <div className="w-20 h-20 rounded-[2rem] bg-bg-tertiary text-text-tertiary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:text-gold transition-all shadow-inner border border-border-light relative z-10">
                    <Package size={32} />
                    {pendingCatCount > 0 && (
                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-2xl border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                         {pendingCatCount}
                       </div>
                    )}
                 </div>
                 <h4 className="text-base font-black text-text-primary uppercase tracking-[0.2em] relative z-10">{String(cat)}</h4>
                 <div className="mt-4 px-4 py-1.5 bg-bg-tertiary rounded-full border border-border-light text-[10px] font-black text-text-tertiary uppercase tracking-widest relative z-10 group-hover:bg-gold/5 group-hover:text-gold group-hover:border-gold/20 transition-all">
                    {catItems.length} {t('NAV_SAMAN')}
                 </div>
               </motion.div>
             );
           })}

           {items.length === 0 && (
              <div className="col-span-full py-40 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[4rem] opacity-30 text-center">
                 <div className="w-24 h-24 bg-bg-tertiary rounded-full flex items-center justify-center mb-8">
                    <ShoppingCart size={48} strokeWidth={1} className="text-text-tertiary" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.5em] max-w-[250px] leading-relaxed">{t('SAMAN_INVENTORY_EMPTY')}</h2>
                 <p className="text-[10px] font-bold mt-4 uppercase tracking-widest opacity-60">{t('SAMAN_INIT_KITCHEN_PH')}</p>
              </div>
           )}
        </div>

        {/* Baseline Automation — Advanced only */}
        {isAdvanced && (
          <motion.div 
            onClick={handleApplyBaseline}
            whileHover={{ y: -4 }}
            className="bg-gold/5 border border-gold/20 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-gold/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gold-text text-white flex items-center justify-center shadow-lg">
                <Package size={32} />
              </div>
              <div>
                <h4 className="text-lg font-black text-text-primary tracking-tight">
                  {t('SAMAN_RASOI_TAIYARI')}
                </h4>
                <p className="text-[11px] text-text-tertiary font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                  {t('SAMAN_INDIAN_ESSENTIALS')}
                </p>
              </div>
            </div>
            <ChevronRight className="text-gold-text group-hover:translate-x-1 transition-all" />
          </motion.div>
        )}

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
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-light/50 mb-4">
                 <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">{t('SAMAN_ITEM_LIST')}</div>
              </div>
                  {items.filter(it => it.category === activeCategory).map((item, idx) => {
                const stockHealth = Math.min(100, (item.current_stock / (item.threshold || 1)) * 100);
                const isLow = item.current_stock <= (item.threshold || 1);
                return (
                 <motion.div 
                    layout
                    onClick={() => { setActiveItem(item); setView('item-detail'); }}
                    key={String(item.id)}
                    initial={{ opacity: 0, scale: 0.98, x: -5 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className={`p-6 rounded-[2.5rem] flex items-center gap-6 group hover:bg-bg-tertiary transition-all duration-300 cursor-pointer ${item.checked ? 'opacity-40 grayscale select-none' : 'card-lift'}`}
                 >
                    <div className="flex flex-col items-center gap-2">
                       <button className={`p-1 rounded-full transition-all transform active:scale-75 ${item.checked ? 'text-gold-text' : 'text-border-medium hover:text-gold-text'}`}>
                          {item.checked ? <CheckCircle2 size={32} strokeWidth={3} /> : <Circle size={32} strokeWidth={2} />}
                       </button>
                       {isLow && !item.checked && (
                         <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-lg shadow-red-600/20" title={t('SAMAN_LOW_STOCK')} />
                       )}
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-3">
                          <div>
                             <h4 className={`text-lg font-black tracking-tight leading-tight ${item.checked ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                                {String(item.name)}
                             </h4>
                             <p className="text-[11px] text-text-tertiary font-black uppercase tracking-[0.15em] mt-1.5 opacity-80">
                                {String(item.quantity)} {String(item.unit)}
                             </p>
                          </div>
                          <div className="text-right">
                             <div className={`text-xl font-black tracking-tighter tabular-nums ${item.checked ? 'text-text-tertiary' : 'text-text-primary'}`}>
                                <RupeesDisplay amount={item.estimated_price} />
                             </div>
                          </div>
                       </div>
                       
                       {/* Stock Health Bar */}
                       <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden flex shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stockHealth}%` }}
                            className={`h-full ${isLow ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-gold-text shadow-lg shadow-gold/20'}`}
                          />
                       </div>
                    </div>
                 </motion.div>
                );
              })}
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
                        <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] w-1/3">{t('SAMAN_STATUS')}</td>
                        <td className="p-6 text-sm font-black text-text-secondary">
                           {activeItem.checked ? (
                              <span className="text-success flex items-center gap-2"><CheckCircle2 size={16}/> {t('SAMAN_PURCHASED')}</span>
                           ) : (
                              <span className="text-warning flex items-center gap-2"><Clock size={16}/> {t('SAMAN_PENDING')}</span>
                           )}
                        </td>
                     </tr>
                     <tr className="border-b border-border-light/50">
                        <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('SAMAN_ESTIMATE')}</td>
                        <td className="p-6 text-xl font-black text-text-primary">
                           ₹{activeItem.estimated_price.toLocaleString()}
                        </td>
                     </tr>
                     <tr className="border-b border-border-light/50">
                        <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('SAMAN_CURRENT_STOCK')}</td>
                        <td className="p-6 text-sm font-black text-text-primary">
                           {activeItem.current_stock} {activeItem.unit}
                        </td>
                     </tr>
                     <tr className="border-b border-border-light/50">
                        <td className="p-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('SAMAN_LOW_THRESHOLD')}</td>
                        <td className="p-6 text-sm font-black text-text-danger">
                           {activeItem.threshold} {activeItem.unit}
                        </td>
                     </tr>
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 space-y-4">
              <button 
                onClick={() => {
                   setFName(String(activeItem.name));
                   setFCategory(String(activeItem.category));
                   setFQty(String(activeItem.quantity));
                   setFUnit(String(activeItem.unit));
                   setFPrice(String(activeItem.estimated_price));
                   setFStock(String(activeItem.current_stock));
                   setFThreshold(String(activeItem.threshold || 1));
                   setIsEditing(true);
                   setShowAddForm(true);
                   setView('overview'); 
                }}
                 className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl bg-border-light text-text-primary font-black text-[11px] uppercase tracking-widest hover:bg-gold-text hover:text-white transition-all shadow-sm active:scale-[0.98] focus:outline-none"
              >
                 {t('SAMAN_EDIT_ITEM')}
              </button>
              <button 
                onClick={() => {
                   if (window.confirm(t('SAMAN_CONFIRM_DELETE'))) {
                      deleteItem(activeItem.id);
                      setView('category-items');
                      setActiveItem(null);
                   }
                }}
                 className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl bg-text-danger/10 text-text-danger font-black text-[11px] uppercase tracking-widest hover:bg-text-danger hover:text-white transition-all shadow-sm active:scale-[0.98] focus:outline-none"
              >
                 {t('SAMAN_DELETE_ITEM')}
              </button>
           </div>
        </motion.div>
        )}


      </AnimatePresence>
    </ModuleShell>
  );
}
