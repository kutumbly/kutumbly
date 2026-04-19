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

import React from 'react';
import { useAppStore } from '@/lib/store';
import { useHealth } from '@/modules/health';
import { useFamily } from '@/modules/family';
import ModuleShell from './ModuleShell';
import { useTranslation } from '@/lib/i18n';
import MetricCard from '../ui/MetricCard';
import { 
  Activity, Pill, Clock, ArrowRight, ShieldCheck, HeartPulse, 
  LineChart, PillIcon, Syringe, AlertCircle, Phone, Info, 
  Trash2, Edit3, Save, X, PlusCircle, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthReading, Medication, FamilyMember, Vaccination, HealthProfile } from '@/types/db';

type HealthView = 'overview' | 'member-report' | 'vaccinations' | 'sos-edit';

export default function HealthModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const { familyMembers: members } = useFamily();
  const { 
    readings, medications, vaccinations, healthProfiles,
    addReading, editReading, deleteReading,
    addMedication, stopMedication, deleteMedication,
    prescriptions, addPrescription, stopPrescription, deletePrescription,
    addVaccination, deleteVaccination,
    updateHealthProfile,
    advancedProfiles, updateAdvancedProfile
  } = useHealth();
  
  

  // Navigation & Drill-down
  const [view, setView] = React.useState<HealthView>('overview');
  const [activeMember, setActiveMember] = React.useState<FamilyMember | null>(null);

  // Form State (Vitals)
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isEditingReading, setIsEditingReading] = React.useState<string | null>(null);
  const [fMem, setFMem] = React.useState(members[0]?.id || '');
  const [fSys, setFSys] = React.useState('');
  const [fDia, setFDia] = React.useState('');
  const [fSugar, setFSugar] = React.useState('');
  const [fPulse, setFPulse] = React.useState('');
  const [fWeight, setFWeight] = React.useState('');
  const [fNotes, setFNotes] = React.useState('');
  const [fDate, setFDate] = React.useState(new Date().toISOString().split('T')[0]);

  // SOS Form States
  const [sosBlood, setSosBlood] = React.useState('');
  const [sosAllergies, setSosAllergies] = React.useState('');
  const [sosChronic, setSosChronic] = React.useState('');
  const [sosDoctor, setSosDoctor] = React.useState('');
  const [sosEmergency, setSosEmergency] = React.useState('');
  const [sosInsurance, setSosInsurance] = React.useState('');

  // Advanced Health Form States
  const [advPrakriti, setAdvPrakriti] = React.useState('');
  const [advAgni, setAdvAgni] = React.useState('');
  const [advDiet, setAdvDiet] = React.useState('');
  const [advSurgery, setAdvSurgery] = React.useState('');
  const [advFamily, setAdvFamily] = React.useState('');
  const [advTreatment, setAdvTreatment] = React.useState('');

  // Premium Rx States
  const [showRxForm, setShowRxForm] = React.useState(false);
  const [rxDoc, setRxDoc] = React.useState('');
  const [rxGen, setRxGen] = React.useState('');
  const [rxBrand, setRxBrand] = React.useState('');
  const [rxType, setRxType] = React.useState('Tablet');
  const [rxDose, setRxDose] = React.useState('');
  const [rxSch, setRxSch] = React.useState('1-0-1');
  const [rxMeal, setRxMeal] = React.useState('PC');
  const [rxPurp, setRxPurp] = React.useState('');


  const handleSaveReading = () => {
    if (!fMem) return;
    const sys = Number(fSys) || 0;
    const dia = Number(fDia) || 0;
    const sugar = Number(fSugar) || 0;
    const pulse = Number(fPulse) || 0;
    const weight = Number(fWeight) || 0;

    const payload = {
      member_id: fMem,
      date: fDate,
      bp_sys: sys,
      bp_dia: dia,
      sugar,
      pulse,
      weight,
      notes: fNotes
    };

    if (isEditingReading) {
      editReading(isEditingReading, payload);
    } else {
      addReading(payload);
    }
    
    setShowAddForm(false);
    setIsEditingReading(null);
    setFSys(''); setFDia(''); setFSugar(''); setFWeight(''); setFPulse(''); setFNotes('');
  };

  const handleEditVitalsTrigger = (r: HealthReading) => {
    setFMem(r.member_id);
    setFSys(String(r.bp_systolic || ''));
    setFDia(String(r.bp_diastolic || ''));
    setFSugar(String(r.blood_sugar || ''));
    setFPulse(String(r.pulse || ''));
    setFWeight(String(r.weight || ''));
    setFNotes(r.notes || '');
    setFDate(r.date);
    setIsEditingReading(r.id);
    setShowAddForm(true);
  };

  const handleDeleteReading = (id: string) => {
    if (window.confirm(t('HEALTH_CONFIRM_DELETE_READING'))) {
      deleteReading(id);
    }
  };

  const calculateBMI = (weightKg: number, heightCm: number) => {
    if (!weightKg || !heightCm) return 0;
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMIClose = (bmi: number) => {
    const val = Number(bmi);
    if (val < 18.5) return { label: t('HEALTH_BMI_UNDER'), color: 'text-info' };
    if (val < 25) return { label: t('HEALTH_BMI_NORMAL'), color: 'text-success' };
    if (val < 30) return { label: t('HEALTH_BMI_OVER'), color: 'text-warning' };
    return { label: t('HEALTH_BMI_OBESE'), color: 'text-danger' };
  };

  // Sparkline Component (Simple CSS based)
  const Sparkline = ({ data, colorClass = "bg-info" }: { data: number[], colorClass?: string }) => {
    if (data.length < 2) return <div className="h-1 w-full bg-border-light/20 rounded-full" />;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-[2px] h-6 w-16">
        {data.slice(-7).map((v, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-[1px] ${colorClass} opacity-60`} 
            style={{ height: `${((v - min) / range) * 100 + 10}%` }}
          />
        ))}
      </div>
    );
  };

  const getBreadcrumbs = () => {
    const b = [t('HEALTH')];
    if (view === 'member-report') b.push(activeMember?.name || '');
    if (view === 'sos-edit') b.push(t('HEALTH_UPDATE_RECORD'));
    return b;
  };

  const handleBack = () => {
    if (view === 'member-report') setView('overview');
    if (view === 'sos-edit') setView('member-report');
  };

  // Summary Metrics
  const activeRxCount = prescriptions.filter(m => !m.end_date).length;
  const recentCriticals = readings.filter((r: HealthReading) => 
    (r.bp_systolic && r.bp_systolic > 140) || (r.blood_sugar && r.blood_sugar > 140)
  ).length;
  
  const wellnessPulse = React.useMemo(() => {
    if (readings.length === 0) return 100;
    const criticals = readings.filter((r) => 
      (r.bp_systolic && (r.bp_systolic > 140 || r.bp_systolic < 90)) || 
      (r.blood_sugar && (r.blood_sugar > 140 || r.blood_sugar < 70))
    ).length;
    return Math.max(0, Math.round(((readings.length - criticals) / readings.length) * 100));
  }, [readings]);

  return (
    <ModuleShell 
      title={
        view === 'overview' ? t('HEALTH') :
        view === 'sos-edit' ? t('HEALTH_SOS_PROFILE') :
        `${activeMember?.name} ${t('HEALTH_HEALTH_PROFILES')}`
      }
      subtitle={view === 'overview' ? t('HEALTH_SUBTITLE') : undefined}
      onAdd={showAddForm || view === 'sos-edit' ? undefined : () => setShowAddForm(true)}
      addLabel={view === 'overview' ? t('HEALTH_VITALS') : undefined}
      breadcrumbs={view !== 'overview' && !showAddForm ? getBreadcrumbs() : undefined}
      onBack={showAddForm ? () => { setShowAddForm(false); setIsEditingReading(null); } : (view !== 'overview' ? handleBack : undefined)}
    >
      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => { setShowAddForm(false); setIsEditingReading(null); }} className="w-10 h-10 rounded-full bg-bg-primary border border-border-light flex items-center justify-center hover:text-gold transition-all shadow-sm">
              <X className="w-5 h-5 opacity-40" />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {isEditingReading ? t('HEALTH_UPDATE_RECORD') : t('HEALTH_VITALS')}
            </h2>
          </div>

          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-xl shadow-black/[0.02]">
            {!isEditingReading && (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_SELECT_MEMBER')}</label>
                <div className="flex flex-wrap gap-2">
                  {members.map((m: FamilyMember) => (
                    <button key={m.id} onClick={() => setFMem(m.id)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fMem === m.id ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/30'}`}>{m.name}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_READING_DATE')}</label>
                 <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-xl font-black text-text-primary outline-none focus:border-gold transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_SYSTOLIC')}</label>
                    <input type="number" value={fSys} onChange={e => setFSys(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="120" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_DIASTOLIC')}</label>
                    <input type="number" value={fDia} onChange={e => setFDia(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="80" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_SUGAR')}</label>
                 <input type="number" value={fSugar} onChange={e => setFSugar(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="mg/dL" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_PULSE')}</label>
                 <input type="number" value={fPulse} onChange={e => setFPulse(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="bpm" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_WEIGHT')}</label>
                 <input type="number" value={fWeight} onChange={e => setFWeight(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-2xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="kg" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('SUVIDHA_LOG_NOTES')}</label>
                 <input type="text" value={fNotes} onChange={e => setFNotes(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-base font-black text-text-secondary outline-none focus:border-gold transition-all" placeholder={t('VIDYA_NOTES')} />
               </div>
            </div>

            <button onClick={handleSaveReading} disabled={!fMem || (!fSys && !fSugar)} className="w-full mt-4 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <ShieldCheck size={20} />
              {isEditingReading ? t('HEALTH_UPDATE_RECORD') : t('HEALTH_SAVE_VAULT')}
            </button>
          </div>
        </motion.div>
      ) : (
      <AnimatePresence mode="wait">
        {view === 'overview' && (
        <motion.div 
           key="overview"
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           className="space-y-10 md:space-y-12"
        >
        
        {/* Top Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('HEALTH_ACTIVE_RX')} value={activeRxCount} status="default" />
           <MetricCard label={t('SOVEREIGN_ACTIVITY')} value={readings.length} status="success" trend={[10, 12, 11, 15, readings.length]} />
           <MetricCard label={t('HEALTH_CRITICAL_ALERTS')} value={recentCriticals} status={recentCriticals > 0 ? 'danger' : 'success'} />
           <MetricCard label={t('HEALTH_WELLNESS_PULSE')} value={wellnessPulse} unit="%" status={wellnessPulse < 80 ? 'warning' : 'success'} />
        </div>

        {/* SOS Quick View (Premium Glass Layout) */}
        <section className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-red-500/[0.05] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-600/30 animate-pulse">
                <AlertCircle size={32} />
              </div>
              <div>
                <h4 className="text-lg font-black text-red-700 uppercase tracking-[0.2em] leading-none mb-2">{t('HEALTH_SOS_PROTOCOL')}</h4>
                <p className="text-xs text-red-600/80 font-bold max-w-md">{t('HEALTH_SOS_DESC')}</p>
              </div>
           </div>
           <div className="flex gap-3 relative z-10">
              {members.slice(0, 5).map(m => {
                const p = healthProfiles.find(x => x.member_id === m.id);
                return (
                 <div key={m.id} className="w-12 h-12 rounded-2xl bg-white border border-red-500/20 flex flex-col items-center justify-center text-[10px] font-black text-red-600 shadow-xl group hover:scale-110 transition-transform cursor-help" title={`${m.name}: ${p?.blood_group || 'No Data'}`}>
                    {p?.blood_group || m.initials}
                 </div>
                );
              })}
           </div>
        </section>

        {/* Family Member Profiles */}
        <section className="space-y-6">
          <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] px-2">
             {t('HEALTH_HEALTH_PROFILES')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {members.map((m: FamilyMember, i: number) => {
               const memberMeds = prescriptions.filter((med) => med.member_id === m.id && !med.end_date);
               const mr = readings.filter((r: HealthReading) => r.member_id === m.id);
               const latestReading = mr.length > 0 ? mr[0] : null;
               const profile = healthProfiles.find(p => p.member_id === m.id);
               
               return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setActiveMember(m); setView('member-report'); }}
                  key={m.id}
                  className="card-lift bg-bg-primary border border-border-light p-6 rounded-[2.5rem] group cursor-pointer hover:border-gold/30 hover:shadow-2xl shadow-black/[0.02] transition-all relative overflow-hidden"
                >
                   {profile?.blood_group && (
                     <div className="absolute top-0 right-0 p-4">
                        <div className="bg-red-500/10 text-red-600 text-[10px] font-black px-3 py-1 rounded-full border border-red-500/20">
                          {profile.blood_group}
                        </div>
                     </div>
                   )}
                   
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gold-light border border-border-light flex items-center justify-center font-black text-gold-text group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm text-lg">
                        {m.avatar_initials || m.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                            <h4 className="text-base font-black text-text-primary tracking-tight">{m.name}</h4>
                         </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1.5 opacity-80">
                            {m.role} · {latestReading ? `${t('HEALTH_LATEST_BP')}: ${latestReading.bp_systolic}/${latestReading.bp_diastolic}` : t('HEALTH_ZERO_HISTORY')}
                         </p>
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-border-light/40 flex items-center justify-between">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                           <Activity size={16} className="text-info" />
                           {mr.length} {t('HEALTH_RECORDS')}
                        </div>
                        <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                           <Pill size={16} className="text-gold" />
                           {memberMeds.length} {t('HEALTH_MEDS')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkline data={mr.map(r => Number(r.bp_systolic || 0)).filter(v => v > 0)} />
                      </div>
                   </div>
                </motion.div>
               );
             })}
          </div>
        </section>

        {/* Global Rx List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               {t('HEALTH_ACTIVE_RX')}
            </div>
          </div>
          
          <div className="space-y-4">
             {prescriptions.filter((m) => !m.end_date).length > 0 ? prescriptions.filter((m) => !m.end_date).map((rx, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={rx.id} 
                  className="bg-bg-primary border border-border-light p-6 rounded-[2rem] flex items-center justify-between group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all"
                >
                  <div className="flex gap-5 items-center">
                     <div className="w-14 h-14 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10 group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                        <Pill size={28} />
                     </div>
                     <div>
                        <div className="text-base font-black text-text-primary tracking-tight leading-tight">{rx.generic_name} <span className="opacity-40 text-sm">{rx.brand_name && `(${rx.brand_name})`}</span></div>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest bg-bg-tertiary px-2 py-0.5 rounded">
                            {members.find((x) => x.id === rx.member_id)?.name}
                           </span>
                           <span className="text-[10px] text-text-primary font-black uppercase tracking-[0.15em] border border-border-light px-2 rounded bg-white">
                            {rx.schedule_code}
                           </span>
                           <span className="text-[10px] text-gold-text font-black uppercase tracking-[0.15em] opacity-80">
                            {rx.meal_instruction === 'AC' ? t('HEALTH_MEAL_AC') : rx.meal_instruction === 'PC' ? t('HEALTH_MEAL_PC') : t('HEALTH_MEAL_ANY')}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <button onClick={() => stopPrescription(rx.id)} className="text-[9px] text-danger font-black uppercase bg-danger/5 px-4 py-2 rounded-xl border border-danger/10 hover:bg-danger hover:text-white transition-all">{t('HEALTH_STOP_RX')}</button>
                  </div>
                </motion.div>
             )) : (
                <div className="bg-bg-primary border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                      <Pill size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t('HEALTH_NO_RX')}</p>
                </div>
             )}
           </div>
          </section>
        </motion.div>
        )}

        {/* Level 2: Member Medical Report Drill Down */}
        {view === 'member-report' && activeMember && (
        <motion.div
           key="member-report"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-8"
        >
          {/* Top Panel: Bio + SOS Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1 bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl shadow-black/[0.02]">
                 <div className="relative">
                    <div className="w-28 h-28 rounded-3xl bg-gold-light border-2 border-border-light flex items-center justify-center font-black text-gold-text text-4xl mb-6 shadow-sm shadow-gold/10">
                      {activeMember.name.substring(0,2).toUpperCase()}
                    </div>
                    <button 
                      onClick={() => {
                        const profile = healthProfiles.find(p => p.member_id === activeMember.id);
                        setSosBlood(profile?.blood_group || '');
                        setSosAllergies(profile?.allergies || '');
                        setSosChronic(profile?.chronic_conditions || '');
                        setSosDoctor(profile?.primary_doctor || '');
                        setSosEmergency(profile?.emergency_contact || '');
                        setSosInsurance(profile?.insurance_details || '');

                        const adv = advancedProfiles.find(p => p.member_id === activeMember.id);
                        setAdvPrakriti(adv?.prakriti || '');
                        setAdvAgni(adv?.agni || '');
                        setAdvDiet(adv?.diet || '');
                        setAdvSurgery(adv?.surgical_history || '');
                        setAdvFamily(adv?.family_history || '');
                        setAdvTreatment(adv?.current_treatment || '');
                        
                        setView('sos-edit');
                      }}
                      className="absolute bottom-4 -right-2 p-3 bg-white border border-border-light rounded-2xl shadow-xl hover:text-gold transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                 </div>
                 
                 <h2 className="text-2xl font-black text-text-primary tracking-tight">{activeMember.name}</h2>
                 
                 {medicalProfiles.find(p => p.member_id === activeMember.id)?.blood_group ? (
                    <div className="mt-4 flex items-center gap-2 bg-red-500/10 text-red-600 px-5 py-2 rounded-2xl border border-red-500/20">
                       <HeartPulse size={16} className="animate-pulse" />
                       <span className="text-xs font-black uppercase tracking-widest">{healthProfiles.find(p => p.member_id === activeMember.id)?.blood_group}</span>
                    </div>
                  ) : (
                    <button onClick={() => setView('sos-edit')} className="mt-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest border border-dashed border-border-light px-4 py-2 rounded-xl hover:border-gold transition-all">{t('HEALTH_SOS_PROFILE')}</button>
                  )}

                 <div className="mt-8 pt-8 border-t border-border-light/50 w-full grid grid-cols-2 gap-4 divide-x divide-border-light/50">
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('HEALTH_MEDS')}</div>
                       <div className="text-xl font-black text-text-primary">{medications.filter(m => m.member_id === activeMember.id && !m.end_date).length}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('HEALTH_RECORDS')}</div>
                       <div className="text-xl font-black text-text-primary">{readings.filter(r => r.member_id === activeMember.id).length}</div>
                    </div>
                 </div>

                 {/* BMI Calculator Widget */}
                 {readings.find(r => r.member_id === activeMember.id && r.weight) && (
                   <div className="mt-8 w-full bg-bg-tertiary rounded-3xl p-6 border border-border-light/40">
                      <div className="flex items-center justify-between mb-4">
                         <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                           <Scale size={14} /> {t('HEALTH_BMI_TITLE')}
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         {/* We assume a default height of 170cm if not available, in real app we'd save height too */}
                         <div className="text-3xl font-black text-text-primary">
                            {calculateBMI(readings.find(r => r.member_id === activeMember.id && r.weight)?.weight || 0, 172)}
                         </div>
                         <div className="text-left">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${getBMIClose(Number(calculateBMI(readings.find(r => r.member_id === activeMember.id && r.weight)?.weight || 0, 172))).color}`}>
                              {getBMIClose(Number(calculateBMI(readings.find(r => r.member_id === activeMember.id && r.weight)?.weight || 0, 172))).label}
                            </div>
                            <div className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold opacity-60">Based on latest log</div>
                         </div>
                      </div>
                   </div>
                 )}
             </div>

             <div className="md:col-span-2 space-y-6">
                {/* SOS / Medical ID Cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {healthProfiles.find(p => p.member_id === activeMember.id) && (
                    <div className="bg-bg-primary border border-border-light rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                       <div className="flex items-center gap-3 text-text-tertiary">
                          <AlertCircle size={18} className="text-red-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{t('HEALTH_HEALTH_PROFILES')}</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-black">Allergies</p>
                            <p className="font-bold text-text-primary">{medicalProfiles.find(p => p.member_id === activeMember.id)?.allergies || 'No known allergies'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-black">Chronic</p>
                            <p className="font-bold text-text-primary truncate">{medicalProfiles.find(p => p.member_id === activeMember.id)?.chronic_conditions || 'None'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-black">Surgeries</p>
                            <p className="font-bold text-text-primary truncate">{advancedProfiles.find(p => p.member_id === activeMember.id)?.surgical_history || 'None'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-black">Emergency Contact</p>
                            <p className="font-bold text-text-primary">{medicalProfiles.find(p => p.member_id === activeMember.id)?.emergency_contact || 'None set'}</p>
                          </div>
                       </div>
                    </div>
                  )}

                  {advancedProfiles.find(p => p.member_id === activeMember.id)?.prakriti && (
                    <div className="bg-gold-light/20 border border-gold/20 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                       <div className="flex items-center gap-3 text-gold-text">
                          <Info size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Ayurvedic Prakriti</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-[9px] text-gold-text uppercase tracking-widest font-black">Prakriti (Dosha)</p>
                            <p className="font-bold text-text-primary capitalize">{advancedProfiles.find(p => p.member_id === activeMember.id)?.prakriti}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gold-text uppercase tracking-widest font-black">Agni (Digestion)</p>
                            <p className="font-bold text-text-primary capitalize">{advancedProfiles.find(p => p.member_id === activeMember.id)?.agni || 'Unassessed'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gold-text uppercase tracking-widest font-black">Diet Type (Ahaar)</p>
                            <p className="font-bold text-text-primary capitalize">{advancedProfiles.find(p => p.member_id === activeMember.id)?.diet || 'Unassessed'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gold-text uppercase tracking-widest font-black">Treatment Plan</p>
                            <p className="font-bold text-text-primary truncate">{advancedProfiles.find(p => p.member_id === activeMember.id)?.current_treatment || 'None'}</p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

               {/* Vitals History Table */}
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                       <LineChart size={16} className="text-info" /> {t('HEALTH_VITALS_HISTORY')}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                       <thead>
                          <tr className="border-b border-border-light bg-bg-tertiary">
                             <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tl-2xl">{t('HEALTH_READING_DATE')}</th>
                             <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">BP (Sys/Dia)</th>
                             <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('HEALTH_VITALS')}</th>
                             <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{t('HEALTH_WEIGHT')}</th>
                             <th className="p-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tr-2xl text-right">{t('SUVIDHA_ACTIONS')}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border-light/40">
                          {readings.filter(r => r.member_id === activeMember.id).slice(0, 15).map((r, i) => (
                             <tr key={r.id} className="hover:bg-bg-tertiary/50 transition-all group">
                                <td className="p-5">
                                   <div className="text-sm font-black text-text-secondary">{new Date(String(r.date)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                   <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-60">Sovereign Log</div>
                                </td>
                                <td className="p-5">
                                   <div className={`text-lg font-black tabular-nums tracking-tighter ${r.bp_systolic && (r.bp_systolic > 140 || r.bp_systolic < 90) ? 'text-red-500' : 'text-text-primary'}`}>
                                      {r.bp_systolic || '--'}<span className="opacity-20 mx-1">/</span>{r.bp_diastolic || '--'}
                                   </div>
                                </td>
                                <td className="p-5">
                                   <div className="flex items-center gap-4">
                                      <div className={`flex flex-col ${r.blood_sugar && (r.blood_sugar > 140 || r.blood_sugar < 70) ? 'text-red-500' : ''}`}>
                                         <div className="text-base font-black tabular-nums">{r.blood_sugar || '--'}</div>
                                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">mg/dL</div>
                                      </div>
                                      <div className="w-px h-6 bg-border-light/50" />
                                      <div className="flex flex-col">
                                         <div className="text-base font-black tabular-nums">{r.pulse || '--'}</div>
                                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">BPM</div>
                                      </div>
                                   </div>
                                </td>
                                <td className="p-5">
                                   <div className="text-sm font-black text-text-primary tabular-nums">{r.weight || '--'} <span className="text-[10px] text-text-tertiary">kg</span></div>
                                </td>
                                <td className="p-5 text-right">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                      <button onClick={() => handleEditVitalsTrigger(r)} className="p-3 rounded-xl bg-white border border-border-light text-text-tertiary hover:text-gold hover:border-gold/30 shadow-sm transition-all"><Edit3 size={16}/></button>
                                      <button onClick={() => handleDeleteReading(r.id)} className="p-3 rounded-xl bg-white border border-border-light text-text-tertiary hover:text-danger hover:border-danger/30 shadow-sm transition-all"><Trash2 size={16}/></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                </div>
                {readings.filter(r => r.member_id === activeMember.id).length === 0 && (
                   <div className="text-center py-12 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50 border-2 border-dashed border-border-light rounded-[2rem] mt-4">
                      {t('HEALTH_ZERO_RECORDS')}
                   </div>
                )}

               {/* Vaccination Ledger */}
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Syringe size={16} className="text-success" /> {t('HEALTH_IMMUNIZATION')}
                     </h3>
                     <button 
                        onClick={() => {
                          const vName = window.prompt("Vaccine Name (e.g., Covaxin, Flu Shot):");
                          if (!vName) return;
                          const vDate = window.prompt("Date Taken (YYYY-MM-DD):") || new Date().toISOString().split('T')[0];
                          const vProvider = window.prompt("Provider (e.g., Apollo Hospital):") || "Local Clinic";
                          const vNext = window.prompt("Next Due (optional, YYYY-MM-DD):") || "";
                          addVaccination({ member_id: activeMember.id, name: vName, date: vDate, provider: vProvider, next_due_date: vNext, notes: "" });
                        }}
                        className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline"
                     >
                        {t('HEALTH_ADD_DOSE')}
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vaccinations.filter(v => v.member_id === activeMember.id).map(v => (
                       <div key={v.id} className="p-5 bg-bg-tertiary border border-border-light rounded-2xl group relative">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-success border border-border-light">
                                  <ShieldCheck size={20} />
                               </div>
                               <div>
                                  <div className="text-sm font-black text-text-primary">{v.name}</div>
                                  <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-60">Taken on {new Date(v.date || '').toLocaleDateString()}</div>
                               </div>
                            </div>
                            <button onClick={() => deleteVaccination(v.id)} className="opacity-0 group-hover:opacity-100 p-2 text-danger"><Trash2 size={14}/></button>
                          </div>
                          {v.next_due_date && (
                            <div className="mt-4 pt-4 border-t border-border-light/40 flex items-center justify-between">
                               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Next Due</span>
                               <span className="text-[9px] font-black text-gold-text uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10">{v.next_due_date}</span>
                            </div>
                          )}
                       </div>
                    ))}
                  </div>
                  {vaccinations.filter(v => v.member_id === activeMember.id).length === 0 && (
                    <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-40">{t('HEALTH_NO_IMMUNIZATION')}</div>
                  )}
               </div>

               {/* Rx Prescription Management */}
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <PillIcon size={16} className="text-gold" /> Active Prescriptions (Rx)
                     </h3>
                     <button 
                        onClick={() => setShowRxForm(true)}
                        className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline"
                     >
                        + Add Rx
                     </button>
                  </div>
                  <div className="space-y-3">
                     {prescriptions.filter(m => m.member_id === activeMember.id && !m.end_date).map((rx, i) => (
                        <div key={rx.id} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl group">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-xl bg-white border border-border-light flex items-center justify-center text-gold-text shadow-sm">
                                 <Pill size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-black text-text-primary flex items-center gap-2">
                                    {rx.generic_name} {rx.dosage && <span className="opacity-40 text-xs">{rx.dosage}</span>}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className="text-[9px] font-black bg-white border border-border-light px-1.5 rounded">{rx.schedule_code}</div>
                                    <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.1em]">{rx.meal_instruction === 'AC' ? 'Khali Pet' : rx.meal_instruction === 'PC' ? 'Khane Ke Baad' : rx.meal_instruction}</div>
                                    <div className="text-[8px] font-bold text-text-tertiary opacity-50 ml-2">by Dr. {rx.doctor_name || 'General'}</div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button onClick={() => stopPrescription(rx.id)} className="text-[9px] text-danger font-black uppercase bg-white border border-border-light px-3 py-1.5 rounded-lg hover:bg-danger hover:text-white transition-all">Stop</button>
                              <button onClick={() => deletePrescription(rx.id)} className="opacity-0 group-hover:opacity-100 p-2 text-text-tertiary"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     ))}
                     {prescriptions.filter(m => m.member_id === activeMember.id && !m.end_date).length === 0 && (
                        <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                           No active Rx
                        </div>
                     )}
                  </div>
               </div>
             </div>
          </div>
        </motion.div>
        )}

        {/* SOS Edit View */}
        {view === 'sos-edit' && activeMember && (
          <motion.div
            key="sos-edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6 max-w-2xl mx-auto"
          >
            <div className="bg-white border border-border-light rounded-[2.5rem] p-10 shadow-2xl">
               <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                        <AlertCircle size={32} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">{t('HEALTH_SOS_PROFILE')}</h2>
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">{activeMember.name}</p>
                     </div>
                  </div>
                  <button onClick={() => setView('member-report')} className="p-3 bg-bg-tertiary rounded-2xl text-text-tertiary"><X size={20}/></button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_BLOOD_GROUP')}</label>
                     <select value={sosBlood} onChange={e => setSosBlood(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-xl font-black text-text-primary outline-none focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_ALLERGIES')}</label>
                     <input type="text" value={sosAllergies} onChange={e => setSosAllergies(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Penicillin, etc." />
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_CHRONIC')}</label>
                     <input type="text" value={sosChronic} onChange={e => setSosChronic(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Asthma, Diabetes, BP, etc." />
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_PRIM_DOC')}</label>
                     <input type="text" value={sosDoctor} onChange={e => setSosDoctor(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Dr. Sharma" />
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_EMERGENCY_CONTACT')}</label>
                     <input type="text" value={sosEmergency} onChange={e => setSosEmergency(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="+91 99..." />
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_INSURANCE')}</label>
                     <input type="text" value={sosInsurance} onChange={e => setSosInsurance(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Policy #, Provider Name" />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('HEALTH_SURGERY')}</label>
                     <input type="text" value={advSurgery} onChange={e => setAdvSurgery(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Past operations, year" />
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">Family Health History</label>
                     <input type="text" value={advFamily} onChange={e => setAdvFamily(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-red-500 transition-all" placeholder="Genetic conditions (e.g. Heart disease)" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-8 border-t border-dashed border-border-light bg-gold-light/10 rounded-[2.5rem]">
                  <div className="md:col-span-2">
                     <h3 className="text-lg font-black text-text-primary tracking-tight">{t('HEALTH_AYURVEDA_ID')}</h3>
                     <p className="text-[10px] uppercase font-black tracking-widest mt-1 text-gold-text">{t('HEALTH_PRAKRITI')}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] pl-2">{t('HEALTH_PRAKRITI')}</label>
                     <select value={advPrakriti} onChange={e => setAdvPrakriti(e.target.value)} className="w-full bg-white border border-gold/30 rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-gold transition-all appearance-none cursor-pointer">
                        <option value="">Select Primary Dosha</option>
                        <option value="vata">Vata (Air/Space) - Light, Active, Dry</option>
                        <option value="pitta">Pitta (Fire/Water) - Heat, Sharp, Intense</option>
                        <option value="kapha">Kapha (Earth/Water) - Heavy, Slow, Steady</option>
                        <option value="tridoshic">Tridoshic (Balanced)</option>
                     </select>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] pl-2">{t('HEALTH_AGNI')}</label>
                     <select value={advAgni} onChange={e => setAdvAgni(e.target.value)} className="w-full bg-white border border-gold/30 rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-gold transition-all appearance-none cursor-pointer">
                        <option value="">Select Digestion Type</option>
                        <option value="sama">Sama (Balanced, Regular)</option>
                        <option value="vishama">Vishama (Irregular, Gas, Vata-based)</option>
                        <option value="tikshna">Tikshna (Sharp, Acidic, Pitta-based)</option>
                        <option value="manda">Manda (Slow, Sluggish, Kapha-based)</option>
                     </select>
                  </div>

                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] pl-2">{t('HEALTH_DIET')}</label>
                     <select value={advDiet} onChange={e => setAdvDiet(e.target.value)} className="w-full bg-white border border-gold/30 rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-gold transition-all appearance-none cursor-pointer">
                        <option value="">Select Diet Style</option>
                        <option value="sattvik">Sattvik (Pure, Fresh, Veg)</option>
                        <option value="rajasik">Rajasik (Spicy, Stimulating)</option>
                        <option value="tamasik">Tamasik (Heavy, Processed, Non-Veg)</option>
                     </select>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-black text-gold-text uppercase tracking-[0.3em] pl-2">{t('HEALTH_TREATMENT')}</label>
                     <input type="text" value={advTreatment} onChange={e => setAdvTreatment(e.target.value)} className="w-full bg-white border border-gold/30 rounded-2xl p-5 text-lg font-black text-text-primary outline-none focus:border-gold transition-all" placeholder="e.g. Triphala, Physiotherapy" />
                  </div>
               </div>

               <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => {
                      const profilePayload = {
                        member_id: activeMember.id,
                        bloodGroup: sosBlood,
                        allergies: sosAllergies,
                        chronic: sosChronic,
                        doctor: sosDoctor,
                        emergencyContact: sosEmergency,
                        insurance: sosInsurance
                      };

                      const advancedPayload = {
                        member_id: activeMember.id,
                        prakriti: advPrakriti,
                        agni: advAgni,
                        diet: advDiet,
                        surgical_history: advSurgery,
                        family_history: advFamily,
                        current_treatment: advTreatment
                      };

                      updateMedicalProfile(profilePayload);
                      updateAdvancedProfile(advancedPayload);
                      setView('member-report');
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black tracking-[0.2em] h-16 rounded-2xl shadow-xl transition-all uppercase flex items-center justify-center gap-3"
                  >
                    <Save size={20} /> {t('HEALTH_SAVE_VAULT')}
                  </button>
                  <button onClick={() => setView('member-report')} className="px-8 bg-bg-tertiary hover:bg-border-light/50 transition-all text-text-tertiary font-black rounded-2xl">Cancel</button>
               </div>
            </div>
          </motion.div>
        )}
      
        {/* Sliding Rx Form Modal */}
        {showRxForm && activeMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
             <div className="bg-bg-primary w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl border border-border-light relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                   <div>
                     <h2 className="text-xl font-black text-text-primary tracking-tight">{t('HEALTH_ADD_RX')}</h2>
                     <p className="text-[10px] font-black text-gold-text uppercase tracking-widest mt-1">Sovereign OS Profile</p>
                   </div>
                   <button onClick={() => setShowRxForm(false)} className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary hover:text-danger"><X size={18}/></button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Doctor / Hospital</label>
                        <input value={rxDoc} onChange={e=>setRxDoc(e.target.value)} type="text" placeholder="Dr. Sharma / Apollo" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Medicine Type</label>
                        <select value={rxType} onChange={e=>setRxType(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold appearance-none">
                           <option value="Tablet">Tablet / Capsule</option>
                           <option value="Syrup">Syrup / Liquid</option>
                           <option value="Injection">Injection</option>
                           <option value="Ointment">Ointment / Drops</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-danger uppercase tracking-widest pl-1">Generic Name (Required)</label>
                        <input value={rxGen} onChange={e=>setRxGen(e.target.value)} type="text" placeholder="e.g. Paracetamol" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold uppercase outline-none focus:border-gold" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Brand Name (Optional)</label>
                        <input value={rxBrand} onChange={e=>setRxBrand(e.target.value)} type="text" placeholder="e.g. Dolo 650" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold uppercase outline-none focus:border-gold" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Schedule</label>
                        <select value={rxSch} onChange={e=>setRxSch(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-black outline-none focus:border-gold appearance-none">
                           <option value="1-0-1">1-0-1</option>
                           <option value="1-1-1">1-1-1</option>
                           <option value="1-0-0">1-0-0</option>
                           <option value="0-0-1">0-0-1</option>
                           <option value="SOS">SOS (As needed)</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Meal Timing</label>
                        <select value={rxMeal} onChange={e=>setRxMeal(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-black outline-none focus:border-gold appearance-none">
                           <option value="PC">PC - Khane Ke Baad</option>
                           <option value="AC">AC - Khali Pet</option>
                           <option value="ANY">Anytime</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Dosage</label>
                        <input value={rxDose} onChange={e=>setRxDose(e.target.value)} type="text" placeholder="500mg" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Purpose / Notes</label>
                     <input value={rxPurp} onChange={e=>setRxPurp(e.target.value)} type="text" placeholder="Fever / Body Ache" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                  </div>

                  <button 
                     disabled={!rxGen}
                     onClick={() => {
                        addPrescription({
                           member_id: activeMember.id,
                           doctor_name: rxDoc,
                           generic_name: rxGen,
                           brand_name: rxBrand,
                           medicine_type: rxType,
                           dosage: rxDose,
                           schedule_code: rxSch,
                           meal_instruction: rxMeal,
                           purpose: rxPurp
                        });
                        setShowRxForm(false);
                        setRxGen(''); setRxBrand(''); setRxPurp('');
                     }}
                     className="w-full mt-4 bg-gold-text disabled:opacity-50 hover:bg-gold text-white font-black uppercase tracking-[0.2em] h-14 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                     <ShieldCheck size={18} /> {t('HEALTH_SAVE_VAULT')}
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </ModuleShell>
  );
}
