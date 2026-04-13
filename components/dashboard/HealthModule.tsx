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
import { useHealth } from '@/hooks/useHealth';
import { useVault } from '@/hooks/useVault';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { Activity, Pill, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { HealthReading, Medication, FamilyMember } from '@/types/db';

export default function HealthModule() {
  const { lang } = useAppStore();
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
  const recentCriticals = readings.filter((r: HealthReading) => (r.bp_systolic && r.bp_systolic > 140) || (r.blood_sugar && r.blood_sugar > 140)).length;

  return (
    <ModuleShell 
      title={lang === 'en' ? "Family Health" : "Parivar ka Swasthya"}
      subtitle={lang === 'en' ? "Your family's wellness history" : "Parivar ki tandurusti ka hisab"}
      onAdd={showAddForm ? undefined : () => setShowAddForm(true)}
      addLabel={lang === 'en' ? "Log Vitals" : "Record Karein"}
    >
      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center hover:text-gold transition-all shadow-sm">
              <ArrowRight className="w-5 h-5 opacity-40 rotate-180" />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {lang === 'hi' ? 'Naya Swasthya Record' : 'Record New Vitals'}
            </h2>
          </div>

          <div className="bg-white border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-xl shadow-black/[0.02]">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'SADASYA CHUNEIN' : 'SELECT MEMBER'}</label>
              <div className="flex flex-wrap gap-2">
                {members.map((m: FamilyMember) => (
                  <button key={m.id} onClick={() => setFMem(m.id)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fMem === m.id ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-white text-text-tertiary border-border-light hover:border-gold/30'}`}>{m.name}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">BP SYSTOLIC</label>
                 <input type="number" value={fSys} onChange={e => setFSys(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="120" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">BP DIASTOLIC</label>
                 <input type="number" value={fDia} onChange={e => setFDia(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="80" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'SHAKKAR (SUGAR)' : 'BLOOD SUGAR'}</label>
                 <input type="number" value={fSugar} onChange={e => setFSugar(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="mg/dL" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{lang === 'hi' ? 'VAJAN (WEIGHT)' : 'WEIGHT (KG)'}</label>
                 <input type="number" value={fWeight} onChange={e => setFWeight(e.target.value)} className="w-full bg-[#FAF9F6] border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="kg" />
               </div>
            </div>

            <button onClick={handleAdd} disabled={!fMem || (!fSys && !fSugar)} className="w-full mt-4 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <ShieldCheck size={20} />
              {lang === 'hi' ? 'VAULT ME SAHEJIEN' : 'PROTECT IN VAULT'}
            </button>
          </div>
        </motion.div>
      ) : (
      <div className="space-y-10 md:space-y-12">
        
        {/* Top Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label="Active Medications" value={activeMedsCount} status="default" />
           <MetricCard label="Total Readings" value={readings.length} status="success" trend={[10, 12, 11, 15, readings.length]} />
           <MetricCard label="Critical Alerts" value={recentCriticals} status={recentCriticals > 0 ? 'danger' : 'success'} />
           <MetricCard label="Wellness Index" value="94" unit="%" status="success" />
        </div>

        {/* Family Member Profiles */}
        <section className="space-y-6">
          <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">
             Medical Profiles
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {members.map((m: FamilyMember, i: number) => {
               const memberMeds = medications.filter((med: Medication) => med.member_id === m.id);
               const mr = readings.filter((r: HealthReading) => r.member_id === m.id);
               const latestReading = mr.length > 0 ? mr[0] : null;
               
               return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={m.id}
                  className="bg-white border border-border-light p-6 rounded-[2.5rem] group cursor-pointer hover:border-gold/30 hover:shadow-2xl shadow-black/[0.02] transition-all"
                >
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#fdfaf5] border border-border-light flex items-center justify-center font-black text-gold-text group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm text-lg">
                        {m.initials}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                            <h4 className="text-base font-black text-text-primary tracking-tight">{m.name}</h4>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-success uppercase tracking-widest bg-success/5 border border-success/10 px-3 py-1 rounded-full">
                               <ShieldCheck size={12} /> Verified
                            </div>
                         </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1.5 opacity-80">
                            {m.role} · {latestReading ? `Latest BP: ${latestReading.bp_systolic}/${latestReading.bp_diastolic}` : 'Zero history'}
                         </p>
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-border-light/40 grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                         <Activity size={16} className="text-info" />
                         {readings.filter((r: HealthReading) => r.member_id === m.id).length} Readings
                      </div>
                      <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                         <Pill size={16} className="text-gold" />
                         {memberMeds.length} Active Meds
                      </div>
                   </div>
                </motion.div>
               );
             })}
          </div>
        </section>

        {/* Global Medication List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               Pritority Regimen
            </div>
            <button className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] flex items-center gap-1.5 hover:underline">
               Full Schedule <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
             {medications.length > 0 ? medications.map((med: Medication, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={med.id} 
                  className="bg-white border border-border-light p-6 rounded-[2rem] flex items-center justify-between group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all"
                >
                  <div className="flex gap-5 items-center">
                     <div className="w-14 h-14 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10 group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                        <Pill size={28} />
                     </div>
                     <div>
                        <div className="text-base font-black text-text-primary tracking-tight leading-tight">{med.name} ({med.dosage})</div>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest bg-[#FAF9F6] px-2 py-0.5 rounded">
                            {members.find((x: FamilyMember) => x.id === med.member_id)?.name}
                           </span>
                           <span className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.15em] opacity-60">
                            {med.frequency}
                           </span>
                           <span className="w-1 h-1 rounded-full bg-border-light"></span>
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] opacity-80">
                              <Clock size={12} /> Cycle
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black bg-red-500/5 text-red-500 px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-red-500/10">
                        Critical stock
                     </span>
                  </div>
                </motion.div>
             )) : (
                <div className="bg-white border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                      <Pill size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === 'hi' ? 'Dawa Khaali Hai' : 'No active regimen'}</p>
                </div>
             )}
           </div>
          </section>

       </div>
      )}
    </ModuleShell>
  );
}
