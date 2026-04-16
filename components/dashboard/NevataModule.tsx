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
import { useNevata } from '@/hooks/useNevata';
import ModuleShell from './ModuleShell';
import MetricCard from '../ui/MetricCard';
import { useTranslation, Language } from '@/lib/i18n';
import RupeesDisplay from '../ui/RupeesDisplay';
import {
  Calendar, Users, Gift, ArrowRight,
  MapPin, CheckCircle2, Clock, Package2, ArrowLeft, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionControl from './nevata/MissionControl';
import InventoryManager from './nevata/InventoryManager';
import MissionLedger from './nevata/MissionLedger';
import GuestManager from './nevata/GuestManager';
import { NevataEvent, ShagunRecord, NevataLedgerEntry, NevataGuest } from '@/types/db';

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

export default function NevataModule() {
  const { lang, db } = useAppStore();
  const t = useTranslation(lang as Language);
  const { getEvents, getLedger, getUpcoming, suggestShagun } = useNevata();

  const [direction, setDirection] = useState<'they_invited' | 'we_hosted'>('they_invited');
  const [activeTab, setActiveTab] = useState<'events' | 'ledger' | 'upcoming' | 'registry'>('events');
  const [selectedEvent, setSelectedEvent] = useState<NevataEvent | null>(null);
  const [nevataMode, setNevataMode] = useState<'list' | 'control' | 'inventory' | 'ledger' | 'guests'>('list');

  const events   = useMemo(() => getEvents(direction), [direction, db, getEvents]);
  const ledger   = useMemo(() => getLedger(),           [db, getLedger]);
  const upcoming = useMemo(() => getUpcoming(),          [db, getUpcoming]);

  // Real stats from DB
  const totalDiya = useMemo(() => {
    if (!db) return 0;
    try {
      const r = db.exec(`SELECT SUM(amount) FROM nevata_shagun WHERE direction='diya'`);
      return Number(r[0]?.values[0]?.[0] || 0);
    } catch { return 0; }
  }, [db]);
  const totalMila = useMemo(() => {
    if (!db) return 0;
    try {
      const r = db.exec(`SELECT SUM(amount) FROM nevata_shagun WHERE direction='mila'`);
      return Number(r[0]?.values[0]?.[0] || 0);
    } catch { return 0; }
  }, [db]);

  type MetricStatus = "success" | "default" | "warning" | "danger" | "info";
  
  const stats: { label: string; value: number; status: MetricStatus; isCurrency?: boolean }[] = direction === 'they_invited'
    ? [
        { label: t('UPCOMING'),    value: upcoming.length,  status: 'warning' },
        { label: t('GIVEN_TOTAL'), value: totalDiya, isCurrency: true, status: 'danger' },
        { label: t('RECEIVED_TOTAL'), value: totalMila, isCurrency: true, status: 'success' },
        { label: t('NET_PARAM'),  value: (totalMila - totalDiya), isCurrency: true,
          status: (totalMila - totalDiya >= 0 ? 'info' : 'warning') as MetricStatus },
      ]
    : [
        { label: t('INVITED'),    value: 0,         status: 'info' },
        { label: t('RECEIVED_TOTAL'), value: totalMila, isCurrency: true, status: 'success' },
        { label: t('GIVEN_TOTAL'), value: totalDiya, isCurrency: true, status: 'danger' },
        { label: t('NET_PARAM'), value: totalMila - totalDiya, isCurrency: true, status: 'info' },
      ];

  // --- Tab content renderers ---

  const renderEvents = () => (
    <div className="grid gap-4">
      {events.length > 0 ? events.map((e: NevataEvent) => {
        const emoji = EVENT_TYPE_EMOJI[String(e.event_type)] || '📅';
        const dir   = DIRECTION_LABEL[String(e.direction)] || DIRECTION_LABEL['they_invited'];
        return (
          <div
            key={String(e.id)}
            onClick={() => {
              setSelectedEvent(e);
              setNevataMode('control');
            }}
            className="card p-5 flex flex-col md:flex-row gap-5 justify-between group hover:border-gold transition-all cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-bg-tertiary border border-border-light flex items-center justify-center text-2xl flex-shrink-0">
                {emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-sm font-black text-text-primary tracking-tight">
                    {e.title}
                  </h4>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${dir.color}`}>
                    {t(e.direction === 'we_hosted' ? 'NEVATA_WE_HOSTED' : 'NEVATA_THEY_HOSTED')}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">
                  {e.family_name} · {e.event_date}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {e.location && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-text-tertiary">
                      <MapPin size={11} className="text-gold" /> {e.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-bold text-text-tertiary">
                    <Users size={11} className="text-gold" /> {e.our_count} {t('PEOPLE_COUNT')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-3">
              {direction === 'they_invited' && (
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 text-right min-w-[120px]">
                  <div className="text-[9px] font-black text-gold uppercase tracking-[0.2em] mb-1">
                    PARAM-PRASAD
                  </div>
                  <div className="text-base font-black text-gold tabular-nums">
                    <RupeesDisplay amount={suggestShagun(e.family_name)} />
                  </div>
                </div>
              )}
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                e.status === 'attended'
                  ? 'bg-bg-success text-text-success border-text-success/10'
                  : e.status === 'upcoming'
                  ? 'bg-bg-warning text-text-warning border-text-warning/10'
                  : 'bg-bg-tertiary text-text-tertiary border-border-light'
              }`}>
                {t(`STATUS_${e.status.toUpperCase()}` as any)}
              </span>
            </div>
          </div>
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
      {ledger.length > 0 ? ledger.map((l: NevataLedgerEntry, i: number) => (
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
      {upcoming.length > 0 ? upcoming.map((e: NevataEvent, i: number) => {
        const days = daysUntil(e.event_date);
        const urgency = days <= 7 ? 'bg-bg-danger text-text-danger' : days <= 30 ? 'bg-bg-warning text-text-warning' : 'bg-bg-info text-text-info';
        const suggested = suggestShagun(e.family_name);
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
                    {days === 0 ? t('TODAY') : days < 0 ? t('NEVATA_PASSED') : `${days} ${t('DAYS_LEFT')}`}
                  </span>
                  <span className="text-[10px] font-bold text-gold">
                    {t('SUGGESTED')}: <RupeesDisplay amount={suggested} />
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
    { id: 'events',   label: t('NEVATA_TAB_EVENTS') },
    { id: 'ledger',   label: t('NEVATA_TAB_LEDGER') },
    { id: 'upcoming', label: t('NEVATA_TAB_UPCOMING') },
    { id: 'registry', label: t('NEVATA_TAB_REGISTRY') },
  ] as const;

  return (
    <ModuleShell
      title={t('NEVATA')}
      subtitle={selectedEvent ? selectedEvent.title : t('NEVATA_SUBTITLE')}
      onAdd={nevataMode === 'list' ? () => {} : undefined}
      addLabel={t('NEW_EVENT')}
    >
      <div className="space-y-8">
        {selectedEvent && (
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => { setSelectedEvent(null); setNevataMode('list'); }}
              className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest hover:text-gold transition-all"
            >
              <ArrowLeft size={14} /> {t('BACK_TO_LIST') || 'Back to List'}
            </button>
            <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-xl border border-border-light">
               <button 
                  onClick={() => setNevataMode('control')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${nevataMode === 'control' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Control
               </button>
               <button 
                  onClick={() => setNevataMode('inventory')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${nevataMode === 'inventory' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Saamaan
               </button>
               <button 
                  onClick={() => setNevataMode('ledger')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${nevataMode === 'ledger' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Lekha-Jokha
               </button>
               <button 
                  onClick={() => setNevataMode('guests')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${nevataMode === 'guests' ? 'bg-bg-primary text-gold shadow-sm' : 'text-text-tertiary'}`}
               >
                  Atithi
               </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              {/* ── Direction Toggle ──────────────────────────────── */}
        <div className="flex justify-center">
          <div className="bg-bg-secondary p-1 rounded-2xl border border-border-light flex shadow-inner">
            {(['they_invited', 'we_hosted'] as const).map((d) => (
              <button
                key={d}
                onClick={() => { setDirection(d); setActiveTab('events'); }}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  direction === d
                    ? 'bg-bg-primary text-gold shadow-md'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {d === 'they_invited' ? t('THEIR_SHADI') : t('OUR_SHADI')}
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
          {nevataMode === 'control' ? (
            <MissionControl event={selectedEvent} onNavigate={(v) => setNevataMode(v === 'inventory' ? 'inventory' : 'control' as any)} />
          ) : nevataMode === 'inventory' ? (
            <InventoryManager event={selectedEvent} />
          ) : nevataMode === 'ledger' ? (
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
