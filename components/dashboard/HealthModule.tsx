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

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useHealth } from '@/hooks/useHealth';
import { useVault } from '@/hooks/useVault';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { Heart, Activity, Pill, User, Clock, ArrowRight, ShieldCheck, Thermometer, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthModule() {
  const { lang, db } = useAppStore();
  const { getFamilyMembers } = useVault();
  const { readings, medications, addReading } = useHealth();
  
  const members = getFamilyMembers();

  // Form State
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [fMem, setFMem] = React.useState(members[0]?.id || '');
  const [fSys, setFSys] = React.useState('');
  const [fDia, setFDia] = React.useState('');
  const [fSugar, setFSugar] = React.useState('');
  const [fWeight, setFWeight] = React.useState('');

  const handleAdd = () => {
    if (!fMem) return;
    addReading(fMem, Number(fSys)||0, Number(fDia)||0, Number(fSugar)||0, 0, Number(fWeight)||0, '');
    setShowAddForm(false);
    setFSys(''); setFDia(''); setFSugar(''); setFWeight('');
  };

  // Summary Metrics
  const activeMedsCount = medications.length;
  const recentCriticals = readings.filter(r => (r.bp_systolic && r.bp_systolic > 140) || (r.blood_sugar && r.blood_sugar > 140)).length;

  return (
    <ModuleShell 
      title={lang === 'en' ? "Health Vault" : "Sehat Vault"}
      subtitle={lang === 'en' ? "Your family's wellness history" : "Parivar ki tandurusti ka hisab"}
      onAdd={showAddForm ? undefined : () => setShowAddForm(true)}
      addLabel={lang === 'en' ? "Log Vitals" : "Record Karein"}
    >
      {showAddForm ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full bg-bg-secondary hover:bg-gold/10">
              <ArrowRight className="w-5 h-5 text-text-tertiary rotate-180" />
            </button>
            <h2 className="text-xl font-bold text-text-primary">
              {lang === 'hi' ? 'Naya Record' : 'Log New Vitals'}
            </h2>
          </div>

          <div className="card p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Kiska Record Padhoge?' : 'Select Member'}</label>
              <div className="flex flex-wrap gap-2">
                {members.map(m => (
                  <button key={m.id} onClick={() => setFMem(m.id)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${fMem === m.id ? 'bg-gold/10 text-gold border-gold/30' : 'bg-bg-secondary text-text-tertiary border-border-light'}`}>{m.name}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">BP Systolic</label>
                 <input type="number" value={fSys} onChange={e => setFSys(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="120" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">BP Diastolic</label>
                 <input type="number" value={fDia} onChange={e => setFDia(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="80" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Sugar' : 'Blood Sugar'}</label>
                 <input type="number" value={fSugar} onChange={e => setFSugar(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="mg/dL" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Vajan' : 'Weight (kg)'}</label>
                 <input type="number" value={fWeight} onChange={e => setFWeight(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="kg" />
               </div>
            </div>

            <button onClick={handleAdd} disabled={!fMem || (!fSys && !fSugar)} className="w-full mt-4 bg-gold hover:opacity-90 text-white font-bold h-14 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {lang === 'hi' ? 'Save Karein' : 'Save Vitals'}
            </button>
          </div>
        </div>
      ) : (
      <div className="space-y-8">
        
        {/* Top Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Total Meds" value={activeMedsCount} unit="Items" status="info" />
           <MetricCard label="Readings" value={readings.length} status="success" trend={[10, 12, 11, 15, readings.length]} />
           <MetricCard label="Criticals" value={recentCriticals} status={recentCriticals > 0 ? 'danger' : 'success'} />
           <MetricCard label="Vitals Score" value="94" unit="%" status="success" />
        </div>

        {/* Family Member Profiles */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
             Medical Profiles
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {members.map((m, i) => {
               const memberMeds = medications.filter(med => med.member_id === m.id);
               // Readings logic fix
               const mr = readings.filter(r => r.member_id === m.id);
               const latestReading = mr.length > 0 ? mr[0] : null;
               
               return (
                <motion.div 
                  key={String(m.id)}
                  whileHover={{ y: -2 }}
                  className="card p-5 group cursor-pointer hover:border-gold/30 hover:shadow-lg transition-all"
                >
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-bg-secondary border-2 border-border-light flex items-center justify-center font-black text-text-secondary group-hover:bg-gold/10 group-hover:text-gold group-hover:border-gold/20 transition-all shadow-inner">
                        {String(m.initials)}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                            <h4 className="text-base font-black text-text-primary tracking-tight">{String(m.name)}</h4>
                            <div className="flex items-center gap-1 text-[9px] font-black text-text-success uppercase tracking-widest bg-bg-success border border-text-success/10 px-2 py-0.5 rounded">
                               <ShieldCheck size={10} /> Valid
                            </div>
                         </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">
                            {String(m.role)} · {latestReading ? `BP: ${latestReading.bp_systolic}/${latestReading.bp_diastolic}` : 'No Readings'}
                         </p>
                      </div>
                   </div>
                   
                   <div className="mt-5 pt-5 border-t border-border-light/30 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                         <Activity size={14} className="text-info" />
                         {readings.filter(r => r.member_id === m.id).length} Readings
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                        <Pill size={14} className="text-gold" />
                        {memberMeds.length} Active Meds
                      </div>
                   </div>
                </motion.div>
               );
             })}
          </div>
        </section>

        {/* Global Medication List */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">
               Pritority Regimen
            </div>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
               Schedule <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="card divide-y divide-border-light/30 overflow-hidden">
             {medications.length > 0 ? medications.map((med, i) => (
               <div key={String(med.id)} className="p-5 flex items-center justify-between group hover:bg-bg-secondary transition-all">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-2xl bg-gold/5 text-gold flex items-center justify-center border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all shadow-inner">
                        <Pill size={24} />
                     </div>
                     <div>
                        <div className="text-sm font-black text-text-primary tracking-tight">{String(med.name)} ({String(med.dosage)})</div>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">
                            {members.find(x => x.id === med.member_id)?.name} · {String(med.frequency)}
                           </span>
                           <span className="w-1 h-1 rounded-full bg-border-medium"></span>
                           <div className="flex items-center gap-1 text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em]">
                              <Clock size={10} /> Night Dose
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black bg-bg-warning text-text-warning px-2.5 py-1 rounded-full uppercase tracking-widest border border-text-warning/10">
                        Running Low
                     </span>
                  </div>
               </div>
             )) : (
               <div className="py-20 flex flex-col items-center justify-center opacity-20">
                  <Pill size={48} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Zero active medications</p>
               </div>
             )}
           </div>
         </section>

       </div>
      )}
    </ModuleShell>
  );
}
