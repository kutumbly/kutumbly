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

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useVidya, getYouTubeThumbnail } from '@/modules/vidya';
import ModuleShell from './ModuleShell';
import {
  GraduationCap, BookOpen, FileText, Link2, Book,
  Star, CheckCircle2, Circle, Bookmark, BookMarked,
  Clock, Target, TrendingUp, Plus, ChevronRight, Trash2,
  Play, ExternalLink, ArrowUpRight, BarChart2, Flame,
  School, Brain, ArrowRight, PlusCircle, Users, Edit3, X,
  Save, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import { VidyaLearner, VidyaSubject, VidyaResource, VidyaResourceType } from '@/types/db';

/* ─── Types ────────────────────────────────────────────────── */
type VidyaView = 'overview' | 'learner' | 'subject' | 'resource' | 'add-learner' | 'edit-learner';

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

  // Learner form
  const [fLName, setFLName]               = useState('');
  const [fLInstitution, setFLInstitution] = useState('');
  const [fLGrade, setFLGrade]             = useState('');
  const [fLBoard, setFLBoard]             = useState('CBSE');
  const [fLGoal, setFLGoal]               = useState('');
  const [fLDeadline, setFLDeadline]       = useState('');
  const [fLFamId, setFLFamId]             = useState('');

  // Subject form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState<string | null>(null);
  const [fSubName, setFSubName] = useState('');
  const [fSubCat, setFSubCat]   = useState('Science');
  const [sColor, setSColor]     = useState('#c9971c');
  const [sScore, setSScore]     = useState('');

  // Resource form
  const [showAddResource, setShowAddResource] = useState(false);
  const [isEditingResource, setIsEditingResource] = useState<string | null>(null);
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
  const learnerSessions = activeLearner ? vidya.getAnalytics(activeLearner.id) : [];
  const subjectResources = activeSubject ? vidya.getResources(activeSubject.id) : [];

  /* == Breadcrumbs ======================================== */
  const getBreadcrumbs = (): string[] => {
    const b = [t('STUDY_BUDDY')];
    if (activeLearner) b.push(activeLearner.name);
    if (activeSubject) b.push(activeSubject.name);
    if (activeResource) b.push(activeResource.title);
    return b;
  };

  const familyMembers = React.useMemo(() => {
    if (!useAppStore.getState().db) return [];
    try {
      const res = useAppStore.getState().db.exec("SELECT id, name FROM family_members ORDER BY name ASC");
      return res[0]?.values?.map((v: any[]) => ({ id: v[0] as string, name: v[1] as string })) || [];
    } catch { return []; }
  }, [useAppStore.getState().db]);

  const handleBack = () => {
    if (view === 'resource') { setActiveResource(null); setView('subject'); }
    else if (view === 'subject') { setActiveSubject(null); setView('learner'); }
    else if (view === 'learner' || view === 'edit-learner') { setActiveLearner(null); setView('overview'); }
    else if (view === 'add-learner') { setView('overview'); }
  };

  /* ── Handlers ─────────────────────────────────────────── */
  const handleSaveLearner = () => {
    if (!fLName.trim()) return;
    if (view === 'edit-learner' && activeLearner) {
      vidya.editLearner(activeLearner.id, {
        name: fLName.trim(),
        institution: fLInstitution,
        standard: fLGrade,
        board: fLBoard,
        goal: fLGoal,
        goal_deadline: fLDeadline,
        family_member_id: fLFamId || null
      });
      setView('overview');
    } else {
      vidya.addLearner({
        name: fLName.trim(),
        institution: fLInstitution,
        standard: fLGrade,
        board: fLBoard,
        goal: fLGoal,
        goal_deadline: fLDeadline,
        family_member_id: fLFamId || null
      });
      setView('overview');
    }
    setFLName(''); setFLInstitution(''); setFLGrade(''); setFLBoard('CBSE'); setFLGoal(''); setFLDeadline(''); setFLFamId('');
  };

  const handleTriggerEditLearner = (l: VidyaLearner) => {
    setFLName(l.name);
    setFLInstitution(l.institution || '');
    setFLGrade(l.standard || '');
    setFLBoard(l.board || 'CBSE');
    setFLGoal(l.goal || '');
    setFLDeadline(l.goal_deadline || '');
    setFLFamId(l.family_member_id || '');
    setActiveLearner(l);
    setView('edit-learner');
  };

  const handleSaveSubject = () => {
    if (!activeLearner || !fSubName.trim()) return;
    if (isEditingSubject) {
      vidya.editSubject(isEditingSubject, {
        name: fSubName.trim(),
        category: fSubCat,
        color: sColor,
        target_score: sScore
      });
    } else {
      vidya.addSubject(activeLearner.id, {
        name: fSubName.trim(),
        category: fSubCat,
        color: sColor,
        target_score: sScore
      });
    }
    setFSubName(''); setFSubCat('Science'); setSColor('#c9971c'); setSScore('');
    setIsEditingSubject(null);
    setShowAddSubject(false);
  };

  const handleTriggerEditSubject = (s: VidyaSubject) => {
    setFSubName(s.name);
    setFSubCat(s.category || 'Science');
    setSColor(s.color || '#c9971c');
    setSScore(s.target_score || '');
    setIsEditingSubject(s.id);
    setShowAddSubject(true);
  };

  const handleSaveResource = () => {
    if (!activeSubject || !activeLearner || !fResName.trim()) return;
    if (isEditingResource) {
      vidya.editResource(isEditingResource, {
        title: fResName.trim(),
        resource_type: fResType,
        url: rUrl,
        chapter: rChapter,
        lesson: rLesson,
        description: rDesc,
        duration_mins: Number(fResDur) || null,
        difficulty: fResDiff
      });
    } else {
      vidya.addResource(activeSubject.id, activeLearner.id, {
        title: fResName.trim(),
        resource_type: fResType,
        url: rUrl,
        chapter: rChapter,
        lesson: rLesson,
        description: rDesc,
        duration_mins: Number(fResDur) || null,
        difficulty: fResDiff
      });
    }
    setFResName(''); setFResType('youtube'); setRUrl(''); setRChapter(''); setRLesson(''); setRDesc(''); setFResDur('');
    setIsEditingResource(null);
    setShowAddResource(false);
  };

  const handleTriggerEditResource = (r: VidyaResource) => {
    setFResName(r.title);
    setFResType(r.resource_type);
    setRUrl(r.url || '');
    setRChapter(r.chapter || '');
    setRLesson(r.lesson || '');
    setRDesc(r.description || '');
    setFResDur(String(r.duration_mins || ''));
    setFResDiff(r.difficulty || 'medium');
    setIsEditingResource(r.id);
    setShowAddResource(true);
  };

  const handleLogSession = () => {
    if (!activeLearner || !fSDur) return;
    vidya.logSession(activeLearner.id, {
      duration_mins: Number(fSDur),
      subject_id: fSSub || null,
      notes: logNotes,
      mood: fSMood
    });
    setFSDur(''); setFSSub(''); setFSMood('focused'); setLogNotes('');
    setShowLogSession(false);
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 1 — Overview (All Learners)
  ══════════════════════════════════════════════════════════ */
  const renderOverview = () => (
    <motion.div key="overview" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-10">
      {(view === 'add-learner' || view === 'edit-learner') && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('overview')} className="w-10 h-10 rounded-full bg-bg-primary border border-border-light flex items-center justify-center hover:text-gold transition-all shadow-sm">
              <ArrowRight className="w-5 h-5 opacity-40 rotate-180" />
            </button>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              {view === 'edit-learner' ? t('VIDYA_REFINE_PROFILE') : t('NEW_LEARNER')}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('BOARD_TYPE')}</label>
                 <input type="text" value={fLBoard} onChange={e => setFLBoard(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all" placeholder={t('BOARD_PH')} />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] pl-2">{t('FAMILY_MEMBER')}</label>
                 <select value={fLFamId} onChange={e => setFLFamId(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary outline-none focus:border-gold transition-all">
                    <option value="">{t('SELECT_MEMBER')}</option>
                    {familyMembers.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                 </select>
               </div>
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

            <button onClick={handleSaveLearner} disabled={!fLName} className="w-full mt-2 bg-gold-text hover:opacity-90 text-white font-black tracking-[0.2em] h-14 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3">
              {view === 'edit-learner' ? <Save size={18} /> : <PlusCircle size={18} />}
              {view === 'edit-learner' ? t('VIDYA_UPDATE_PROFILE') : t('ADD_LEARNER')}
            </button>
          </div>
        </motion.div>
      )}

      {view === 'overview' && (
        <div className="space-y-10 md:space-y-12">
          {/* Top Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <MetricCard label={t('VIDYA_ACTIVE_STUDENTS')} value={vidya.learners.length} status="default" />
             <MetricCard label={t('VIDYA_TOTAL_RESOURCES')} value={vidya.learners.reduce((acc, l) => acc + (vidya.getStats(l.id).resourceCount), 0)} status="success" />
             <MetricCard label={t('VIDYA_MINS_STUDIED')} value={vidya.learners.reduce((acc, l) => acc + (vidya.getStats(l.id).totalMins), 0)} unit="m" status="success" />
             <MetricCard label={t('VIDYA_AVG_PROGRESS')} value="68%" status="warning" />
          </div>

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
                {vidya.learners.length > 0 ? vidya.learners.map((l, i) => {
                  const stats = vidya.getStats(l.id);
                  return (
                   <motion.div 
                     key={l.id} 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group relative"
                   >
                     <div onClick={() => { setActiveLearner(l); setView('learner'); }} className="card-lift bg-bg-primary border border-border-light p-8 rounded-[3rem] flex items-center gap-6 shadow-black/[0.02] hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
                       
                       <div className="w-20 h-20 rounded-[2rem] bg-gold/5 border border-gold/10 flex items-center justify-center font-black text-gold-text text-2xl group-hover:bg-gold group-hover:text-white transition-all shadow-inner relative z-10">
                         {l.avatar_initials}
                       </div>
                       <div className="flex-1 relative z-10">
                           <h4 className="text-xl font-black text-text-primary tracking-tight leading-none mb-2">{l.name}</h4>
                           <p className="text-[11px] text-text-tertiary font-black uppercase tracking-[0.2em] opacity-80">
                             {l.standard} · {l.institution}
                           </p>
                           <div className="flex items-center gap-4 mt-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-gold-text uppercase tracking-widest bg-gold/5 px-3 py-1 rounded-xl border border-gold/10">
                               <BookOpen size={12} /> {stats.resourceCount} Units
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black text-text-success uppercase tracking-widest bg-text-success/5 px-3 py-1 rounded-xl border border-text-success/10">
                               <Clock size={12} /> {fmtMins(stats.totalMins)}
                             </div>
                           </div>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                          <ChevronRight size={20} />
                       </div>
                     </div>
                     <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-20">
                       <button onClick={(e) => { e.stopPropagation(); handleTriggerEditLearner(l); }} className="p-2.5 bg-white border border-border-light rounded-xl hover:text-gold shadow-sm transition-all"><Edit3 size={14}/></button>
                       <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Archive this learner? All history will be kept offline.')) vidya.deleteLearner(l.id); }} className="p-2.5 bg-white border border-border-light rounded-xl hover:text-danger shadow-sm transition-all"><X size={14}/></button>
                     </div>
                   </motion.div>
                  );
                }) : (
                <div className="md:col-span-2 bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-16 flex flex-col items-center justify-center text-center opacity-40">
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
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-5 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 text-gold font-black text-xl flex items-center justify-center border border-gold/20 shadow-lg">
              {activeLearner.avatar_initials}
            </div>
            <div>
              <h2 className="text-xl font-black text-text-primary tracking-tight">{activeLearner.name}</h2>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{activeLearner.standard} · {activeLearner.board}</p>
            </div>
            
            <div className="flex-1 flex justify-center">
               <LearningFlame streak={vidya.getStreak(activeLearner.id)} />
            </div>

            <button onClick={() => setShowLogSession(true)} className="flex items-center gap-2 h-11 px-6 bg-gold-text text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-gold/10">
              <Clock size={14} /> {t('ATTENDANCE')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 relative z-10">
             <StatPill icon={<Clock size={20} />} label={t('TOTAL_STUDY')} value={fmtMins(learnerStats?.totalMins || 0)} />
             <StatPill icon={<CheckCircle2 size={20} className="text-success" />} label={t('VIDYA_LESSONS_DONE')} value={learnerStats?.completedCount || 0} />
             <StatPill icon={<BookOpen size={20} className="text-info" />} label={t('RESOURCES')} value={learnerStats?.resourceCount || 0} />
             <StatPill icon={<TrendingUp size={20} className="text-gold" />} label={t('VIDYA_CURVED_FINISH')} value={`${Math.round(((learnerStats?.completedCount || 0) / (learnerStats?.resourceCount || 1)) * 100)}%`} />
          </div>

          <div className="mt-8 relative z-10">
             <StudyRhythm data={vidya.getAnalytics(activeLearner.id)} />
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               {t('VIDYA_CURRICULUM')}
            </div>
            <button onClick={() => { setIsEditingSubject(null); setFSubName(''); setFSubCat('Science'); setShowAddSubject(true); }} className="text-[10px] font-black text-gold-text uppercase tracking-widest hover:underline flex items-center gap-1">
               <Plus size={14} /> {t('ADD_SUBJECT')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {learnerSubjects.length > 0 ? learnerSubjects.map(s => {
               const progress = vidya.getSubjectProgress(s.id);
               return (
                <div key={s.id} className="group relative">
                  <div onClick={() => { setActiveSubject(s); setView('subject'); }} className="card-lift bg-bg-primary border border-border-light p-8 rounded-[3rem] shadow-black/[0.02] hover:border-gold/30 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mb-16 group-hover:bg-indigo-500/10 transition-colors" />
                    
                    <div className="flex items-center gap-5 mb-6 relative z-10">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 text-indigo-600 flex items-center justify-center border border-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                          <GraduationCap size={28} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-lg font-black text-text-primary tracking-tight leading-tight mb-1">{s.name}</h4>
                          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{s.category || t('CASH_GENERAL')}</span>
                       </div>
                       <div className="text-right">
                          <div className="text-xl font-black text-text-primary tabular-nums tracking-tighter">{progress}%</div>
                          <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Complete</div>
                       </div>
                    </div>
                    
                    {/* Progress Bar (Standardized) */}
                    <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden shadow-inner relative z-10">
                       <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${progress}%` }} 
                          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                          className="h-full bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20" 
                       />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-20">
                    <button onClick={(e) => { e.stopPropagation(); handleTriggerEditSubject(s); }} className="p-2.5 bg-white border border-border-light rounded-xl hover:text-gold shadow-sm transition-all"><Edit3 size={14}/></button>
                    <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this subject and all its resources?')) vidya.deleteSubject(s.id); }} className="p-2.5 bg-white border border-border-light rounded-xl hover:text-danger shadow-sm transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
               );
             }) : (
              <div className="col-span-full bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-16 flex flex-col items-center justify-center text-center opacity-40">
                 <BookOpen size={32} className="text-text-tertiary mb-3" strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('NO_SUBJECTS')}</p>
                 <button onClick={() => setShowAddSubject(true)} className="mt-4 text-[9px] font-black text-gold-text uppercase underline">Create First Subject</button>
              </div>
             )}
          </div>
        </section>

        {/* Attendance Modals remain but updated UI */}
        <AnimatePresence>
          {showLogSession && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-border-light rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-text-primary tracking-tight">{t('LOG_SESSION')}</h3>
                   <button onClick={() => setShowLogSession(false)} className="text-text-tertiary hover:text-danger hover:rotate-90 transition-all"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_SAMAY')} *</label>
                    <input type="number" value={fSDur} onChange={e => setFSDur(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 font-black text-xl text-text-primary outline-none focus:border-gold" placeholder="60" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_SPECIFIC_VISHAY')}</label>
                    <select value={fSSub} onChange={e => setFSSub(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 font-bold text-text-primary outline-none focus:border-gold appearance-none cursor-pointer">
                      <option value="">{t('VIDYA_SWADHYAYA')}</option>
                      {learnerSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_MOOD')}</label>
                    <div className="grid grid-cols-4 gap-2">
                       {MOODS.map(m => (
                         <button key={m.val} onClick={() => setFSMood(m.val as any)} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${fSMood === m.val ? 'bg-gold-text text-white border-gold-text shadow-md' : 'bg-bg-tertiary text-text-tertiary border-border-light hover:border-gold/30'}`}>
                            <span className="text-lg">{m.emoji}</span>
                            <span className="text-[7px] font-black uppercase">{t(m.label)}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                  <button onClick={handleLogSession} disabled={!fSDur} className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-gold/20 disabled:opacity-50 mt-4">{t('VIDYA_LOG_ATTENDANCE')}</button>
                </div>
              </motion.div>
            </div>
          )}

          {showAddSubject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-border-light rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-text-primary tracking-tight">{isEditingSubject ? t('VIDYA_MODIFY_SUBJECT') : t('ADD_SUBJECT')}</h3>
                   <button onClick={() => setShowAddSubject(false)} className="text-text-tertiary hover:text-danger"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_SUBJECT_NAME')}</label>
                    <input type="text" value={fSubName} onChange={e => setFSubName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 font-black text-text-primary outline-none focus:border-gold" placeholder={t('VIDYA_SUBJECT_PH')} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('TASKS_CATEGORY')}</label>
                    <select value={fSubCat} onChange={e => setFSubCat(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 font-bold outline-none focus:border-gold appearance-none cursor-pointer">
                       {['Science', 'Mathematics', 'Economics', 'Coding', 'Language', 'Art', 'History', 'Other'].map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                       ))}
                    </select>
                  </div>
                  <button onClick={handleSaveSubject} disabled={!fSubName} className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-gold/20 disabled:opacity-50 mt-4">
                    {isEditingSubject ? t('VIDYA_UPDATE_SUBJECT') : t('VIDYA_INIT_SUBJECT')}
                  </button>
                </div>
              </motion.div>
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
               {t('VIDYA_STUDY_UNITS')}
            </div>
            <button onClick={() => { setIsEditingResource(null); setFResName(''); setShowAddResource(true); }} className="text-[10px] font-black text-gold-text uppercase tracking-widest hover:underline flex items-center gap-1">
               <Plus size={14} /> {t('ADD_RESOURCE')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {subjectResources.length > 0 ? subjectResources.map(r => (
              <ResourceCard 
                key={r.id} 
                res={r} 
                onOpen={() => { setActiveResource(r); setView('resource'); }} 
                onBookmark={() => vidya.toggleBookmark(r.id, r.is_bookmarked)} 
                onComplete={() => {
                  vidya.toggleComplete(r.id, r.is_completed);
                }} 
                onEdit={() => handleTriggerEditResource(r)}
                onDelete={() => { if(window.confirm('Delete this resource permanently?')) vidya.deleteResource(r.id); }} 
              />
             )) : (
              <div className="md:col-span-2 bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] py-16 flex flex-col items-center justify-center text-center opacity-40">
                 <Play size={32} className="text-text-tertiary mb-3" strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t('NO_RESOURCES')}</p>
                 <button onClick={() => setShowAddResource(true)} className="mt-4 text-[9px] font-black text-gold-text hover:underline">{t('VIDYA_ADD_FIRST_RES')}</button>
              </div>
             )}
          </div>
        </section>

        <AnimatePresence>
          {showAddResource && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-border-light rounded-[32px] p-8 max-w-sm w-full shadow-2xl overflow-y-auto max-h-[90vh] scroller-hide">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-text-primary tracking-tight">{isEditingResource ? t('VIDYA_MODIFY_UNIT') : t('VIDYA_ADD_STUDY_UNIT')}</h3>
                   <button onClick={() => setShowAddResource(false)} className="text-text-tertiary hover:text-danger"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_RES_TYPE')}</label>
                    <div className="grid grid-cols-3 gap-2">
                       {Object.keys(RESOURCE_LABELS).map(type => (
                         <button key={type} onClick={() => setFResType(type as any)} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${fResType === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-bg-tertiary text-text-tertiary border-border-light hover:border-indigo-400/30'}`}>
                            {React.createElement(RESOURCE_ICONS[type as VidyaResourceType], { size: 16 })}
                            <span className="text-[7px] font-black uppercase tracking-widest">{t(RESOURCE_LABELS[type as keyof typeof RESOURCE_LABELS]).replace('RESOURCE_LABELS_', '')}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_UNIT_TITLE')}</label>
                    <input type="text" value={fResName} onChange={e => setFResName(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 font-black text-text-primary outline-none focus:border-gold" placeholder={t('VIDYA_UNIT_PH')} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_URL_LINK')}</label>
                    <input type="text" value={rUrl} onChange={e => setRUrl(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-xs font-bold text-indigo-600 outline-none focus:border-gold" placeholder="https://..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('DIFFICULTY')}</label>
                        <select value={fResDiff} onChange={e => setFResDiff(e.target.value as any)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-xs font-bold outline-none focus:border-gold appearance-none cursor-pointer">
                           {['easy', 'medium', 'hard'].map(d => (
                             <option key={d} value={d}>{d.toUpperCase()}</option>
                           ))}
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_EST_TIME')}</label>
                        <input type="number" value={fResDur} onChange={e => setFResDur(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-xs font-black outline-none focus:border-gold" placeholder="30" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-2">{t('VIDYA_CHAPTER_TOPIC')}</label>
                    <input type="text" value={rChapter} onChange={e => setRChapter(e.target.value)} className="w-full bg-bg-tertiary border border-border-light rounded-2xl p-4 text-xs font-bold outline-none focus:border-gold" placeholder={t('VIDYA_CHAPTER_PH')} />
                  </div>

                  <button onClick={handleSaveResource} disabled={!fResName} className="w-full h-14 bg-indigo-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 disabled:opacity-50 mt-4">
                    {isEditingResource ? t('VIDYA_SAVE_CHANGES') : t('VIDYA_APPEND_COURSE')}
                  </button>
                </div>
              </motion.div>
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
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center bg-indigo-500/10 border-2 border-indigo-500/10 shadow-inner">
            {React.createElement(RESOURCE_ICONS[activeResource.resource_type], { size: 48, className: "text-indigo-600" })}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
               <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">{t(RESOURCE_LABELS[activeResource.resource_type]).replace('RESOURCE_LABELS_', '')}</span>
               <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${DIFF_COLORS[activeResource.difficulty || 'medium']}`}>{activeResource.difficulty}</span>
            </div>
            <h2 className="text-3xl font-black text-text-primary tracking-tight leading-none mb-4">{activeResource.title}</h2>
            {activeResource.chapter && <p className="text-sm font-bold text-text-tertiary uppercase tracking-normal">{activeResource.chapter} · {activeResource.lesson}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-bg-primary border border-border-light rounded-[2rem] p-8">
              <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6">{t('VIDYA_COURSE_MATERIAL')}</h3>
              {activeResource.url ? (
                <div className="space-y-6">
                   <div className="p-6 bg-bg-tertiary rounded-2xl border border-border-light flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Link2 size={24} className="text-indigo-600" />
                         <span className="text-xs font-bold text-indigo-600 truncate max-w-[200px]">{activeResource.url}</span>
                      </div>
                      <a href={activeResource.url} target="_blank" rel="noreferrer" className="p-3 bg-white border border-border-light rounded-xl hover:text-indigo-600 transition-all"><ExternalLink size={18}/></a>
                   </div>
                   {activeResource.resource_type === 'youtube' && (
                     <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border-light shadow-xl">
                        <iframe 
                          src={`https://www.youtube.com/embed/${extractYouTubeId(activeResource.url)}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                     </div>
                   )}
                </div>
              ) : (
                <div className="py-12 border-2 border-dashed border-border-light rounded-2xl flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest text-text-tertiary opacity-40">
                   {t('VIDYA_NO_SOURCE')}
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="bg-bg-primary border border-border-light rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
                 <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-8">{t('VIDYA_COMPLETION_SIGNAL')}</h3>
                 <button 
                   onClick={() => vidya.toggleComplete(activeResource.id, activeResource.is_completed)}
                   className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${activeResource.is_completed ? 'bg-text-success/5 border-text-success text-text-success shadow-2xl shadow-text-success/20' : 'bg-bg-tertiary border-border-light text-text-tertiary hover:border-indigo-400 hover:text-indigo-600'}`}
                 >
                    {activeResource.is_completed ? <CheckCircle2 size={64} className="animate-pulse" /> : <Circle size={64} />}
                    <span className="text-xs font-black uppercase tracking-widest">{activeResource.is_completed ? t('VIDYA_SAMPURNA') : t('VIDYA_MARK_SIDDHI')}</span>
                 </button>
              </div>

              <div className="bg-bg-primary border border-border-light rounded-[2rem] p-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-warning" />
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Management</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleTriggerEditResource(activeResource)} className="p-3 bg-bg-tertiary border border-border-light rounded-xl hover:text-indigo-600 transition-all"><Edit3 size={18}/></button>
                    <button onClick={() => { if(window.confirm('Delete resource?')) { vidya.deleteResource(activeResource.id); setView('subject'); } }} className="p-3 bg-bg-tertiary border border-border-light rounded-xl hover:text-danger transition-all"><Trash2 size={18}/></button>
                 </div>
              </div>
           </div>
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
        view === 'edit-learner' ? t('VIDYA_PROFILE_EDITOR') :
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
        {(view === 'add-learner' || view === 'edit-learner') && renderOverview()}
      </AnimatePresence>
    </ModuleShell>
  );
}

/* ─── Micro-components ──────────────────────────────────────── */

function LearningFlame({ streak }: { streak: number }) {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  if (streak === 0) return null;
  return (
    <div className="flex flex-col items-center gap-1 group">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          filter: ["drop-shadow(0 0 2px #c9971c)", "drop-shadow(0 0 8px #c9971c)", "drop-shadow(0 0 2px #c9971c)"]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold relative"
      >
        <Flame size={20} fill="currentColor" className="relative z-10" />
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-gold rounded-full"
        />
      </motion.div>
      <div className="text-[10px] font-black text-gold-text uppercase tracking-widest">
         {streak} {t('VIDYA_TAPASYA')}
      </div>
    </div>
  );
}

function StudyRhythm({ data }: { data: { label: string; mins: number }[] }) {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const max = Math.max(...data.map(d => d.mins), 60);
  return (
    <div className="bg-bg-secondary/50 border border-border-light rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
           {t('VIDYA_STUDY_RHYTHM')}
        </h4>
        <div className="text-[10px] font-black text-gold-text opacity-60 tabular-nums">{t('VIDYA_MINS_PER_DAY')}</div>
      </div>
      <div className="flex items-end justify-between gap-3 h-32 px-2 relative z-10">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar">
            <div className="relative w-full max-w-[14px] flex flex-col justify-end h-full">
               <motion.div 
                 initial={{ height: 0 }} 
                 animate={{ height: `${(d.mins / max) * 100}%` }}
                 className="w-full bg-gold rounded-full min-h-[6px] shadow-lg shadow-gold/20 relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
               </motion.div>
               {/* Tooltip on hover */}
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-primary border border-border-light px-2 py-1 rounded-md text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-xl tabular-nums whitespace-nowrap z-50">
                  {d.mins}m
               </div>
            </div>
            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-tighter opacity-60">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-bg-primary border border-border-light rounded-[1.8rem] p-5 flex items-center gap-4 shadow-sm group hover:border-gold/30 transition-all">
      <div className="text-text-tertiary group-hover:text-gold transition-colors">{icon}</div>
      <div>
        <div className="text-base font-black text-text-primary tracking-tight">{value}</div>
        <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ResourceCard({ res, onOpen, onBookmark, onComplete, onEdit, onDelete }: {
  res: VidyaResource;
  onOpen: () => void;
  onBookmark: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { lang } = useAppStore();
  const t = useTranslation(lang as Language);
  const Icon = RESOURCE_ICONS[res.resource_type];
  const color = RESOURCE_COLORS[res.resource_type];
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      className={`bg-bg-primary border border-border-light rounded-[2.5rem] overflow-hidden group hover:border-indigo-400/50 hover:shadow-2xl transition-all card-lift relative ${res.is_completed ? 'opacity-70' : ''}`}>
      
      {res.is_completed && <div className="absolute inset-0 bg-text-success/[0.02] pointer-events-none z-0" />}
      
      <div className="flex items-start gap-6 p-8 relative z-10">
        {/* Thumbnail or Icon */}
        <div className="flex-shrink-0 cursor-pointer" onClick={onOpen}>
          {res.thumbnail_url ? (
            <div className="relative group/thumb">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={res.thumbnail_url} alt={res.title} className="w-28 h-20 object-cover rounded-2xl border border-border-light shadow-md group-hover/thumb:scale-105 transition-transform" />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Play size={24} className="text-white drop-shadow-lg" fill="currentColor" />
               </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center border border-border-light shadow-inner group-hover:scale-105 transition-transform" style={{ background: color + '12' }}>
              <Icon size={32} style={{ color }} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
          <div className="flex items-center gap-3 mb-2.5">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-sm" style={{ color, background: color + '15', border: `1px solid ${color}20` }}>
              {t(RESOURCE_LABELS[res.resource_type]).replace('RESOURCE_LABELS_', '')}
            </div>
            {res.difficulty && (
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm ${DIFF_COLORS[res.difficulty]}`}>{t(res.difficulty.toUpperCase())}</span>
            )}
          </div>
          <h4 className={`text-base font-black text-text-primary tracking-tight leading-snug line-clamp-2 transition-all ${res.is_completed ? 'line-through text-text-tertiary' : 'group-hover:text-indigo-600'}`}>{res.title}</h4>
          
          <div className="flex items-center gap-4 mt-3.5">
            {res.duration_mins && (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-text-tertiary uppercase tracking-wider opacity-60">
                <Clock size={12} className="text-indigo-400" /> {fmtMins(res.duration_mins)}
              </div>
            )}
            {res.chapter && (
               <div className="flex items-center gap-1.5 text-[10px] font-black text-text-tertiary uppercase tracking-wider opacity-60 truncate">
                  <Bookmark size={12} className="text-gold" /> {res.chapter}
               </div>
            )}
          </div>
        </div>

        {/* Actions (Pill Style) */}
        <div className="flex flex-col gap-3 flex-shrink-0 relative z-20">
          <div className="flex flex-col gap-2 p-1.5 bg-bg-secondary rounded-2xl border border-border-light shadow-inner">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmark(); }} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-sm ${res.is_bookmarked ? 'text-gold bg-bg-primary border-gold/30' : 'bg-transparent text-text-tertiary border-transparent hover:text-gold hover:bg-bg-primary'}`}
            >
               {res.is_bookmarked ? <BookMarked size={18} /> : <Bookmark size={18} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onComplete(); }} 
              title="Complete" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-sm ${res.is_completed ? 'text-text-success bg-bg-primary border-text-success/30' : 'bg-transparent text-text-tertiary border-transparent hover:text-text-success hover:bg-bg-primary'}`}
            >
               {res.is_completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
          </div>
          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
             <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="w-10 h-10 rounded-xl bg-bg-primary border border-border-light flex items-center justify-center text-text-tertiary hover:text-indigo-600 hover:shadow-md transition-all"><Edit3 size={16}/></button>
             <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-10 h-10 rounded-xl bg-bg-primary border border-border-light flex items-center justify-center text-text-tertiary hover:text-danger hover:shadow-md transition-all"><Trash2 size={16}/></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, unit, status }: { label: string; value: string | number; unit?: string; status: 'default' | 'success' | 'warning' | 'danger' }) {
  const colors = {
    default: 'border-border-light text-text-primary',
    success: 'border-text-success/20 text-text-success bg-text-success/5',
    warning: 'border-gold/20 text-gold bg-gold/5',
    danger: 'border-text-danger/20 text-text-danger bg-text-danger/5'
  };
  return (
    <div className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center text-center shadow-lg shadow-black/[0.01] ${colors[status]}`}>
       <div className="text-2xl font-black tabular-nums">{value}{unit}</div>
       <div className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70">{label}</div>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch {}
  return null;
}
