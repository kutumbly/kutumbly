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
import { useTranslation } from '@/lib/i18n';
import MetricCard from '../ui/MetricCard';
import { Activity, Pill, Clock, ArrowRight, ShieldCheck, HeartPulse, LineChart, PillIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthReading, Medication, FamilyMember } from '@/types/db';

type HealthView = 'overview' | 'member-report';

export default function HealthModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
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

  const [view, setView] = React.useState<HealthView>('overview');
  const [activeMember, setActiveMember] = React.useState<FamilyMember | null>(null);

  const getBreadcrumbs = () => {
    const b = [t('HEALTH')];
    if (view === 'member-report') b.push(activeMember?.name || '');
    return b;
  };

  const handleBack = () => {
    if (view === 'member-report') setView('overview');
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? t('HEALTH') :
        `${activeMember?.name} Medical Profile`
      }
      subtitle={view === 'overview' ? (lang === 'en' ? "Your family's wellness history" : t('WELLNESS_PULSE')) : undefined}
      onAdd={showAddForm ? undefined : () => setShowAddForm(true)}
      addLabel={view === 'overview' ? t('HEALTH_VITALS') : undefined}
      breadcrumbs={view !== 'overview' && !showAddForm ? getBreadcrumbs() : undefined}
      onBack={showAddForm ? () => setShowAddForm(false) : (view !== 'overview' ? handleBack : undefined)}
    >
      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="w-10 h-10 rounded-full bg-bg-primary border border-border-light flex items-center justify-center hover:text-gold transition-all shadow-sm">
              <ArrowRight className="w-5 h-5 opacity-40 rotate-180" />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {t('HEALTH_VITALS')}
            </h2>
          </div>

          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-xl shadow-black/[0.02]">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('SELECT_MEMBER')}</label>
              <div className="flex flex-wrap gap-2">
                {members.map((m: FamilyMember) => (
                  <button key={m.id} onClick={() => setFMem(m.id)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fMem === m.id ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}>{m.name}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('SYSTOLIC')}</label>
                 <input type="number" value={fSys} onChange={e => setFSys(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="120" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('DIASTOLIC')}</label>
                 <input type="number" value={fDia} onChange={e => setFDia(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="80" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('BLOOD_SUGAR')}</label>
                 <input type="number" value={fSugar} onChange={e => setFSugar(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="mg/dL" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('WEIGHT')}</label>
                 <input type="number" value={fWeight} onChange={e => setFWeight(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="kg" />
               </div>
            </div>

            <button onClick={handleAdd} disabled={!fMem || (!fSys && !fSugar)} className="w-full mt-4 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <ShieldCheck size={20} />
              {t('SAVE_TO_VAULT')}
            </button>
          </div>
        </motion.div>
      ) : (
      <AnimatePresence mode="wait">
        {view === 'overview' && !showAddForm && (
        <motion.div 
           key="overview"
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           className="space-y-10 md:space-y-12"
        >
        
        {/* Top Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('HEALTH_MEDS')} value={activeMedsCount} status="default" />
           <MetricCard label={t('SOVEREIGN_ACTIVITY')} value={readings.length} status="success" trend={[10, 12, 11, 15, readings.length]} />
           <MetricCard label={t('CRITICAL_ALERTS')} value={recentCriticals} status={recentCriticals > 0 ? 'danger' : 'success'} />
           <MetricCard label={t('WELLNESS_PULSE')} value="94" unit="%" status="success" />
        </div>

        {/* Family Member Profiles */}
        <section className="space-y-6">
          <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">
             {t('MEDICAL_PROFILES')}
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
                  onClick={() => { setActiveMember(m); setView('member-report'); }}
                  key={m.id}
                  className="bg-bg-primary border border-border-light p-6 rounded-[2.5rem] group cursor-pointer hover:border-gold/30 hover:shadow-2xl shadow-black/[0.02] transition-all"
                >
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gold-light border border-border-light flex items-center justify-center font-black text-gold-text group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm text-lg">
                        {m.initials}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                            <h4 className="text-base font-black text-text-primary tracking-tight">{m.name}</h4>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-success uppercase tracking-widest bg-success/5 border border-success/10 px-3 py-1 rounded-full">
                               <ShieldCheck size={12} /> {t('VERIFIED')}
                            </div>
                         </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1.5 opacity-80">
                            {m.role} · {latestReading ? `${t('LATEST_BP')}: ${latestReading.bp_systolic}/${latestReading.bp_diastolic}` : 'Zero history'}
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
               {t('HEALTH_MEDS')}
            </div>
            <button className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] flex items-center gap-1.5 hover:underline">
               {t('FULL_SCHEDULE')} <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
             {medications.length > 0 ? medications.map((med: Medication, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={med.id} 
                  className="bg-bg-primary border border-border-light p-6 rounded-[2rem] flex items-center justify-between group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all"
                >
                  <div className="flex gap-5 items-center">
                     <div className="w-14 h-14 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10 group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                        <Pill size={28} />
                     </div>
                     <div>
                        <div className="text-base font-black text-text-primary tracking-tight leading-tight">{med.name} ({med.dosage})</div>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest bg-bg-tertiary px-2 py-0.5 rounded">
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
                        {t('CRITICAL_STOCK')}
                     </span>
                  </div>
                </motion.div>
             )) : (
                <div className="bg-bg-primary border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                      <Pill size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === 'hi' ? 'Dawa Khaali Hai' : 'No active regimen'}</p>
                </div>
             )}
           </div>
          </section>
        </motion.div>
        )}

        {/* Level 2: Member Medical Report Drill Down */}
        {view === 'member-report' && activeMember && !showAddForm && (
        <motion.div
           key="member-report"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1 bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-black/[0.02]">
                 <div className="w-24 h-24 rounded-3xl bg-gold-light border-2 border-border-light flex items-center justify-center font-black text-gold-text text-3xl mb-6 shadow-sm shadow-gold/10">
                   {activeMember.initials}
                 </div>
                 <h2 className="text-2xl font-black text-text-primary tracking-tight">{activeMember.name}</h2>
                 <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-2 opacity-80">{activeMember.role}</p>
                 <div className="mt-8 pt-8 border-t border-border-light/50 w-full grid grid-cols-2 gap-4 divide-x divide-border-light/50">
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Meds</div>
                       <div className="text-xl font-black text-text-primary">{medications.filter(m => m.member_id === activeMember.id).length}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Records</div>
                       <div className="text-xl font-black text-text-primary">{readings.filter(r => r.member_id === activeMember.id).length}</div>
                    </div>
                 </div>
             </div>

             <div className="md:col-span-2 space-y-6">
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                     <LineChart size={16} className="text-info" /> {t('VITALS_HISTORY')}
                  </h3>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-border-light bg-bg-tertiary">
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tl-xl">Date</th>
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">BP (Sys/Dia)</th>
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">Sugar</th>
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tr-xl text-right">Weight</th>
                        </tr>
                     </thead>
                     <tbody>
                        {readings.filter(r => r.member_id === activeMember.id).slice(0, 5).map((r, i) => (
                           <tr key={i} className="border-b border-border-light/50 hover:bg-bg-tertiary transition-colors group">
                              <td className="p-4 text-xs font-bold text-text-secondary">{new Date(String(r.created_at)).toLocaleDateString()}</td>
                              <td className="p-4">
                                 <span className={`text-sm font-black ${r.bp_systolic && r.bp_systolic > 140 ? 'text-red-500' : 'text-text-primary'}`}>
                                    {r.bp_systolic || '--'} / {r.bp_diastolic || '--'}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <span className={`text-sm font-black tabular-nums ${r.blood_sugar && r.blood_sugar > 140 ? 'text-red-500' : 'text-text-primary'}`}>
                                    {r.blood_sugar || '--'} mg
                                 </span>
                              </td>
                              <td className="p-4 text-sm font-black text-text-primary text-right">{r.weight || '--'} kg</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {readings.filter(r => r.member_id === activeMember.id).length === 0 && (
                     <div className="text-center py-12 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                        No vitals logged yet
                     </div>
                  )}
               </div>

               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <PillIcon size={16} className="text-gold" /> {t('CURRENT_MEDS')}
                     </h3>
                     <button className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline">+ {t('PROVIDE_MEDS')}</button>
                  </div>
                  <div className="space-y-3">
                     {medications.filter(m => m.member_id === activeMember.id).map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-light flex items-center justify-center text-gold-text">
                                 <Pill size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-black text-text-primary">{m.name}</div>
                                 <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.1em] mt-1">{m.dosage} • {m.frequency}</div>
                              </div>
                           </div>
                           <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest bg-bg-primary px-3 py-1.5 rounded-lg border border-border-light">Active</span>
                        </div>
                     ))}
                     {medications.filter(m => m.member_id === activeMember.id).length === 0 && (
                        <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                           No active medications
                        </div>
                     )}
                  </div>
               </div>
             </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      )}
    </ModuleShell>
  );
}
