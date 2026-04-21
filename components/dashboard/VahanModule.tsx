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
import { useVahan } from '@/modules/vahan';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { 
  Car, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Droplet, 
  FileText, 
  ChevronRight, 
  Calendar,
  History,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import { VahanVehicle, VahanLog } from '@/types/db';
import RupeesDisplay from '../ui/RupeesDisplay';
import DonutChart from '../ui/DonutChart';

type VahanView = 'overview' | 'vehicle-detail' | 'add-vehicle' | 'add-log';

export default function VahanModule() {
  const { lang, mode } = useAppStore();
  const t = useTranslation(lang as Language);
  const isAdvanced = mode === 'advanced';
  const { 
    vehicles, 
    logs, 
    alerts, 
    addVehicle, 
    removeVehicle, 
    addLog, 
    removeLog,
    totalVehicles,
    criticalAlerts
  } = useVahan();

  const [view, setView] = useState<VahanView>('overview');
  const [selectedVehicle, setSelectedVehicle] = useState<VahanVehicle | null>(null);
  
  // Form States
  const [fName, setFName] = useState('');
  const [fNumber, setFNumber] = useState('');
  const [fType, setFType] = useState('4 Wheeler');
  const [fFuel, setFFuel] = useState('Petrol');
  const [fInsurance, setFInsurance] = useState('');
  const [fPuc, setFPuc] = useState('');

  const handleAddVehicle = () => {
    if (!fName || !fNumber) return;
    addVehicle({
      name: fName,
      vehicle_number: fNumber,
      owner_id: 'family-vault',
      vehicle_type: fType,
      fuel_type: fFuel,
      insurance_expiry: fInsurance,
      puc_expiry: fPuc,
      fitness_expiry: '',
      insurance_policy_no: '',
      notes: ''
    });
    setFName(''); setFNumber('');
    setView('overview');
  };

  const getStatusColor = (expiry: string | null | undefined) => {
    if (!expiry) return 'text-text-tertiary';
    const today = new Date().toISOString().split('T')[0];
    if (expiry < today) return 'text-red-500';
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (expiry <= thirtyDays) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const handleBack = () => {
    if (view === 'vehicle-detail' || view === 'add-vehicle') setView('overview');
    else if (view === 'add-log') setView('vehicle-detail');
  };

  return (
    <ModuleShell 
      title={t('NAV_VAHAN')}
      subtitle={view === 'overview' ? t('vahan.total_vehicles') : undefined}
      onAdd={view === 'overview' ? () => setView('add-vehicle') : undefined}
      onBack={view !== 'overview' ? handleBack : undefined}
    >
      <AnimatePresence mode="wait">
        
        {/* ── Level 2: Overview List ────────────────────────── */}
        {view === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <MetricCard label={t('vahan.total_vehicles')} value={totalVehicles} status="default" />
               <MetricCard label="Critical Alerts" value={criticalAlerts} status={criticalAlerts > 0 ? "danger" : "success"} />
               <MetricCard label="Total Logs" value={logs.length} status="info" />
               <MetricCard label="Service Due" value={0} status="warning" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => {
                const vehicleAlerts = alerts.filter(a => a.vehicleId === v.id);
                return (
                  <motion.div
                    key={v.id}
                    whileHover={{ y: -2 }}
                    onClick={() => { setSelectedVehicle(v); setView('vehicle-detail'); }}
                    className="p-6 bg-bg-secondary border border-border-light rounded-[2rem] cursor-pointer hover:border-gold/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center text-text-tertiary group-hover:text-gold transition-colors shadow-inner border border-border-light">
                        <Car size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-text-primary tracking-tight">{v.name}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-text-tertiary mt-1">
                          {v.vehicle_number} • {v.fuel_type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                       {vehicleAlerts.length > 0 ? (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                            <AlertTriangle size={12} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{vehicleAlerts.length} Alert</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                            <ShieldCheck size={12} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest">OK</span>
                         </div>
                       )}
                       <ChevronRight size={16} className="text-text-tertiary group-hover:text-gold opacity-30 group-hover:opacity-100 transition-all" />
                    </div>
                  </motion.div>
                );
              })}

              {vehicles.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border-light rounded-[3rem] opacity-40">
                   <Car size={48} strokeWidth={1} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Vehicles Registered</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Level 3: Vehicle Detail ────────────────────────── */}
        {view === 'vehicle-detail' && selectedVehicle && (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header Card */}
            <div className="p-8 bg-bg-secondary border border-border-light rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
               <div className="w-24 h-24 rounded-3xl bg-bg-tertiary flex items-center justify-center text-gold shadow-inner border border-border-light">
                  <Car size={48} />
               </div>
               <div className="flex-1">
                  <h2 className="text-3xl font-black text-text-primary tracking-tight">{selectedVehicle.name}</h2>
                  <p className="text-sm font-black text-text-tertiary tracking-widest uppercase mt-1 opacity-60">
                    {selectedVehicle.vehicle_number} | {selectedVehicle.vehicle_type}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                     <div className="px-4 py-2 bg-bg-tertiary rounded-xl flex items-center gap-3 border border-border-light">
                        <FileText size={16} className="text-blue-500" />
                        <div>
                           <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">PUC</p>
                           <p className={`text-xs font-bold leading-none ${getStatusColor(selectedVehicle.puc_expiry)}`}>
                             {selectedVehicle.puc_expiry || 'N/A'}
                           </p>
                        </div>
                     </div>
                     <div className="px-4 py-2 bg-bg-tertiary rounded-xl flex items-center gap-3 border border-border-light">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <div>
                           <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">Insurance</p>
                           <p className={`text-xs font-bold leading-none ${getStatusColor(selectedVehicle.insurance_expiry)}`}>
                             {selectedVehicle.insurance_expiry || 'N/A'}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1" />
               
               {/* Analytics */}
               <div className="hidden lg:flex items-center gap-6 pr-4">
                  <div className="text-right">
                     <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Expense Mix</p>
                     <div className="flex items-center gap-3">
                        <div className="text-[9px] font-bold text-text-tertiary">
                           <div className="flex items-center gap-1.5 justify-end">
                              Fuel <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                           </div>
                           <div className="flex items-center gap-1.5 justify-end">
                              Service <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           </div>
                        </div>
                        <DonutChart 
                           size={80} thickness={8}
                           data={[
                              { label: 'Fuel', value: logs.filter(l => l.vehicle_id === selectedVehicle.id && l.log_type === 'Fuel').reduce((s, l) => s + l.amount, 0) || 1, color: '#f59e0b' },
                              { label: 'Service', value: logs.filter(l => l.vehicle_id === selectedVehicle.id && l.log_type === 'Service').reduce((s, l) => s + l.amount, 0) || 1, color: '#3b82f6' }
                           ]} 
                        />
                     </div>
                  </div>
               </div>

               <div className="flex md:flex-col gap-2">
                 <button 
                  onClick={() => { if(selectedVehicle?.id && window.confirm('Delete vehicle?')) { removeVehicle(selectedVehicle.id); setView('overview'); } }}
                  className="p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                 >
                   <Trash2 size={20} />
                 </button>
               </div>
            </div>

            {/* Service & Log History */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-[11px] font-black text-text-tertiary tracking-[0.3em] uppercase flex items-center gap-2">
                     <History size={14} /> Service Logs
                  </h3>
                  <button 
                    onClick={() => setView('add-log')}
                    className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-1 hover:opacity-80"
                  >
                    <Plus size={14} /> Add Log
                  </button>
               </div>

               <div className="bg-bg-secondary border border-border-light rounded-[2.5rem] overflow-hidden">
                  {logs.filter(l => l.vehicle_id === selectedVehicle.id).length === 0 ? (
                    <div className="p-20 text-center opacity-30">
                       <p className="text-[10px] font-black uppercase tracking-widest">No Logs Found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-light/50">
                       {logs.filter(l => l.vehicle_id === selectedVehicle.id).map((l) => (
                         <div key={l.id} className="p-6 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl ${
                                 l.log_type === 'Service' ? 'bg-blue-500/10 text-blue-500' :
                                 l.log_type === 'Fuel' ? 'bg-amber-500/10 text-amber-500' :
                                 'bg-slate-500/10 text-slate-500'
                               }`}>
                                  {l.log_type === 'Service' ? <Wrench size={20} /> : <Droplet size={20} />}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-text-primary">{l.log_type}</p>
                                  <p className="text-[10px] font-bold text-text-tertiary uppercase mt-0.5">{l.date}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-base font-black text-text-primary"><RupeesDisplay amount={l.amount} /></p>
                               <p className="text-[9px] font-bold text-text-tertiary uppercase">{l.odometer} KM</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        )}

        {/* ── Add Vehicle Modal Flow ────────────────────────── */}
        {view === 'add-vehicle' && (
          <motion.div 
            key="add"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="bg-bg-secondary border border-border-light rounded-[3rem] p-8 shadow-2xl space-y-6">
              <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] text-center border-b border-border-light pb-6">
                Register Sovereign Vehicle
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest px-2">Vehicle Name</label>
                    <input 
                      value={fName} onChange={e => setFName(e.target.value)}
                      placeholder="e.g. White Fortuner"
                      className="w-full h-14 bg-bg-primary border border-border-light rounded-2xl px-6 text-sm font-bold focus:border-gold outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest px-2">Car Number</label>
                    <input 
                      value={fNumber} onChange={e => setFNumber(e.target.value)}
                      placeholder="e.g. KA 01 HH 1234"
                      className="w-full h-14 bg-bg-primary border border-border-light rounded-2xl px-6 text-sm font-bold focus:border-gold outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest px-2">Fuel Type</label>
                    <select 
                      value={fFuel} onChange={e => setFFuel(e.target.value)}
                      className="w-full h-14 bg-bg-primary border border-border-light rounded-2xl px-6 text-sm font-bold outline-none"
                    >
                      <option>Petrol</option><option>Diesel</option><option>EV</option><option>CNG</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest px-2">Insurance Expiry</label>
                    <input 
                      type="date" value={fInsurance} onChange={e => setFInsurance(e.target.value)}
                      className="w-full h-14 bg-bg-primary border border-border-light rounded-2xl px-6 text-sm font-bold outline-none"
                    />
                 </div>
              </div>

              <button 
                onClick={handleAddVehicle}
                className="w-full h-16 bg-gold text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-90 shadow-lg shadow-gold/20 transition-all mt-4"
              >
                Enroll Vehicle
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </ModuleShell>
  );
}
