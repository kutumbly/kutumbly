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
import { useSewak } from '@/modules/sewak';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import GlassCard from '../ui/GlassCard';
import EmptyState from '../ui/EmptyState';
import { Briefcase, UserCheck, CalendarDays, Wallet, UserMinus, UserPlus, Phone, History, MoreHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RupeesDisplay from '../ui/RupeesDisplay';
import { useTranslation, Language } from '@/lib/i18n';
import { SewakMember, SewakPayment, SewakAttendance } from '@/types/db';

type SewakView = 'overview' | 'staff-ledger';

/**
 * Premium Attendance Heatmap
 * Renders a GitHub-style activity grid for staff attendance
 */
const AttendanceHeatmap = ({ attendance, days = 30, t }: { attendance: SewakAttendance[], days?: number, t: any }) => {
  const lastNDays = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="flex gap-1 items-center">
      {lastNDays.map((date) => {
        const record = attendance.find(a => a.date === date);
        const status = record?.status || 'unmarked';
        
        let color = 'bg-bg-tertiary border-border-light/30';
        if (status === 'present') color = 'bg-text-success border-text-success/20';
        if (status === 'absent' || status === 'absent_unpaid') color = 'bg-text-danger border-text-danger/20';
        
        const statusLabel = 
          status === 'present' ? t('sewak.status_present') : 
          (status === 'absent' || status === 'absent_unpaid') ? t('sewak.status_absent') : 
          t('sewak.status_unmarked');

        return (
          <div 
            key={date} 
            title={`${date}: ${statusLabel}`}
            className={`w-2.5 h-6 rounded-[4px] border ${color} transition-all duration-300 hover:scale-110`}
          />
        );
      })}
    </div>
  );
};


export default function SewakModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const { staff, payments, attendance, advances, welfare, documents, addStaff, removeStaff, paySalary, grantAdvance, calculatePayout, markAttendance, issueWelfare, addDocument, purgeStaff, allStaff } = useSewak();
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [fName, setFName] = React.useState('');
  const [fRole, setFRole] = React.useState('Ghar Sahayak (Maid)');
  const [fVetan, setFVetan] = React.useState('');
  const [fPhone, setFPhone] = React.useState('');
  const [fShift, setFShift] = React.useState('Full-Time (8hr)');
  const [fEmergency, setFEmergency] = React.useState('');

  const handleAdd = () => {
    if (!fName || !fVetan) return;
    addStaff(fName, fRole, Number(fVetan), fPhone, fEmergency, fShift);
    setShowAddForm(false);
    setFName('');
    setFVetan('');
    setFPhone('');
    setFShift('Full-Time (8hr)');
    setFEmergency('');
  };

  const totalMonthlyPayout = staff.reduce((acc: number, s: SewakMember) => acc + s.salary, 0);
  const presentToday = attendance.filter((a: SewakAttendance) => a.date === new Date().toISOString().slice(0, 10) && a.status === 'present').length;

  const [view, setView] = React.useState<SewakView>('overview');
  const [activeStaff, setActiveStaff] = React.useState<SewakMember | null>(null);

  const getBreadcrumbs = () => {
    const b = [t('SUPPORT_STAFF')];
    if (view === 'staff-ledger') b.push(activeStaff?.name || '');
    return b;
  };

  const handleBack = () => {
    if (view === 'staff-ledger') setView('overview');
  };

  const handleMarkAttendance = (sewak_id: string, status: 'present' | 'absent' | 'absent_unpaid') => {
    const today = new Date().toISOString().slice(0, 10);
    markAttendance(sewak_id, today, status);
  };

  const handleIssueWelfare = (sewak_id: string) => {
    const type = window.prompt("Welfare Type (Festival_Bonus, School_Fees, Medical, Other):", "Festival_Bonus");
    if (!type) return;
    const amt = window.prompt("Enter Amount (₹):");
    if (!amt || isNaN(Number(amt))) return;
    
    issueWelfare(sewak_id, type, Number(amt), "Manual Welfare Issue");
    alert("Welfare record successfully sealed in vault!");
  };

  const handleAddDocument = (sewak_id: string) => {
    const type = window.prompt("Document Type (Police_Verification, Aadhaar, Agency_Contract, Other):", "Police_Verification");
    if (!type) return;
    const ref = window.prompt("Document Reference/ID:");
    if (!ref) return;
    
    addDocument(sewak_id, type, ref);
    alert("Document reference securely vaulted!");
  };

  const handleProcessPay = (sewak_id: string) => {
    const targetMonth = window.prompt("Enter exact month to pay (YYYY-MM):", new Date().toISOString().slice(0, 7));
    if (!targetMonth) return;
    
    // Execute Hook Calculation Matrix
    const totals = calculatePayout(sewak_id, targetMonth);
    const breakdownMsg = 
      `Payroll Breakdown for ${targetMonth}:\n\n` +
      `Gross Vetan: Rs ${totals.gross.toFixed(2)}\n` +
      `Bin-vetan (Unpaid) Leave Deductions: -Rs ${totals.deductions.toFixed(2)}\n` +
      `Khata (Advance) Recovery: -Rs ${totals.advanceRecovered.toFixed(2)}\n\n` +
      `NET VETAN: Rs ${totals.net.toFixed(2)}\n\n` +
      `Process this formally?`;

    if (window.confirm(breakdownMsg)) {
       paySalary(sewak_id, targetMonth, totals.gross, totals.net, totals.advanceRecovered);
       alert("Vetan documented into ledger successfully!");
    }
  };

  const handleShareReceipt = (p: SewakPayment) => {
    const s = staff.find(member => member.id === p.sewak_id);
    if (!s) return;

    const receipt = `
🏛️ *KUTUMBLY VETAN SLIP*
----------------------------
👤 *Staff:* ${s.name}
📅 *Month:* ${p.month}
📅 *Paid on:* ${p.paid_on}

💰 *Gross Salary:* ₹${p.gross.toLocaleString()}
📉 *Khata Recovery:* -₹${p.advance.toLocaleString()}
----------------------------
✅ *NET PAID:* ₹${p.net.toLocaleString()}
----------------------------
🏦 *Remaining Khata:* ₹${(s.advance_balance || 0).toLocaleString()}

*"Memory, Not Code."*
    `.trim();

    navigator.clipboard.writeText(receipt);
    alert("Vetan Slip copied to clipboard! You can now paste it in WhatsApp.");
  };


  return (
    <ModuleShell 
      variant="glass"
      title={
         view === 'overview' ? t('SUPPORT_STAFF') :
         `${activeStaff?.name} Ledger`
      }
      subtitle={view === 'overview' ? (lang === 'en' ? "Managing household Karmcharis and payroll" : "Ghar ke parivaar sam sahayakon ka hisab") : undefined}
      onAdd={showAddForm || view === 'staff-ledger' ? undefined : () => setShowAddForm(true)}
      addLabel={view === 'overview' ? t('ONBOARD_STAFF') : undefined}
      breadcrumbs={view !== 'overview' && !showAddForm ? getBreadcrumbs() : undefined}
      onBack={showAddForm ? () => setShowAddForm(false) : (view !== 'overview' ? handleBack : undefined)}
    >
      {showAddForm ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full bg-bg-secondary hover:bg-gold/10">
              <ArrowLeft className="w-5 h-5 text-text-tertiary" />
            </button>
            <h2 className="text-xl font-bold text-text-primary">
              {t('ONBOARD_STAFF')}
            </h2>
          </div>

          <div className="card p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{t('FULL_NAME')}</label>
              <input type="text" value={fName} onChange={e => setFName(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder="e.g. Ramesh Kumar" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Kaam (Role)' : 'Role'}</label>
              <div className="flex flex-wrap gap-2">
                {['Ghar Sahayak (Maid)', 'Rasoiya (Cook)', 'Driver', 'Mali (Gardener)', 'Nanny', 'Other'].map(r => (
                  <button key={r} onClick={() => setFRole(r)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${fRole === r ? 'bg-gold/10 text-gold border-gold/30' : 'bg-bg-secondary text-text-tertiary border-border-light'}`}>{r}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{t('MONTHLY_SALARY')}</label>
              <input type="number" value={fVetan} onChange={e => setFVetan(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="₹0.00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Phone Number' : 'Phone'}</label>
              <input type="tel" value={fPhone} onChange={e => setFPhone(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder="+91" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Samay (Shift)' : 'Shift Timing'}</label>
                <select value={fShift} onChange={e => setFShift(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold appearance-none">
                  <option>Full-Time (8hr)</option>
                  <option>Morning (7-11 AM)</option>
                  <option>Evening (4-8 PM)</option>
                  <option>Part-Time</option>
                  <option>Live-In</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Emergency Ph.' : 'Emergency Contact'}</label>
                <input type="tel" value={fEmergency} onChange={e => setFEmergency(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder="SOS Number" />
              </div>
            </div>

            <button onClick={handleAdd} disabled={!fName || !fVetan} className="w-full mt-4 bg-gold hover:opacity-90 text-white font-bold h-14 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {t('SAVE_TO_VAULT')}
            </button>
          </div>
        </div>
      ) : (
      <AnimatePresence mode="wait">
        {view === 'overview' && !showAddForm && (
        <motion.div 
           key="overview"
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           className="space-y-8"
        >
        
        {/* Payroll & Attendance Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <MetricCard label={t('SUPPORT_STAFF')} value={staff.length} unit={t('sewak.members_unit')} status="info" />
           <MetricCard label={t('PRESENT')} value={`${presentToday}/${staff.length}`} status="success" />
           <MetricCard label={t('MONTHLY_PAYOUT')} value={totalMonthlyPayout} isCurrency status="default" />
           <MetricCard label={t('sewak.total_advance')} value={staff.reduce((acc, s) => acc + (s.advance_balance || 0), 0)} isCurrency status="warning" />
        </div>

        {/* Staff Roster */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
             {t('STAFF_ROSTER')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.length > 0 ? staff.map((s: SewakMember, i: number) => {
               const initials = s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
               const sAtt = attendance.filter((a: SewakAttendance) => a.sewak_id === s.id);
               const pPercentage = sAtt.length > 0 ? (sAtt.filter((a: SewakAttendance) => a.status === 'present').length / sAtt.length) * 100 : 100;

               return (
                <GlassCard 
                   key={String(s.id)}
                   onClick={() => { setActiveStaff(s); setView('staff-ledger'); }}
                   hover
                   glow="gold"
                   className="p-6 group relative"
                >
                   <div className="flex items-center gap-5 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border-2 border-border-light flex items-center justify-center font-black text-xl text-text-secondary group-hover:bg-gold/10 group-hover:text-gold group-hover:border-gold/20 transition-all shadow-inner">
                        {initials}
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-center">
                             <h4 className="text-base font-black text-text-primary tracking-tight flex items-center gap-2">
                               {s.name}
                               {s.kyc_status === 'PENDING' ? (
                                 <span className="text-[8px] px-1.5 py-0.5 rounded bg-text-danger/10 text-text-danger border border-text-danger/20 uppercase tracking-widest font-black">
                                   {t('sewak.kyc_pending')}
                                 </span>
                               ) : s.kyc_status === 'VERIFIED' ? (
                                 <span className="text-[8px] px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20 uppercase tracking-widest font-black">
                                   {t('sewak.kyc_verified')}
                                 </span>
                               ) : null}
                             </h4>
                             <div className="flex items-center gap-2">
                                {attendance.find(a => a.sewak_id === s.id && a.date === new Date().toISOString().slice(0, 10))?.status === 'present' ? (
                                   <span className="text-[9px] font-black bg-bg-success text-text-success px-2.5 py-1 rounded-full uppercase tracking-widest border border-text-success/10">{t('sewak.status_present')}</span>
                                ) : (
                                   <span className="text-[9px] font-black bg-bg-tertiary text-text-tertiary px-2.5 py-1 rounded-full uppercase tracking-widest border border-border-light/30">{t('sewak.status_unmarked')}</span>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); removeStaff(s.id); }} className="text-text-tertiary hover:text-text-danger transition-colors p-1 opacity-0 group-hover:opacity-100">
                                   <MoreHorizontal size={14} />
                                </button>
                             </div>
                          </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">
                            {s.role} · {t('sewak.since')} {s.join_date.slice(0, 4)}
                         </p>
                      </div>
                   </div>

                   <div className="mb-5 p-2 bg-text-tertiary/5 rounded-lg border border-border-light/30">
                      <div className="flex justify-between items-center mb-2 px-1">
                         <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{t('sewak.attendance_history')}</span>
                         <span className="text-[8px] font-black text-text-success uppercase tracking-widest">{pPercentage.toFixed(0)}%</span>
                      </div>
                      <AttendanceHeatmap attendance={sAtt} days={14} t={t} />
                   </div>


                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-bg-secondary rounded-xl border border-border-light/50">
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('MONTHLY_PAYOUT')}</div>
                         <div className="text-sm font-black text-text-primary tabular-nums">
                            <RupeesDisplay amount={s.salary} />
                         </div>
                      </div>
                      <div className="p-3 bg-bg-secondary rounded-xl border border-border-light/50">
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('ATTENDANCE')}</div>
                         <div className="text-sm font-black text-text-success tabular-nums">{pPercentage.toFixed(0)}%</div>
                      </div>
                   </div>

                   <div className="flex gap-2">
                       <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkAttendance(s.id, 'present'); }}
                          className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-bg-primary border border-border-light hover:border-success hover:text-success hover:bg-success/5 transition-all shadow-sm active:scale-95"
                       >
                          + {t('sewak.mark_upasthit')}
                       </button>
                       <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkAttendance(s.id, 'absent_unpaid'); }}
                          className="px-3 py-2 rounded-xl text-text-danger border border-border-light hover:bg-danger/10 hover:border-danger/30 transition-all active:scale-95 shadow-sm"
                          title={t('sewak.mark_anupasthit')}
                       >
                          <UserMinus size={16} />
                       </button>
                   </div>
                </GlassCard>
               );
             }) : (
               <div className="col-span-1 md:col-span-2">
                 <EmptyState 
                   icon={Briefcase} 
                   title={t('sewak.empty_staff')}
                 />
               </div>
             )}
          </div>
        </section>

        {/* Vetan History */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">
               {t('PAYMENT_HISTORY')}
            </div>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
               {t('VIEW_HISTORY')} <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="card divide-y divide-border-light/30">
             {payments.length > 0 ? payments.map((p: SewakPayment, i: number) => (
                <div key={p.id} className="p-5 flex justify-between items-center group hover:bg-bg-secondary transition-all">
                   <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-bg-success/5 text-text-success flex items-center justify-center border border-text-success/10 group-hover:bg-text-success group-hover:text-white transition-all shadow-inner">
                         <Wallet size={20} />
                      </div>
                      <div>
                         <div className="text-sm font-black text-text-primary tracking-tight">
                           {allStaff.find((s: SewakMember) => s.id === p.sewak_id)?.name || t('sewak.former_staff')}
                         </div>
                         <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-0.5">
                           {t('sewak.month_of')} {p.month} · Paid on {p.paid_on}
                         </div>
                      </div>
                   </div>
                    <div className="text-right flex items-center gap-4">
                       <div>
                          <div className="text-sm font-black text-text-primary tabular-nums">
                             <RupeesDisplay amount={p.net} />
                          </div>
                          {p.advance > 0 && (
                            <div className="text-[8px] font-bold text-text-danger uppercase tracking-tighter">
                               -₹{p.advance} {t('sewak.khata_adj')}
                            </div>
                          )}
                       </div>
                       <button 
                          onClick={() => handleShareReceipt(p)}
                          className="p-2 rounded-lg bg-bg-secondary text-text-tertiary border border-border-light group-hover:text-gold group-hover:border-gold/30 transition-all shadow-sm"
                          title="Share Slip"
                       >
                          <History size={16} />
                       </button>
                    </div>
                 </div>
             )) : (
                <EmptyState 
                   icon={Wallet} 
                   title={t('sewak.empty_payments')}
                />
             )}
           </div>
          </section>

        </motion.div>
        )}

        {/* Level 2: Staff Ledger Drill Down */}
        {view === 'staff-ledger' && activeStaff && !showAddForm && (
        <motion.div
           key="staff-ledger"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <GlassCard className="md:col-span-1 p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-3xl bg-gold-light border-2 border-border-light flex items-center justify-center font-black text-text-tertiary text-3xl mb-6 shadow-sm">
                   <Briefcase size={40} />
                 </div>
                 <h2 className="text-2xl font-black text-text-primary tracking-tight">{activeStaff.name}</h2>
                 <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-2 opacity-80">{activeStaff.role} • {activeStaff.phone}</p>
                 <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {activeStaff.shift_timing ? (
                       <span className="bg-bg-tertiary text-text-tertiary border border-border-light px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{activeStaff.shift_timing}</span>
                    ) : (
                       <span className="bg-bg-tertiary/50 text-text-tertiary/50 border border-border-light/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-dashed">No Shift Formally Set</span>
                    )}
                    {activeStaff.emergency_contact ? (
                       <span className="bg-text-danger/5 text-text-danger border border-text-danger/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Phone size={10} /> {activeStaff.emergency_contact}</span>
                    ) : (
                       <span className="bg-text-danger/5 text-text-danger/50 border border-text-danger/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border-dashed"><Phone size={10} /> Missing SOs</span>
                    )}
                 </div>
                 <div className="mt-8 pt-8 border-t border-border-light/50 w-full grid grid-cols-2 gap-4 divide-x divide-border-light/50">
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('sewak.payout')}</div>
                       <div className="text-xl font-black text-text-primary tabular-nums">₹{activeStaff.salary.toLocaleString()}</div>
                    </div>
                     <div>
                        <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{t('sewak.status')}</div>
                        <div className={`text-sm font-black uppercase mt-2 ${activeStaff.kyc_status === 'VERIFIED' ? 'text-success' : 'text-warning'}`}>
                           {activeStaff.kyc_status === 'VERIFIED' ? t('sewak.kyc_verified') : t('sewak.status_unmarked')}
                        </div>
                     </div>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-border-light/50 w-full">
                    <div className="bg-warning/5 border border-warning/10 rounded-2xl p-4 flex justify-between items-center">
                       <div>
                          <div className="text-[9px] font-black text-warning uppercase tracking-widest leading-none">{t('sewak.khata_balance')}</div>
                          <div className="text-lg font-black text-text-primary mt-1">₹{(activeStaff.advance_balance || 0).toLocaleString()}</div>
                       </div>
                       <button 
                          onClick={() => {
                             const amt = window.prompt("Enter Advance Amount to Issue (₹):");
                             if (amt && !isNaN(Number(amt))) {
                               (grantAdvance as any)(activeStaff.id, Number(amt));
                               alert("Advance securely logged to Khata!");
                             }
                          }}
                          className="bg-warning text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-sm hover:opacity-90">
                          + {t('sewak.issue')}
                       </button>
                    </div>
                 </div>
                  <div className="mt-4 pt-4 border-t border-border-light/50 w-full">
                     <div className="bg-text-success/5 border border-text-success/10 rounded-2xl p-4 flex justify-between items-center text-left">
                        <div>
                           <div className="text-[9px] font-black text-text-success uppercase tracking-widest leading-none">{t('sewak.vault_status')}</div>
                           <div className="text-sm font-black text-text-primary mt-1 flex items-center gap-2">
                              {documents.filter(d => d.sewak_id === activeStaff.id).length} {t('sewak.saved_docs')}
                           </div>
                        </div>
                        <button 
                           onClick={() => handleAddDocument(activeStaff.id)}
                           className="bg-text-success text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-sm hover:opacity-90">
                           {t('sewak.vault')}
                        </button>
                     </div>
                  </div>
             </GlassCard>

             <div className="md:col-span-2 space-y-6">
               <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Wallet size={16} className="text-gold" /> {t('sewak.payout_history')}
                     </h3>
                     <button
                        onClick={() => handleProcessPay(activeStaff.id)}
                        className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg active:scale-95 border border-gold-text/20 bg-gold-text/5"
                     >
                        + {t('sewak.process_vetan_btn')}
                     </button>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-border-light bg-bg-tertiary">
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tl-xl">Month</th>
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">Paid On</th>
                           <th className="p-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] rounded-tr-xl text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody>
                        {payments.filter(p => p.sewak_id === activeStaff.id).map((p, i) => (
                           <tr key={p.id} className="border-b border-border-light/50 hover:bg-bg-tertiary transition-colors group">
                              <td className="p-4 text-xs font-bold text-text-secondary uppercase">{p.month}</td>
                              <td className="p-4 text-xs font-bold text-text-secondary">{p.paid_on}</td>
                              <td className="p-4 text-sm font-black text-text-primary text-right">₹{p.net.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {payments.filter(p => p.sewak_id === activeStaff.id).length === 0 && (
                     <EmptyState className="py-6" icon={Wallet} title={t('sewak.empty_payments')} />
                  )}
               </GlassCard>
               
               <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <CalendarDays size={16} className="text-info" /> {t('sewak.attendance_history')}
                     </h3>
                     <div className="flex items-center gap-4">
                        <AttendanceHeatmap attendance={attendance.filter(a => a.sewak_id === activeStaff.id)} days={20} t={t} />
                        <button 
                           onClick={() => handleMarkAttendance(activeStaff.id, 'present')}
                           className="text-[9px] font-black text-info uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg active:scale-95 border border-info/20 bg-info/5"
                        >
                           + {t('sewak.mark_upasthit')}
                        </button>
                     </div>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                     {attendance.filter(a => a.sewak_id === activeStaff.id).map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl">
                           <div className="text-sm font-bold text-text-primary">{a.date}</div>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${a.status === 'present' ? 'bg-success/5 text-success border-success/10' : a.status === 'absent' ? 'bg-danger/5 text-danger border-danger/10' : 'bg-warning/5 text-warning border-warning/10'}`}>
                              {a.status}
                           </span>
                        </div>
                     ))}
                     {attendance.filter(a => a.sewak_id === activeStaff.id).length === 0 && (
                        <EmptyState className="py-6" icon={CalendarDays} title={t('sewak.empty_attendance')} />
                     )}
                  </div>
               </GlassCard>
               
               <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <History size={16} className="text-warning" /> {t('sewak.khata_ledger')}
                     </h3>
                  </div>
                  <div className="space-y-3">
                     {advances.filter(a => a.sewak_id === activeStaff.id).map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl">
                           <div>
                             <div className="text-sm font-bold text-text-primary">{a.date}</div>
                             <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-70">{a.reason}</div>
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${a.amount > 0 ? 'bg-warning/5 text-warning border-warning/10' : 'bg-success/5 text-success border-success/10'}`}>
                              {a.amount > 0 ? 'ISSUED ' : 'RECOVERED '}
                              ₹{Math.abs(a.amount).toLocaleString()}
                           </span>
                        </div>
                     ))}
                     {advances.filter(a => a.sewak_id === activeStaff.id).length === 0 && (
                        <EmptyState className="py-6" icon={History} title={t('sewak.empty_khata')} />
                     )}
                  </div>
               </GlassCard>

               <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <UserPlus size={16} className="text-info" /> {t('sewak.welfare_records')}
                     </h3>
                     <button 
                        onClick={() => handleIssueWelfare(activeStaff.id)}
                        className="text-[9px] font-black text-info uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg active:scale-95 border border-info/20 bg-info/5"
                     >
                        + {t('sewak.issue_welfare_btn')}
                     </button>
                  </div>
                  <div className="space-y-3">
                     {welfare.filter(w => w.sewak_id === activeStaff.id).map((w, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl">
                           <div>
                             <div className="text-sm font-bold text-text-primary">{w.event_date}</div>
                             <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-70 border border-border-light px-1.5 rounded bg-bg-secondary w-fit">{w.welfare_type.replace('_', ' ')}</div>
                           </div>
                           <span className="text-lg font-black text-text-primary tabular-nums tracking-tight">
                              ₹{w.amount.toLocaleString()}
                           </span>
                        </div>
                     ))}
                     {welfare.filter(w => w.sewak_id === activeStaff.id).length === 0 && (
                        <EmptyState className="py-6" icon={UserPlus} title={t('sewak.empty_welfare')} compact/>
                     )}
                  </div>
               </GlassCard>
               
             </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      )}
    </ModuleShell>
  );
}
