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
import { useAppStore } from '@/lib/store';
import { useSuvidha } from '@/modules/suvidha';
import { useFamily } from '@/modules/family';
import { useTranslation } from '@/lib/i18n';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { 
  Milk, 
  Droplets, 
  Users, 
  Calendar, 
  IndianRupee, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Settings2,
  Table,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SuvidhaVendor, SuvidhaLog, SuvidhaPayment } from '@/types/db';

type SuvidhaView = 'dashboard' | 'vendors' | 'ledger';

const VENDOR_TYPES = [
  { id: 'milk', label: 'SUVIDHA_MILKMAN', icon: Milk, color: '#3B82F6' },
  { id: 'water', label: 'SUVIDHA_WATER', icon: Droplets, color: '#0EA5E9' },
  { id: 'helper', label: 'SUVIDHA_HELPER', icon: Users, color: '#EC4899' },
  { id: 'paper', label: 'SUVIDHA_PAPER', icon: History, color: '#8B5CF6' },
  { id: 'other', label: 'SUVIDHA_OTHER', icon: Settings2, color: '#64748B' },
];

export default function SuvidhaModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const { 
    vendors, 
    logs, 
    addVendor, 
    archiveVendor, 
    logDaily, 
    getSummary, 
    getVendorStats 
  } = useSuvidha();
  const { familyMembers: members } = useFamily();

  const [view, setView] = useState<SuvidhaView>('dashboard');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [vName, setVName] = useState('');
  const [vType, setVType] = useState('milk');
  const [vRate, setVRate] = useState('');
  const [vBillingDay, setVBillingDay] = useState('1');
  const [vMember, setVMember] = useState('');

  const summary = getSummary();

  const handleSaveVendor = () => {
    if (!vName || !vRate) return;
    addVendor({
      name: vName,
      type: vType,
      rate_per_unit: Number(vRate),
      billing_cycle_day: Number(vBillingDay),
      member_id: vMember || null
    });
    setShowAddVendor(false);
    setVName('');
    setVRate('');
    setVBillingDay('1');
    setVMember('');
  };

  const getVendorIcon = (type: string) => {
    const found = VENDOR_TYPES.find(t => t.id === type);
    const Icon = found?.icon || Settings2;
    return <Icon size={found ? 20 : 18} />;
  };

  const currentMonthMilk = useMemo(() => {
    const now = new Date();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear().toString();
    return vendors
      .filter(v => v.type === 'milk')
      .reduce((acc, v) => acc + getVendorStats(v.id, m, y).totalQuantity, 0);
  }, [vendors, getVendorStats]);

  return (
    <ModuleShell
      title={t('SUVIDHA_HUB')}
      subtitle={t('SUVIDHA_SUBTITLE')}
      onAdd={() => setShowAddVendor(true)}
      addLabel={t('SUVIDHA_NEW_VENDOR')}
    >
      <div className="flex flex-col gap-8">
        
        {/* Navigation Tabs (Pill Style) */}
        <div className="flex bg-bg-secondary p-1.5 rounded-2xl border border-border-light self-start relative">
          {[
            { id: 'dashboard', label: t('SUVIDHA_DASHBOARD'), icon: Calendar },
            { id: 'ledger', label: t('SUVIDHA_LEDGER'), icon: Table },
            { id: 'vendors', label: t('SUVIDHA_VENDORS'), icon: Settings2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as SuvidhaView)}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors z-10 ${view === tab.id ? 'text-white' : 'text-text-tertiary hover:text-text-primary'}`}
            >
              {view === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gold-text rounded-xl shadow-lg shadow-gold/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon size={14} className="relative z-20" />
              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dash" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-10"
            >
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <MetricCard label={t('SUVIDHA_CURRENT_MILK')} value={currentMonthMilk} status="default" unit={t('SUVIDHA_LITERS')} />
                <MetricCard label={t('SUVIDHA_PAYABLE')} value={summary.totalDue} isCurrency status="warning" />
                <MetricCard label={t('SUVIDHA_ACTIVE_SERVICES')} value={vendors.length} status="success" unit={t('SUVIDHA_VENDORS')} />
              </div>


              {/* Today's Tally */}
              <section className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-text-primary">{t('SUVIDHA_DAILY_TALLY')}</h3>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('SUVIDHA_ENTRY_FOR')} {new Date().toLocaleDateString(undefined, { weekday:'long', day:'numeric', month:'short' })}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary rounded-full border border-border-light">
                    <History size={14} className="text-text-tertiary" />
                    <span className="text-[10px] font-black text-text-tertiary">{t('SUVIDHA_BULK_LOG')}</span>
                  </div>
                </div>

                {vendors.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {vendors.map(v => {
                       const todayLog = logs.find(l => l.vendor_id === v.id && l.date === todayDate);
                       return (
                         <motion.div 
                           key={v.id} 
                           whileHover={{ y: -2 }}
                           className="flex items-center justify-between p-6 bg-bg-tertiary rounded-[2rem] border border-border-light group hover:border-gold/20 hover:shadow-xl shadow-black/[0.01] transition-all"
                         >
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl bg-bg-primary border border-border-light flex items-center justify-center text-gold shadow-sm group-hover:scale-105 transition-transform">
                               {getVendorIcon(v.type)}
                             </div>
                             <div>
                               <h4 className="text-base font-black text-text-primary tracking-tight">{v.name}</h4>
                               <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">
                                 ₹{v.rate_per_unit} / {v.type === 'milk' ? t('SUVIDHA_LITER') : v.type === 'helper' ? t('SUVIDHA_DAY') : t('SUVIDHA_UNIT')}
                               </p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-4">
                             {v.type === 'helper' ? (
                               <div className="flex gap-2.5">
                                 <button 
                                   onClick={() => logDaily(v.id, todayDate, todayLog?.quantity === 1 ? 0 : 1)}
                                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${todayLog?.quantity === 1 ? 'bg-text-success text-white shadow-lg shadow-success/20' : 'bg-bg-primary text-text-tertiary border border-border-light hover:border-success/40'}`}
                                 >
                                   {todayLog?.quantity === 1 ? <CheckCircle2 size={24} /> : <Users size={20} />}
                                 </button>
                                 <button 
                                   onClick={() => logDaily(v.id, todayDate, 0)}
                                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${todayLog?.quantity === 0 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-bg-primary text-text-tertiary border border-border-light hover:border-red-500/40'}`}
                                 >
                                   <XCircle size={20} />
                                 </button>
                               </div>
                             ) : (
                               <div className="flex items-center bg-bg-primary rounded-2xl border border-border-light p-1.5 shadow-sm">
                                 <button 
                                   onClick={() => logDaily(v.id, todayDate, Math.max(0, (todayLog?.quantity || 0) - 0.5))}
                                   className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors text-lg font-black"
                                 >-</button>
                                 <span className="w-12 text-center text-sm font-black text-text-primary tabular-nums">{todayLog?.quantity || 0}</span>
                                 <button 
                                   onClick={() => logDaily(v.id, todayDate, (todayLog?.quantity || 0) + 0.5)}
                                   className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors text-lg font-black"
                                 >+</button>
                               </div>
                             )}
                           </div>
                         </motion.div>
                       );
                     })}
                   </div>
                 ) : (
                   <div className="py-24 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-border-light rounded-[3rem] text-center">
                     <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                        <Milk size={44} strokeWidth={1} className="text-text-tertiary" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-[200px] leading-relaxed">{t('SUVIDHA_NO_SERVICES')}</p>
                   </div>
                 )}

              </section>
            </motion.div>
          )}

          {view === 'vendors' && (
            <motion.div key="vendors" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(v => (
                  <div key={v.id} className="bg-bg-primary border border-border-light rounded-[2.5rem] p-6 shadow-sm group hover:border-gold/30 transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-3xl bg-bg-tertiary border border-border-light flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                        {getVendorIcon(v.type)}
                      </div>
                      <button onClick={() => archiveVendor(v.id)} className="text-text-tertiary hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="text-lg font-black text-text-primary mb-1">{v.name}</h4>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-4">{t(v.type === 'milk' ? 'SUVIDHA_MILKMAN' : v.type === 'water' ? 'SUVIDHA_WATER' : v.type === 'helper' ? 'SUVIDHA_HELPER' : v.type === 'paper' ? 'SUVIDHA_PAPER' : 'SUVIDHA_OTHER')}</p>
                    
                    <div className="space-y-3 pt-4 border-t border-border-light">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('SUVIDHA_RATE')}</span>
                        <span className="text-sm font-black text-text-primary">₹{v.rate_per_unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{t('SUVIDHA_BILLING_DAY')}</span>
                        <span className="text-sm font-black text-text-primary">{v.billing_cycle_day}th</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal for Adding Vendor */}
        <AnimatePresence>
          {showAddVendor && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-bg-primary w-full max-w-lg rounded-[3rem] border border-border-light shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-border-light bg-bg-tertiary flex items-center justify-between">
                  <h3 className="text-xl font-black text-text-primary">{t('SUVIDHA_CONFIGURE')}</h3>
                  <button onClick={() => setShowAddVendor(false)} className="text-text-tertiary hover:text-text-primary transition-colors">
                    <XCircle size={24} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('SUVIDHA_VENDOR_NAME')}</label>
                    <input autoFocus type="text" value={vName} onChange={e => setVName(e.target.value)} placeholder={t('SUVIDHA_VENDOR_PH')} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('SUVIDHA_SERVICE_TYPE')}</label>
                    <div className="flex flex-wrap gap-2">
                       {VENDOR_TYPES.map(vt => (
                        <button 
                          key={vt.id}
                          onClick={() => setVType(vt.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${vType === vt.id ? 'bg-gold-text text-white border-gold-text' : 'bg-bg-tertiary text-text-tertiary border-border-light hover:border-gold/30'}`}
                        >
                          <vt.icon size={14} />
                          {t(vt.label)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('SUVIDHA_RATE')} (₹)</label>
                      <input type="number" value={vRate} onChange={e => setVRate(e.target.value)} placeholder="65" className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('SUVIDHA_BILLING_DAY')}</label>
                      <input type="number" min="1" max="31" value={vBillingDay} onChange={e => setVBillingDay(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('SUVIDHA_HANDLE_BY')}</label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setVMember('')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${!vMember ? 'bg-bg-tertiary text-gold border-gold/30' : 'bg-bg-primary text-text-tertiary border-border-light'}`}>{t('SUVIDHA_HOUSE_MANAGER')}</button>
                      {members.map(m => (
                        <button key={m.id} onClick={() => setVMember(m.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${vMember === m.id ? 'bg-gold-text text-white' : 'bg-bg-primary text-text-tertiary border-border-light'}`}>{m.name}</button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSaveVendor} className="w-full bg-gold-text text-white font-black tracking-widest h-14 rounded-2xl shadow-xl mt-4 uppercase flex items-center justify-center gap-3">
                    <Plus size={18} /> {t('SUVIDHA_ADD_SYSTEM')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </ModuleShell>
  );
}
