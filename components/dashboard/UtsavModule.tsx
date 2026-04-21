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

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useUtsav } from '@/modules/utsav';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { useTranslation, Language } from '@/lib/i18n';
import RupeesDisplay from '../ui/RupeesDisplay';
import {
  Calendar, Users, Gift, ArrowRight,
  MapPin, CheckCircle2, Clock, Package2, ArrowLeft, Settings, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionControl from './utsav/MissionControl';
import InventoryManager from './utsav/InventoryManager';
import MissionLedger from './utsav/MissionLedger';
import GuestManager from './utsav/GuestManager';
import { UtsavEvent, UtsavShagun, UtsavLedgerEntry, UtsavGuest } from '@/types/db';

const EVENT_TYPE_EMOJI: Record<string, string> = {
  shaadi: '💍', sagai: '💒', tilak: '🪔', janmdin: '🎂',
  mundan: '✂️', janeu: '🙏', pooja: '🪔', other: '📅',
};

const DIRECTION_LABEL: Record<string, { label: string; color: string; key: string }> = {
  we_hosted:    { label: 'Hamari Shaadi', color: 'bg-bg-info text-text-info', key: 'OUR_SHADI' },
  they_invited: { label: 'Unki Shaadi',   color: 'bg-bg-success text-text-success', key: 'THEIR_SHADI' },
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

import { parseRichContent } from '@/lib/richContent';

export default function UtsavModule() {
  const { lang, db } = useAppStore();
  const t = useTranslation(lang as Language);
  const { events, stats: utsavStats, familyLedger, addEvent, getShagunList } = useUtsav();

  const [direction, setDirection] = useState<'they_invited' | 'we_hosted'>('they_invited');
  const [activeTab, setActiveTab] = useState<'events' | 'ledger' | 'upcoming' | 'registry'>('events');
  const [selectedEvent, setSelectedEvent] = useState<UtsavEvent | null>(null);
  const [utsavMode, setUtsavMode] = useState<'list' | 'control' | 'inventory' | 'ledger' | 'guests'>('list');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [fTitle, setFTitle] = useState('');
  const [fEType, setFEType] = useState('shaadi');
  const [fFamily, setFFamily] = useState('');
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);
  const [fLoc, setFLoc] = useState('');
  const [fRishta, setFRishta] = useState<'KHAAS' | 'NORMAL'>('NORMAL');

  const filteredEvents = useMemo(() => events.filter(e => e.direction === direction), [events, direction]);
  const upcoming = useMemo(() => events.filter(e => new Date(e.event_date) >= new Date() && e.status !== 'attended'), [events]);

  type MetricStatus = "success" | "default" | "warning" | "danger" | "info";
  
  const stats: { label: string; value: number; status: MetricStatus; isCurrency?: boolean }[] = direction === 'they_invited'
    ? [
        { label: t('UPCOMING'),    value: upcoming.length,  status: 'warning' },
        { label: t('GIVEN_TOTAL'), value: utsavStats.totalDiya, isCurrency: true, status: 'danger' },
        { label: t('RECEIVED_TOTAL'), value: utsavStats.totalMila, isCurrency: true, status: 'success' },
        { label: t('NET_PARAM'),  value: (utsavStats.totalMila - utsavStats.totalDiya), isCurrency: true,
          status: (utsavStats.totalMila - utsavStats.totalDiya >= 0 ? 'info' : 'warning') as MetricStatus },
      ]
    : [
        { label: t('INVITED'),    value: 0,         status: 'info' },
        { label: t('RECEIVED_TOTAL'), value: utsavStats.totalMila, isCurrency: true, status: 'success' },
        { label: t('GIVEN_TOTAL'), value: utsavStats.totalDiya, isCurrency: true, status: 'danger' },
        { label: t('NET_PARAM'), value: utsavStats.totalMila - utsavStats.totalDiya, isCurrency: true, status: 'info' },
      ];

  const handleCreateEvent = () => {
    if (!fTitle || !fFamily) return;
    addEvent({
      title: fTitle,
      event_type: fEType,
      direction,
      family_name: fFamily,
      event_date: fDate,
      location: fLoc,
      our_count: 1,
      notes: direction === 'they_invited' ? fRishta : 'NORMAL'
    });
    setShowAddForm(false);
    setFTitle('');
    setFFamily('');
    setFLoc('');
    setFRishta('NORMAL');
  };

  // --- Tab content renderers ---

  const renderEvents = () => (
    <div className="grid gap-4">
      {filteredEvents.length > 0 ? filteredEvents.map((e: UtsavEvent, i: number) => {
        const emoji = EVENT_TYPE_EMOJI[String(e.event_type)] || '📅';
        const dir   = DIRECTION_LABEL[String(e.direction)] || DIRECTION_LABEL['they_invited'];
        return (
          <motion.div
            key={String(e.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              setSelectedEvent(e);
              setUtsavMode('control');
            }}
            className="card-lift bg-bg-primary border border-border-light p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-6 justify-between group hover:border-gold/30 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
            
            <div className="flex gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-bg-tertiary border border-border-light flex items-center justify-center text-3xl flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                {emoji}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h4 className="text-lg font-black text-text-primary tracking-tight leading-none group-hover:text-gold transition-colors">
                    {e.title}
                  </h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${dir.color} border border-border-light/10 shadow-sm`}>
                    {t(e.direction === 'we_hosted' ? 'UTSAV_WE_HOSTED' : 'UTSAV_THEY_HOSTED')}
                  </span>
                </div>
                <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.15em] opacity-80 mb-4">
                  {e.family_name} · <span className="text-text-secondary">{new Date(e.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </p>
                <div className="flex items-center gap-4">
                  {e.location && (
                    <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-xl border border-border-light">
                      <MapPin size={12} className="text-gold" /> 
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider">{e.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-xl border border-border-light">
                    <Users size={12} className="text-gold" /> 
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider">{e.our_count} {t('PEOPLE_COUNT')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-4 relative z-10">
              {direction === 'they_invited' && (
                <div className="bg-white border border-gold/20 rounded-[1.5rem] p-4 text-right min-w-[140px] shadow-xl shadow-gold/5 group-hover:border-gold/40 transition-all">
                  <div className="text-[9px] font-black text-gold uppercase tracking-[0.2em] mb-1 opacity-60">
                    PARAM-SHAGUN
                  </div>
                  <div className="text-xl font-black text-gold tabular-nums tracking-tighter">
                    <RupeesDisplay amount={501} />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                 <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all ${
                  e.status === 'attended'
                    ? 'bg-bg-success/10 text-text-success border-text-success/20'
                    : e.status === 'upcoming'
                    ? 'bg-red-500/10 text-red-600 border-red-500/20 animate-pulse'
                    : 'bg-bg-tertiary text-text-tertiary border-border-light'
                }`}>
                  {t(`STATUS_${e.status.toUpperCase()}` as any)}
                </span>
                <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all">
                   <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      }) : (
        <div className="py-24 flex flex-col items-center justify-center opacity-30">
          <Gift size={48} strokeWidth={1} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4">{t('NO_EVENTS')}</p>
        </div>
      )}
    </div>
  );

  const renderLedger = () => (
    <div className="card divide-y divide-border-light/30">
      {familyLedger.length > 0 ? familyLedger.map((l: UtsavLedgerEntry, i: number) => (
        <div key={i} className="p-5 flex justify-between items-center group hover:bg-bg-secondary transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-bg-tertiary border border-border-light flex items-center justify-center font-black text-sm text-text-secondary">
              {l.family_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h5 className="text-sm font-black text-text-primary">{l.family_name}</h5>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-text-tertiary font-bold">
                  Diya: <RupeesDisplay amount={l.diya || 0} />
                </span>
                <span className="text-[10px] text-text-tertiary font-bold">
                  Mila: <RupeesDisplay amount={l.mila || 0} />
                </span>
              </div>
              {l.notes && (
                <div className="text-[10px] text-text-tertiary italic mt-1 leading-relaxed">
                  {parseRichContent(l.notes)}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-base font-black tabular-nums ${l.net >= 0 ? 'text-text-success' : 'text-text-danger'}`}>
              {l.net > 0 ? '+' : ''}
              <RupeesDisplay amount={l.net} />
            </div>
            <div className="text-[9px] font-bold text-text-tertiary uppercase tracking-tighter mt-0.5">
              {l.net >= 0 ? t('WE_ARE_AHEAD') : t('BALANCE_DUE')}
            </div>
          </div>
        </div>
      )) : (
        <div className="py-16 flex flex-col items-center justify-center opacity-30">
          <CheckCircle2 size={40} strokeWidth={1} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Koi ledger nahi</p>
        </div>
      )}
    </div>
  );

  const renderUpcoming = () => (
    <div className="grid gap-4">
      {upcoming.length > 0 ? upcoming.map((e: UtsavEvent, i: number) => {
        const days = daysUntil(e.event_date);
        const urgency = days <= 7 ? 'bg-bg-danger text-text-danger' : days <= 30 ? 'bg-bg-warning text-text-warning' : 'bg-bg-info text-text-info';
        const suggested = 501;
        return (
          <div key={i} className="card p-5 flex items-center justify-between group hover:border-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-light flex items-center justify-center">
                <Calendar size={20} className="text-gold" />
              </div>
              <div>
                <h4 className="text-sm font-black text-text-primary">{e.title}</h4>
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5">
                  {e.family_name} · {e.event_date}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${urgency}`}>
                    {days === 0 ? t('TODAY') : days < 0 ? t('UTSAV_PASSED') : `${days} ${t('DAYS_LEFT')}`}
                  </span>
                  <span className="text-[10px] font-bold text-gold">
                    {t('SUGGESTED')}: <RupeesDisplay amount={501} />
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary group-hover:text-gold transition-colors" />
          </div>
        );
      }) : (
        <div className="py-24 flex flex-col items-center justify-center opacity-30">
          <Clock size={48} strokeWidth={1} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Koi aane wala event nahi</p>
        </div>
      )}
    </div>
  );

  const renderRegistry = () => (
    <div className="py-20 flex flex-col items-center justify-center opacity-30">
      <Package2 size={48} strokeWidth={1} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Gift Registry</p>
      <p className="text-[10px] text-text-tertiary mt-2">Kisi event ka gift list add karein</p>
    </div>
  );

  const TABS = [
    { id: 'events',   label: t('UTSAV_TAB_EVENTS') },
    { id: 'ledger',   label: t('UTSAV_TAB_LEDGER') },
    { id: 'upcoming', label: t('UTSAV_TAB_UPCOMING') },
    { id: 'registry', label: t('UTSAV_TAB_REGISTRY') },
  ] as const;

  return (
    <ModuleShell
      title={t('NEVATA')}
      subtitle={selectedEvent ? selectedEvent.title : t('UTSAV_SUBTITLE')}
      onAdd={utsavMode === 'list' && !showAddForm ? () => setShowAddForm(true) : undefined}
      addLabel={t('NEW_EVENT')}
      onBack={showAddForm ? () => setShowAddForm(false) : undefined}
    >
      <div className="space-y-8">
        {selectedEvent && (
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => { setSelectedEvent(null); setUtsavMode('list'); }}
              className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest hover:text-gold transition-all"
            >
              <ArrowLeft size={14} /> {t('BACK_TO_LIST') || 'Back to List'}
            </button>
            <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-xl border border-border-light">
               <button 
                  onClick={() => setUtsavMode('control')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${utsavMode === 'control' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Control
               </button>
               <button 
                  onClick={() => setUtsavMode('inventory')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${utsavMode === 'inventory' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Saamaan
               </button>
               <button 
                  onClick={() => setUtsavMode('ledger')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${utsavMode === 'ledger' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Lekha-Jokha
               </button>
               <button 
                  onClick={() => setUtsavMode('guests')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${utsavMode === 'guests' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Atithi
               </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showAddForm ? (
            <motion.div
              key="add-event-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-black/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-text-primary">Event Blueprint</h3>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${direction === 'we_hosted' ? 'bg-bg-info text-text-info' : 'bg-bg-success text-text-success'}`}>
                    {direction === 'we_hosted' ? 'APNA KAAJ (HOST)' : 'VYAVAHAR (ATTEND)'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-1">Title / Event Name</label>
                    <input type="text" value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="e.g. Rahul ki Shaadi" className="bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-1">Event Type</label>
                      <select value={fEType} onChange={e => setFEType(e.target.value)} className="bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold appearance-none">
                        {Object.keys(EVENT_TYPE_EMOJI).map(k => (
                          <option key={k} value={k}>{EVENT_TYPE_EMOJI[k]} {k.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-1">Date</label>
                      <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className="bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-1">Family Name</label>
                    <input type="text" value={fFamily} onChange={e => setFFamily(e.target.value)} placeholder="e.g. Mishra Pariwar" className="bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                  </div>

                  {direction === 'they_invited' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] pl-1">Rishta Intensity (रिश्ता)</label>
                      <select value={fRishta} onChange={e => setFRishta(e.target.value as any)} className="bg-bg-tertiary border border-gold rounded-2xl p-4 text-sm font-bold text-gold outline-none focus:border-gold appearance-none">
                        <option value="NORMAL">Vyavahar / Normal (Aam)</option>
                        <option value="KHAAS">Khaas / Close Family (Sangha)</option>
                      </select>
                      <p className="text-[9px] text-text-tertiary pl-1">*Khaas activates the high-tier Vyavahar Shagun engine.</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-1">Location</label>
                    <input type="text" value={fLoc} onChange={e => setFLoc(e.target.value)} placeholder="Venue details..." className="bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold outline-none focus:border-gold" />
                  </div>
                </div>

                <button 
                  onClick={handleCreateEvent}
                  disabled={!fTitle || !fFamily}
                  className="w-full h-16 bg-gold-text text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={20} /> Deploy Blueprint
                </button>
              </div>
            </motion.div>
          ) : !selectedEvent ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              {/* ── Direction Toggle ──────────────────────────────── */}
         <div className="flex justify-center">
          <div className="bg-bg-secondary p-1.5 rounded-[1.8rem] border border-border-light flex shadow-inner relative">
            {(['they_invited', 'we_hosted'] as const).map((d) => (
              <button
                key={d}
                onClick={() => { setDirection(d); setActiveTab('events'); }}
                className={`px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${
                  direction === d
                    ? 'text-gold'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {d === 'they_invited' ? 'VYAVAHAR (ATTEND)' : 'APNA KAAJ (HOST)'}
                {direction === d && (
                   <motion.div 
                      layoutId="utsav-dir-pill"
                      className="absolute inset-0 bg-bg-primary rounded-xl shadow-lg border border-border-light/50 -z-10"
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                   />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => <MetricCard key={i} {...s} />)}
        </div>

        {/* ── Inner Tabs ───────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-6 mb-6 border-b border-border-light/50 px-2 overflow-x-auto scroller-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex-shrink-0 ${
                  activeTab === t.id ? 'text-gold' : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <motion.div
                    layoutId="nevata-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={`${direction}-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'events'   && renderEvents()}
            {activeTab === 'ledger'   && renderLedger()}
            {activeTab === 'upcoming' && renderUpcoming()}
            {activeTab === 'registry' && renderRegistry()}
          </motion.div>
        </div>
      </motion.div>
    ) : (
        <motion.div
          key="control-view"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {utsavMode === 'control' ? (
            <MissionControl event={selectedEvent} onNavigate={(v) => setUtsavMode(v === 'inventory' ? 'inventory' : 'control' as any)} />
          ) : utsavMode === 'inventory' ? (
            <InventoryManager event={selectedEvent} />
          ) : utsavMode === 'ledger' ? (
            <MissionLedger event={selectedEvent} />
          ) : (
            <GuestManager event={selectedEvent} />
          )}
        </motion.div>
      )}
      </AnimatePresence>
      </div>
    </ModuleShell>
  );
}
