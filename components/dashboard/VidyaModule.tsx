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
import { useVidya, getYouTubeThumbnail } from '@/hooks/useVidya';
import ModuleShell from './ModuleShell';
import {
  GraduationCap, BookOpen, FileText, Link2, Book,
  Star, CheckCircle2, Circle, Bookmark, BookMarked,
  Clock, Target, TrendingUp, Plus, ChevronRight, Trash2,
  Play, ExternalLink, ArrowUpRight, BarChart2, Flame,
  School, Brain, ArrowRight, PlusCircle, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import { VidyaLearner, VidyaSubject, VidyaResource, VidyaResourceType } from '@/types/db';

/* ─── Types ────────────────────────────────────────────────── */
type VidyaView = 'overview' | 'learner' | 'subject' | 'resource' | 'add-learner';

/* ─── Helpers ──────────────────────────────────────────────── */
const RESOURCE_ICONS: Record<VidyaResourceType, React.ElementType> = {
  youtube:  Play,
  pdf:      FileText,
  article:  Link2,
  book:     Book,
  website:  ExternalLink,
};

const RESOURCE_COLORS: Record<VidyaResourceType, string> = {
  youtube:  '#ef4444',
  pdf:      '#f97316',
  article:  '#3b82f6',
  book:     '#8b5cf6',
  website:  '#10b981',
};

const RESOURCE_LABELS: Record<VidyaResourceType, string> = {
  youtube:  'RESOURCE_LABELS_YT',
  pdf:      'RESOURCE_LABELS_PDF',
  article:  'RESOURCE_LABELS_ARTICLE',
  book:     'RESOURCE_LABELS_BOOK',
  website:  'RESOURCE_LABELS_WEBSITE',
};

const DIFF_COLORS: Record<string, string> = {
  easy:   'text-text-success bg-text-success/10 border-text-success/20',
  medium: 'text-gold bg-gold/10 border-gold/20',
  hard:   'text-text-danger bg-text-danger/10 border-text-danger/20',
};

const MOODS = [
  { val: 'focused', label: 'MOOD_FOCUSED', emoji: '🧠' },
  { val: 'neutral', label: 'MOOD_NEUTRAL', emoji: '😐' },
  { val: 'tired',   label: 'MOOD_TIRED',   emoji: '😴' },
  { val: 'distracted', label: 'MOOD_DISTRACTED', emoji: '😵' },
];

function fmtMins(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/* ─── Main Component ────────────────────────────────────────── */
export default function VidyaModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const vidya = useVidya();

  // Navigation state
  const [view, setView] = useState<VidyaView>('overview');
  const [activeLearner, setActiveLearner] = useState<VidyaLearner | null>(null);
  const [activeSubject, setActiveSubject] = useState<VidyaSubject | null>(null);
  const [activeResource, setActiveResource] = useState<VidyaResource | null>(null);

  // Add Learner form
  const [fLName, setFLName]               = useState('');
  const [fLInstitution, setFLInstitution] = useState('');
  const [fLGrade, setFLGrade]             = useState('');
  const [fLBoard, setFLBoard]             = useState('CBSE');
  const [fLGoal, setFLGoal]               = useState('');
  const [fLDeadline, setFLDeadline]       = useState('');

  // Add Subject form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [fSubName, setFSubName] = useState('');
  const [fSubCat, setFSubCat]   = useState('Science');
  const [sColor, setSColor]     = useState('#6366f1');
  const [sScore, setSScore]     = useState('');

  // Add Resource form
  const [showAddResource, setShowAddResource] = useState(false);
  const [fResName, setFResName] = useState('');
  const [fResType, setFResType] = useState<VidyaResourceType>('youtube');
  const [rUrl, setRUrl]         = useState('');
  const [rChapter, setRChapter] = useState('');
  const [rLesson, setRLesson]   = useState('');
  const [rDesc, setRDesc]       = useState('');
  const [fResDiff, setFResDiff] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [fResDur, setFResDur]   = useState('');

  // Log Session sheet
  const [showLogSession, setShowLogSession] = useState(false);
  const [fSDur, setFSDur]   = useState('');
  const [fSSub, setFSSub]   = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [fSMood, setFSMood] = useState<'focused' | 'neutral' | 'tired' | 'distracted'>('focused');

  /* ── Computed ─────────────────────────────────────────── */
  const learnerSubjects = activeLearner ? vidya.getSubjects(activeLearner.id) : [];
  const learnerStats    = activeLearner ? vidya.getStats(activeLearner.id) : null;
  const learnerSessions = activeLearner ? vidya.getSessions(activeLearner.id, 10) : [];
  const subjectResources = activeSubject ? vidya.getResources(activeSubject.id) : [];

  /* ── Breadcrumbs ──────────────────────────────────────── */
  const getBreadcrumbs = (): string[] => {
    const b = [t('STUDY_BUDDY')];
    if (activeLearner) b.push(activeLearner.name);
    if (activeSubject) b.push(activeSubject.name);
    if (activeResource) b.push(activeResource.title);
    return b;
  };

  const handleBack = () => {
    if (view === 'resource') { setActiveResource(null); setView('subject'); }
    else if (view === 'subject') { setActiveSubject(null); setView('learner'); }
    else if (view === 'learner') { setActiveLearner(null); setView('overview'); }
  };

  /* ── Handlers ─────────────────────────────────────────── */
  const handleAddLearner = () => {
    if (!fLName.trim()) return;
    vidya.addLearner(fLName, fLInstitution, fLGrade, fLBoard, fLGoal, fLDeadline);
    setFLName(''); setFLInstitution(''); setFLGrade(''); setFLBoard('CBSE'); setFLGoal(''); setFLDeadline('');
    setView('overview');
  };

  const handleSaveSubject = () => {
    if (!activeLearner || !fSubName.trim()) return;
    vidya.addSubject(activeLearner.id, fSubName, fSubCat, sColor, sScore);
    setFSubName(''); setFSubCat('Science'); setSColor('#6366f1'); setSScore('');
    setShowAddSubject(false);
  };

  const handleSaveResource = () => {
    if (!activeSubject || !activeLearner || !fResName.trim()) return;
    vidya.addResource(activeSubject.id, activeLearner.id, fResName, fResType, rUrl, rChapter, rLesson, rDesc, Number(fResDur) || undefined, fResDiff);
    setFResName(''); setFResType('youtube'); setRUrl(''); setRChapter(''); setRLesson(''); setRDesc(''); setFResDur('');
    setShowAddResource(false);
  };

  const handleLogSession = () => {
    if (!activeLearner || !fSDur) return;
    vidya.logSession(activeLearner.id, Number(fSDur), fSSub || undefined, logNotes, fSMood);
    setFSDur(''); setFSSub(''); setFSMood('focused'); setLogNotes('');
    setShowLogSession(false);
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 1 — Overview (All Learners)
  ══════════════════════════════════════════════════════════ */
  const renderOverview = () => (
    <motion.div key="overview" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-10">
      {view === 'add-learner' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('overview')} className="w-10 h-10 rounded-full bg-bg-primary border border-border-light flex items-center justify-center hover:text-gold transition-all shadow-sm">
              <ArrowRight className="w-5 h-5 opacity-40 rotate-180" />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {t('NEW_LEARNER')}
            </h2>
          </div>

          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl shadow-black/[0.02]">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('LEARNER_NAME')}</label>
              <input type="text" value={fLName} onChange={e => setFLName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-5 text-xl font-black text-text-primary outline-none focus:border-gold transition-all" placeholder={t('LEARNER_NAME_PH')} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('SCHOOL_COLL')}</label>
                  <input type="text" value={fLInstitution} onChange={e => setFLInstitution(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('INSTITUTION_PH')} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('CLASS_STD')}</label>
                  <input type="text" value={fLGrade} onChange={e => setFLGrade(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('CLASS_PH')} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('BOARD_TYPE')}</label>
              <input type="text" value={fLBoard} onChange={e => setFLBoard(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('BOARD_PH')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('LEARNING_GOALS')}</label>
                <input type="text" value={fLGoal} onChange={e => setFLGoal(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('GOAL_PH')} />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('GOAL_DEADLINE')}</label>
                <input type="date" value={fLDeadline} onChange={e => setFLDeadline(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" />
              </div>
            </div>

            <button onClick={handleAddLearner} disabled={!fLName} className="w-full mt-2 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-14 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              <PlusCircle size={18} />
              {t('ADD_LEARNER')}
            </button>
          </div>
        </motion.div>
      )}

      {view === 'overview' && (
        <div className="space-y-10 md:space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                 {t('LEARNERS')}
              </div>
              <button 
                onClick={() => setView('add-learner')}
                className="text-[10px] font-black text-gold-text uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                 <Plus size={14} /> {t('ADD_LEARNER')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {vidya.learners.length > 0 ? vidya.learners.map((l, i) => (
                <div key={l.id} onClick={() => { setActiveLearner(l); setView('learner'); }} className="bg-bg-primary border border-border-light p-6 rounded-[2.5rem] flex items-center gap-5 shadow-black/[0.02] hover:border-gold/30 transition-all group cursor-pointer">
                   <div className="w-16 h-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center font-black text-gold-text text-xl">
                     {l.avatar_initials}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-base font-black text-text-primary tracking-tight">{l.name}</h4>
                      <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1 opacity-80">
                         {l.standard} · {l.institution}
                      </p>
                      {l.goal && (
                        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-gold-text uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded-lg border border-gold/10 w-fit">
                           <TrendingUp size={10} /> {l.goal}
                        </div>
                      )}
                   </div>
                </div>
               )) : (
                <div className="md:col-span-2 bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-12 flex flex-col items-center justify-center text-center opacity-40">
                   <Users size={32} className="text-text-tertiary mb-3" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('NO_LEARNERS')}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest">{t('LEARNER_EMPTY_SUB')}</p>
                </div>
               )}
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );

  /* ══════════════════════════════════════════════════════════
     LEVEL 2 — Learner Detail
  ══════════════════════════════════════════════════════════ */
  const renderLearner = () => {
    if (!activeLearner) return null;
    return (
      <motion.div key="learner" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-10">
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 text-gold font-black text-xl flex items-center justify-center border border-gold/20 shadow-lg">
              {activeLearner.avatar_initials}
            </div>
            <div>
              <h2 className="text-xl font-black text-text-primary tracking-tight">{activeLearner.name}</h2>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{activeLearner.standard} · {activeLearner.board}</p>
            </div>
            <button onClick={() => setShowLogSession(true)} className="ml-auto flex items-center gap-2 h-11 px-6 bg-gold-text text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-gold/10">
              <Clock size={14} /> {t('ATTENDANCE')}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showLogSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-bg-primary border border-border-light rounded-[32px] p-6 max-w-sm w-full mx-4 shadow-2xl">
                <h3 className="text-lg font-black text-text-primary tracking-tight mb-6">{t('LOG_SESSION')}</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('DURATION_MINS')} *</label>
                    <input type="number" value={fSDur} onChange={e => setFSDur(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-3 font-bold text-text-primary outline-none focus:border-gold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('SUBJECTS')} ({t('OPTIONAL')})</label>
                    <select value={fSSub} onChange={e => setFSSub(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-3 font-bold text-text-primary outline-none focus:border-gold">
                      <option value="">{t('ALL')}</option>
                      {learnerSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('MOOD')}</label>
                    <div className="grid grid-cols-4 gap-2">
                       {MOODS.map(m => (
                         <button key={m.val} onClick={() => setFSMood(m.val as any)} className={`p-2 rounded-xl border text-[10px] font-bold transition-all ${fSMood === m.val ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-tertiary text-text-tertiary border-border-light'}`}>
                            {t(m.label)}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowLogSession(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-text-tertiary hover:bg-bg-tertiary transition-all">{t('CANCEL')}</button>
                    <button onClick={handleLogSession} disabled={!fSDur} className="flex-1 h-12 rounded-xl bg-gold-text text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 disabled:opacity-50">{t('SAVE_TO_VAULT')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               {t('SUBJECTS')}
            </div>
            <button onClick={() => setShowAddSubject(true)} className="text-[10px] font-black text-gold-text uppercase tracking-widest hover:underline flex items-center gap-1">
               <Plus size={14} /> {t('ADD_SUBJECT')}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {learnerSubjects.length > 0 ? learnerSubjects.map(s => {
               const subSessions = learnerSessions.filter(sess => sess.subject_id === s.id);
               const totalMins = subSessions.reduce((acc, curr) => acc + curr.duration_mins, 0);
               return (
                <div key={s.id} onClick={() => { setActiveSubject(s); setView('subject'); }} className="bg-bg-primary border border-border-light p-5 rounded-[2.5rem] flex flex-col items-center text-center shadow-black/[0.02] hover:border-gold/30 transition-all group cursor-pointer">
                   <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold-text mb-4">
                      <GraduationCap size={24} />
                   </div>
                   <h4 className="text-xs font-black text-text-primary tracking-tight line-clamp-1">{s.name}</h4>
                   <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-2">{fmtMins(totalMins)}</p>
                </div>
               );
             }) : (
              <div className="col-span-full md:col-span-4 bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-16 flex flex-col items-center justify-center text-center opacity-40">
                 <BookOpen size={32} className="text-text-tertiary mb-3" strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('NO_SUBJECTS')}</p>
              </div>
             )}
          </div>
        </section>

        <AnimatePresence>
          {showAddSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-bg-primary border border-border-light rounded-[32px] p-6 max-w-sm w-full mx-4 shadow-2xl">
                <h3 className="text-lg font-black text-text-primary tracking-tight mb-6">{t('ADD_SUBJECT')}</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('SUBJECTS').slice(0, -1)} {t('ITEM_NAME')}</label>
                    <input type="text" value={fSubName} onChange={e => setFSubName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-3 font-bold text-text-primary outline-none focus:border-gold" placeholder={t('SUBJECT_NAME_PH')} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('TASKS_CATEGORY')}</label>
                    <input type="text" value={fSubCat} onChange={e => setFSubCat(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-3 font-bold text-text-primary outline-none focus:border-gold" placeholder={t('SUBJECT_CAT_PH')} />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAddSubject(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-text-tertiary hover:bg-bg-tertiary transition-all">{t('CANCEL')}</button>
                    <button onClick={handleSaveSubject} disabled={!fSubName} className="flex-1 h-12 rounded-xl bg-gold-text text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 disabled:opacity-50">{t('SAVE_TO_VAULT')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 3 — Subject Detail
  ══════════════════════════════════════════════════════════ */
  const renderSubject = () => {
    if (!activeSubject) return null;
    return (
      <motion.div key="subject" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               {t('RESOURCES')}
            </div>
            <button onClick={() => setShowAddResource(true)} className="text-[10px] font-black text-gold-text uppercase tracking-widest hover:underline flex items-center gap-1">
               <Plus size={14} /> {t('ADD_RESOURCE')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {subjectResources.length > 0 ? subjectResources.map(r => (
              <ResourceCard key={r.id} res={r} onOpen={() => { setActiveResource(r); setView('resource'); }} onBookmark={() => vidya.toggleBookmark(r.id, r.is_bookmarked)} onComplete={() => vidya.toggleComplete(r.id, r.is_completed)} onDelete={() => vidya.deleteResource(r.id)} />
             )) : (
              <div className="md:col-span-2 bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-16 flex flex-col items-center justify-center text-center opacity-40">
                 <Play size={32} className="text-text-tertiary mb-3" strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('NO_RESOURCES')}</p>
              </div>
             )}
          </div>
        </section>

        <AnimatePresence>
          {showAddResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-bg-primary border border-border-light rounded-[32px] p-6 max-w-sm w-full mx-4 shadow-2xl">
                <h3 className="text-lg font-black text-text-primary tracking-tight mb-6">{t('RESOURCES').slice(0, -1)}</h3>
                <div className="space-y-4 overflow-y-auto max-h-[70vh] scroller-hide">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('RESOURCE_TYPE')}</label>
                    <div className="flex flex-wrap gap-2">
                       {Object.keys(RESOURCE_LABELS).map(type => (
                         <button key={type} onClick={() => setFResType(type as any)} className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${fResType === type ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-tertiary text-text-tertiary border-border-light'}`}>
                            {t(RESOURCE_LABELS[type as keyof typeof RESOURCE_LABELS])}
                         </button>
                       ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('ITEM_NAME')} *</label>
                    <input type="text" value={fResName} onChange={e => setFResName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-3 font-bold text-text-primary outline-none focus:border-gold" placeholder={t('SUBJECT_NAME_PH')} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('DIFFICULTY')}</label>
                        <div className="grid grid-cols-3 gap-1">
                           {['easy', 'medium', 'hard'].map(d => (
                             <button key={d} onClick={() => setFResDiff(d as any)} className={`p-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${fResDiff === d ? 'bg-bg-primary text-text-primary border-gold shadow-sm' : 'bg-bg-tertiary text-text-tertiary border-border-light opacity-60'}`}>
                               {t(d.toUpperCase())}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('DURATION_MINS')}</label>
                        <input type="number" value={fResDur} onChange={e => setFResDur(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-xl p-2 text-xs font-bold text-text-primary outline-none focus:border-gold" placeholder={t('DURATION_PH')} />
                     </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAddResource(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-text-tertiary hover:bg-bg-tertiary transition-all">{t('CANCEL')}</button>
                    <button onClick={handleSaveResource} disabled={!fResName} className="flex-1 h-12 rounded-xl bg-gold-text text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 disabled:opacity-50">{t('SAVE_TO_VAULT')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 4 — Resource Detail
  ══════════════════════════════════════════════════════════ */
  const renderResource = () => {
    if (!activeResource) return null;
    return (
      <motion.div key="resource" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-8">
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center bg-gold/10">
            <Play size={36} className="text-gold" />
          </div>
          <div>
            <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2">{RESOURCE_LABELS[activeResource.resource_type]}</div>
            <h2 className="text-xl font-black text-text-primary tracking-tight">{activeResource.title}</h2>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => vidya.toggleComplete(activeResource.id, activeResource.is_completed)}
            className={`flex-1 h-14 font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 border-2 transition-all ${activeResource.is_completed ? 'bg-text-success/10 border-text-success text-text-success' : 'border-border-light text-text-secondary hover:border-gold hover:text-gold'}`}>
            {activeResource.is_completed ? <><CheckCircle2 size={16} /> {t('DONE')}</> : <><Circle size={16} /> {t('MARK_DONE')}</>}
          </button>
        </div>
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     ROOT RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <ModuleShell
      title={
        view === 'overview' ? t('STUDY_BUDDY') :
        view === 'learner' ? activeLearner?.name ?? t('LEARNERS').slice(0, -1) :
        view === 'subject' ? activeSubject?.name ?? t('SUBJECTS').slice(0, -1) :
        activeResource?.title ?? t('RESOURCES').slice(0, -1)
      }
      subtitle={view === 'overview' ? t('SMART_LEARNING') : undefined}
      onAdd={view === 'overview' ? () => setView('add-learner') : undefined}
      addLabel={t('ADD_LEARNER')}
      breadcrumbs={view !== 'overview' ? getBreadcrumbs() : undefined}
      onBack={view !== 'overview' ? handleBack : undefined}
    >
      <AnimatePresence mode="wait">
        {view === 'overview' && renderOverview()}
        {view === 'learner' && renderLearner()}
        {view === 'subject' && renderSubject()}
        {view === 'resource' && renderResource()}
      </AnimatePresence>
    </ModuleShell>
  );
}

/* ─── Micro-components ──────────────────────────────────────── */

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SaveBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-gold/10">
      {label}
    </button>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-bg-primary border border-border-light rounded-[1.8rem] p-5 flex items-center gap-4 shadow-sm">
      <div className="text-text-tertiary">{icon}</div>
      <div>
        <div className="text-base font-black text-text-primary">{value}</div>
        <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-bg-tertiary rounded-2xl p-3 text-center border border-border-light">
      <div className={`text-base font-black ${color || 'text-text-primary'}`}>{value}</div>
      <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-bold text-text-primary">{value}</span>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[3rem] opacity-50">
      <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center mb-6 text-text-tertiary">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-primary mb-2">{title}</h3>
      <p className="text-[10px] font-bold text-text-tertiary text-center max-w-xs">{subtitle}</p>
    </div>
  );
}

function ResourceCard({ res, onOpen, onBookmark, onComplete, onDelete }: {
  res: VidyaResource;
  onOpen: () => void;
  onBookmark: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const Icon = RESOURCE_ICONS[res.resource_type];
  const color = RESOURCE_COLORS[res.resource_type];
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-bg-primary border border-border-light rounded-[2rem] overflow-hidden group hover:border-border-medium hover:shadow-xl transition-all ${res.is_completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-5 p-6">
        {/* Thumbnail or Icon */}
        <div className="flex-shrink-0 cursor-pointer" onClick={onOpen}>
          {res.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={res.thumbnail_url} alt={res.title} className="w-24 h-16 object-cover rounded-xl border border-border-light" />
          ) : (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
              <Icon size={26} style={{ color }} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
          <div className="flex items-start gap-2 mb-1.5">
            <div className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color, background: color + '18' }}>
              {t(RESOURCE_LABELS[res.resource_type])}
            </div>
            {res.difficulty && (
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${DIFF_COLORS[res.difficulty]}`}>{t(res.difficulty.toUpperCase())}</span>
            )}
          </div>
          <h4 className={`font-black text-text-primary tracking-tight leading-tight line-clamp-2 ${res.is_completed ? 'line-through opacity-60' : ''}`}>{res.title}</h4>
          {(res.chapter || res.lesson) && (
            <p className="text-[10px] font-bold text-text-tertiary mt-1">
              {[res.chapter, res.lesson].filter(Boolean).join(' · ')}
            </p>
          )}
          {res.duration_mins && (
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-text-tertiary">
              <Clock size={10} /> {fmtMins(res.duration_mins)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button onClick={onBookmark} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${res.is_bookmarked ? 'text-gold bg-gold/10' : 'text-text-tertiary hover:text-gold hover:bg-gold/5'}`}>
            {res.is_bookmarked ? <BookMarked size={16} /> : <Bookmark size={16} />}
          </button>
          <button onClick={onComplete} title={t('MARK_DONE')} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${res.is_completed ? 'text-text-success bg-text-success/10' : 'text-text-tertiary hover:text-text-success hover:bg-text-success/5'}`}>
            {res.is_completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          </button>
          <button onClick={onDelete} className="w-9 h-9 rounded-xl flex items-center justify-center text-text-tertiary hover:text-text-danger hover:bg-text-danger/5 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
