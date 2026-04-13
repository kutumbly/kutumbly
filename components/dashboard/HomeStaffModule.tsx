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
import { useStaff } from '@/hooks/useStaff';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { Briefcase, UserCheck, CalendarDays, Wallet, UserMinus, UserPlus, Phone, History, MoreHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RupeesDisplay from '../ui/RupeesDisplay';
import { StaffMember, SalaryPayment, AttendanceRecord } from '@/types/db';

type StaffView = 'overview' | 'staff-ledger';

export default function HomeStaffModule() {
  const { lang } = useAppStore();
  const { staff, payments, attendance, addStaff, removeStaff, paySalary } = useStaff();
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [fName, setFName] = React.useState('');
  const [fRole, setFRole] = React.useState('Housemaid');
  const [fSalary, setFSalary] = React.useState('');
  const [fPhone, setFPhone] = React.useState('');

  const handleAdd = () => {
    if (!fName || !fSalary) return;
    addStaff(fName, fRole, Number(fSalary), fPhone);
    setShowAddForm(false);
    setFName('');
    setFSalary('');
    setFPhone('');
  };

  const totalMonthlyPayout = staff.reduce((acc: number, s: StaffMember) => acc + s.salary, 0);
  const presentToday = attendance.filter((a: AttendanceRecord) => a.date === new Date().toISOString().slice(0, 10) && a.status === 'present').length;

  const [view, setView] = React.useState<StaffView>('overview');
  const [activeStaff, setActiveStaff] = React.useState<StaffMember | null>(null);

  const getBreadcrumbs = () => {
    const b = [lang === 'en' ? "Staff" : "Sahayak"];
    if (view === 'staff-ledger') b.push(activeStaff?.name || '');
    return b;
  };

  const handleBack = () => {
    if (view === 'staff-ledger') setView('overview');
  };

  return (
    <ModuleShell 
      title={
         view === 'overview' ? (lang === 'en' ? "HomeStaff Management" : "Ghar ka Staff") :
         `${activeStaff?.name} Ledger`
      }
      subtitle={view === 'overview' ? (lang === 'en' ? "Managing household support and payroll" : "Ghar ke parivaar sam sahayakon ka hisab") : undefined}
      onAdd={showAddForm || view === 'staff-ledger' ? undefined : () => setShowAddForm(true)}
      addLabel={view === 'overview' ? (lang === 'en' ? "Add Staff" : "Naya Staff") : undefined}
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
              {lang === 'hi' ? 'Naya Member Jodein' : 'Register New Staff'}
            </h2>
          </div>

          <div className="card p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Naam' : 'Full Name'}</label>
              <input type="text" value={fName} onChange={e => setFName(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder="e.g. Ramesh Kumar" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Kaam (Role)' : 'Role'}</label>
              <div className="flex flex-wrap gap-2">
                {['Housemaid', 'Cook', 'Driver', 'Gardener', 'Nanny', 'Other'].map(r => (
                  <button key={r} onClick={() => setFRole(r)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${fRole === r ? 'bg-gold/10 text-gold border-gold/30' : 'bg-bg-secondary text-text-tertiary border-border-light'}`}>{r}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Mahine ki Tankha' : 'Monthly Salary (₹)'}</label>
              <input type="number" value={fSalary} onChange={e => setFSalary(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-xl font-black text-text-primary outline-none focus:border-gold" placeholder="₹0.00" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{lang === 'hi' ? 'Phone Number' : 'Phone'}</label>
              <input type="tel" value={fPhone} onChange={e => setFPhone(e.target.value)} className="w-full bg-bg-secondary border border-border-light rounded-xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold" placeholder="+91" />
            </div>

            <button onClick={handleAdd} disabled={!fName || !fSalary} className="w-full mt-4 bg-gold hover:opacity-90 text-white font-bold h-14 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {lang === 'hi' ? 'Save Karein' : 'Onboard Staff'}
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
           <MetricCard label="Active Staff" value={staff.length} unit="Members" status="info" />
           <MetricCard label="Present Today" value={`${presentToday}/${staff.length}`} status="success" />
           <MetricCard label="Monthly Budget" value={totalMonthlyPayout} isCurrency status="default" />
           <MetricCard label="Avg Advance" value="2,400" isCurrency status="warning" />
        </div>

        {/* Staff Roster */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
             Support Team Roster
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.length > 0 ? staff.map((s: StaffMember, i: number) => {
               const initials = s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
               const sAtt = attendance.filter((a: AttendanceRecord) => a.staff_id === s.id);
               const pPercentage = sAtt.length > 0 ? (sAtt.filter((a: AttendanceRecord) => a.status === 'present').length / sAtt.length) * 100 : 100;

               return (
                <motion.div 
                   key={String(s.id)}
                   onClick={() => { setActiveStaff(s); setView('staff-ledger'); }}
                   whileHover={{ y: -2 }}
                   className="card p-6 group transition-all hover:border-gold/30 hover:shadow-xl bg-bg-primary cursor-pointer"
                >
                   <div className="flex items-center gap-5 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border-2 border-border-light flex items-center justify-center font-black text-xl text-text-secondary group-hover:bg-gold/10 group-hover:text-gold group-hover:border-gold/20 transition-all shadow-inner">
                        {initials}
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-center">
                             <h4 className="text-base font-black text-text-primary tracking-tight">{s.name}</h4>
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-bg-success text-text-success px-2.5 py-1 rounded-full uppercase tracking-widest border border-text-success/10">Present</span>
                                <button onClick={(e) => { e.stopPropagation(); removeStaff(s.id); }} className="text-text-tertiary hover:text-text-danger transition-colors p-1 opacity-0 group-hover:opacity-100">
                                   <MoreHorizontal size={14} />
                                </button>
                             </div>
                          </div>
                         <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">
                            {s.role} · Since {s.join_date.slice(0, 4)}
                         </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-bg-secondary rounded-xl border border-border-light/50">
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Monthly Salary</div>
                         <div className="text-sm font-black text-text-primary tabular-nums">
                            <RupeesDisplay amount={s.salary} />
                         </div>
                      </div>
                      <div className="p-3 bg-bg-secondary rounded-xl border border-border-light/50">
                         <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Attendance</div>
                         <div className="text-sm font-black text-text-success tabular-nums">{pPercentage.toFixed(0)}%</div>
                      </div>
                   </div>

                   <div className="flex gap-2">
                       <button className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-bg-primary border border-border-light hover:border-gold hover:text-gold transition-all shadow-sm">
                          Mark Attendance
                       </button>
                       <button className="px-3 py-2 rounded-xl text-text-tertiary border border-border-light hover:bg-bg-tertiary transition-all">
                          <History size={16} />
                       </button>
                   </div>
                </motion.div>
               );
             }) : (
               <div className="col-span-2 py-24 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-border-light rounded-2xl">
                  <Briefcase size={48} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-center">No staff members enrolled</p>
               </div>
             )}
          </div>
        </section>

        {/* Salary History */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">
               Recent Payouts
            </div>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
               Full Ledger <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="card divide-y divide-border-light/30">
             {payments.length > 0 ? payments.map((p: SalaryPayment, i: number) => (
                <div key={p.id} className="p-5 flex justify-between items-center group hover:bg-bg-secondary transition-all">
                   <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-bg-success/5 text-text-success flex items-center justify-center border border-text-success/10 group-hover:bg-text-success group-hover:text-white transition-all shadow-inner">
                         <Wallet size={20} />
                      </div>
                      <div>
                         <div className="text-sm font-black text-text-primary tracking-tight">
                           {staff.find((s: StaffMember) => s.id === p.staff_id)?.name || 'Former Staff'}
                         </div>
                         <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-0.5">
                           Month of {p.month} · Paid on {p.paid_on}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-black text-text-primary tabular-nums">
                         <RupeesDisplay amount={p.net} />
                      </div>
                      {p.advance > 0 && (
                        <div className="text-[8px] font-bold text-text-danger uppercase tracking-tighter">
                           -₹{p.advance} Advance Adj.
                        </div>
                      )}
                   </div>
                </div>
             )) : (
                <div className="py-12 flex flex-col items-center justify-center opacity-20">
                   <Wallet size={32} />
                   <p className="text-[9px] font-black uppercase tracking-widest mt-2">No payment logs</p>
                </div>
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
             <div className="md:col-span-1 bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-black/[0.02]">
                 <div className="w-24 h-24 rounded-3xl bg-gold-light border-2 border-border-light flex items-center justify-center font-black text-text-tertiary text-3xl mb-6 shadow-sm">
                   <Briefcase size={40} />
                 </div>
                 <h2 className="text-2xl font-black text-text-primary tracking-tight">{activeStaff.name}</h2>
                 <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-2 opacity-80">{activeStaff.role} • {activeStaff.phone}</p>
                 <div className="mt-8 pt-8 border-t border-border-light/50 w-full grid grid-cols-2 gap-4 divide-x divide-border-light/50">
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Salary</div>
                       <div className="text-xl font-black text-text-primary tabular-nums">₹{activeStaff.salary.toLocaleString()}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Status</div>
                       <div className="text-sm font-black text-success uppercase mt-2">Active</div>
                    </div>
                 </div>
             </div>

             <div className="md:col-span-2 space-y-6">
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Wallet size={16} className="text-gold" /> Payout History
                     </h3>
                     <button className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline">+ Process Pay</button>
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
                        {payments.filter(p => p.staff_id === activeStaff.id).map((p, i) => (
                           <tr key={p.id} className="border-b border-border-light/50 hover:bg-bg-tertiary transition-colors group">
                              <td className="p-4 text-xs font-bold text-text-secondary uppercase">{p.month}</td>
                              <td className="p-4 text-xs font-bold text-text-secondary">{p.paid_on}</td>
                              <td className="p-4 text-sm font-black text-text-primary text-right">₹{p.net.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {payments.filter(p => p.staff_id === activeStaff.id).length === 0 && (
                     <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                        No payments yet
                     </div>
                  )}
               </div>
               
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <CalendarDays size={16} className="text-info" /> Attendance History
                     </h3>
                     <button className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline">+ Mark Present</button>
                  </div>
                  <div className="space-y-3">
                     {attendance.filter(a => a.staff_id === activeStaff.id).map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl">
                           <div className="text-sm font-bold text-text-primary">{a.date}</div>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${a.status === 'present' ? 'bg-success/5 text-success border-success/10' : a.status === 'absent' ? 'bg-danger/5 text-danger border-danger/10' : 'bg-warning/5 text-warning border-warning/10'}`}>
                              {a.status}
                           </span>
                        </div>
                     ))}
                     {attendance.filter(a => a.staff_id === activeStaff.id).length === 0 && (
                        <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                           No attendance logged
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
