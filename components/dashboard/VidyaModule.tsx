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
  School, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VidyaLearner, VidyaSubject, VidyaResource, VidyaResourceType } from '@/types/db';

/* ─── Types ────────────────────────────────────────────────── */
type VidyaView = 'overview' | 'learner' | 'subject' | 'resource';

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
  youtube:  'YouTube Video',
  pdf:      'PDF Document',
  article:  'Article / Link',
  book:     'Book / Notes',
  website:  'Website',
};

const DIFF_COLORS: Record<string, string> = {
  easy:   'text-text-success bg-text-success/10 border-text-success/20',
  medium: 'text-gold bg-gold/10 border-gold/20',
  hard:   'text-text-danger bg-text-danger/10 border-text-danger/20',
};

const MOODS = [
  { val: 'focused', label: 'Focused', emoji: '🧠' },
  { val: 'neutral', label: 'OK', emoji: '😐' },
  { val: 'tired', label: 'Tired', emoji: '😴' },
  { val: 'distracted', label: 'Distracted', emoji: '😵' },
];

function fmtMins(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/* ─── Main Component ────────────────────────────────────────── */
export default function VidyaModule() {
  const { lang } = useAppStore();
  const vidya = useVidya();

  // Navigation state
  const [view, setView] = useState<VidyaView>('overview');
  const [activeLearner, setActiveLearner] = useState<VidyaLearner | null>(null);
  const [activeSubject, setActiveSubject] = useState<VidyaSubject | null>(null);
  const [activeResource, setActiveResource] = useState<VidyaResource | null>(null);

  // Add Learner form
  const [showAddLearner, setShowAddLearner] = useState(false);
  const [lName, setLName]         = useState('');
  const [lInst, setLInst]         = useState('');
  const [lStd, setLStd]           = useState('');
  const [lBoard, setLBoard]       = useState('CBSE');
  const [lGoal, setLGoal]         = useState('');
  const [lDeadline, setLDeadline] = useState('');

  // Add Subject form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [sName, setSName]   = useState('');
  const [sCat, setSCat]     = useState('Science');
  const [sColor, setSColor] = useState('#6366f1');
  const [sScore, setSScore]  = useState('');

  // Add Resource form
  const [showAddResource, setShowAddResource] = useState(false);
  const [rTitle, setRTitle]     = useState('');
  const [rType, setRType]       = useState<VidyaResourceType>('youtube');
  const [rUrl, setRUrl]         = useState('');
  const [rChapter, setRChapter] = useState('');
  const [rLesson, setRLesson]   = useState('');
  const [rDesc, setRDesc]       = useState('');
  const [rDiff, setRDiff]       = useState<'easy' | 'medium' | 'hard'>('medium');
  const [rDuration, setRDuration] = useState('');

  // Log Session sheet
  const [showLogSession, setShowLogSession] = useState(false);
  const [logDuration, setLogDuration] = useState('');
  const [logSubjectId, setLogSubjectId] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logMood, setLogMood] = useState<'focused' | 'neutral' | 'tired' | 'distracted'>('focused');

  /* ── Computed ─────────────────────────────────────────── */
  const learnerSubjects = activeLearner ? vidya.getSubjects(activeLearner.id) : [];
  const learnerStats    = activeLearner ? vidya.getStats(activeLearner.id) : null;
  const learnerSessions = activeLearner ? vidya.getSessions(activeLearner.id, 10) : [];
  const subjectResources = activeSubject ? vidya.getResources(activeSubject.id) : [];

  /* ── Breadcrumbs ──────────────────────────────────────── */
  const getBreadcrumbs = (): string[] => {
    const b = [lang === 'en' ? 'Vidya' : 'विद्या'];
    if (activeLearner) b.push(activeLearner.name);
    if (activeSubject) b.push(activeSubject.name);
    if (activeResource) b.push('Resource');
    return b;
  };

  const handleBack = () => {
    if (view === 'resource') { setActiveResource(null); setView('subject'); }
    else if (view === 'subject') { setActiveSubject(null); setView('learner'); }
    else if (view === 'learner') { setActiveLearner(null); setView('overview'); }
  };

  /* ── Handlers ─────────────────────────────────────────── */
  const handleSaveLearner = () => {
    if (!lName.trim()) return;
    vidya.addLearner(lName, lInst, lStd, lBoard, lGoal, lDeadline);
    setLName(''); setLInst(''); setLStd(''); setLBoard('CBSE'); setLGoal(''); setLDeadline('');
    setShowAddLearner(false);
  };

  const handleSaveSubject = () => {
    if (!activeLearner || !sName.trim()) return;
    vidya.addSubject(activeLearner.id, sName, sCat, sColor, sScore);
    setSName(''); setSCat('Science'); setSColor('#6366f1'); setSScore('');
    setShowAddSubject(false);
  };

  const handleSaveResource = () => {
    if (!activeSubject || !activeLearner || !rTitle.trim()) return;
    vidya.addResource(activeSubject.id, activeLearner.id, rTitle, rType, rUrl, rChapter, rLesson, rDesc, Number(rDuration) || undefined, rDiff);
    setRTitle(''); setRType('youtube'); setRUrl(''); setRChapter(''); setRLesson(''); setRDesc(''); setRDuration('');
    setShowAddResource(false);
  };

  const handleLogSession = () => {
    if (!activeLearner || !logDuration) return;
    vidya.logSession(activeLearner.id, Number(logDuration), logSubjectId || undefined, logNotes, logMood);
    setLogDuration(''); setLogSubjectId(''); setLogNotes(''); setLogMood('focused');
    setShowLogSession(false);
  };

  /* ── Preview thumbnail for YouTube ───────────────────── */
  const previewThumb = rType === 'youtube' && rUrl ? getYouTubeThumbnail(rUrl) : null;

  /* ══════════════════════════════════════════════════════════
     LEVEL 1 — Overview (All Learners)
  ══════════════════════════════════════════════════════════ */
  const renderOverview = () => (
    <motion.div key="overview" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-10">

      {/* Add Learner Form */}
      <AnimatePresence>
        {showAddLearner && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">New Learner Profile</h3>
              <button onClick={() => setShowAddLearner(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name *" value={lName} onChange={setLName} placeholder="e.g. Priya Mallah" />
              <Field label="School / College / Platform" value={lInst} onChange={setLInst} placeholder="e.g. DPS, IIT Bombay, Coursera" />
              <Field label="Class / Standard / Year" value={lStd} onChange={setLStd} placeholder="e.g. Class 10, B.Tech 2nd Year" />
              <SelectField label="Board / Type" value={lBoard} onChange={setLBoard}
                options={['CBSE', 'ICSE', 'State Board', 'IGCSE', 'University', 'Competitive Exam', 'Online Course', 'Self-Study']} />
              <Field label="Learning Goal" value={lGoal} onChange={setLGoal} placeholder="e.g. Score 95%+, Crack JEE 2027" />
              <Field label="Goal Deadline" value={lDeadline} onChange={setLDeadline} type="date" />
            </div>
            <SaveBtn label="Add Learner" onClick={handleSaveLearner} disabled={!lName.trim()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatPill icon={<GraduationCap size={18} />} label="Learners" value={vidya.learners.length} />
        <StatPill icon={<BookOpen size={18} />} label="Subjects" value={vidya.learners.reduce((a, l) => a + vidya.getSubjects(l.id).length, 0)} />
        <StatPill icon={<Brain size={18} />} label="Resources" value={vidya.learners.reduce((a, l) => a + vidya.getAllResourcesForLearner(l.id).length, 0)} />
        <StatPill icon={<Flame size={18} className="text-gold" />} label="Study This Week" value={`${fmtMins(vidya.learners.reduce((a, l) => a + vidya.getStats(l.id).weekMins, 0))}`} />
      </div>

      {/* Learner Cards */}
      {vidya.learners.length === 0 ? (
        <EmptyState icon={<GraduationCap size={36} strokeWidth={1} />}
          title={lang === 'en' ? 'No Learners Yet' : 'Koi Vidyarthi Nahi'}
          subtitle={lang === 'en' ? 'Add yourself or a family member to start tracking studies.' : 'Parivaar ke kisi saathe ko jodein.'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vidya.learners.map(learner => {
            const stats = vidya.getStats(learner.id);
            const subjects = vidya.getSubjects(learner.id);
            return (
              <motion.div key={learner.id} whileHover={{ y: -3 }}
                onClick={() => { setActiveLearner(learner); setView('learner'); }}
                className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 cursor-pointer hover:border-gold/40 hover:shadow-2xl transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-gold/10 text-gold font-black text-lg flex items-center justify-center border border-gold/20 shadow-sm">
                      {learner.avatar_initials}
                    </div>
                    <div>
                      <h3 className="font-black text-text-primary text-base tracking-tight">{learner.name}</h3>
                      <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-0.5">{learner.standard} · {learner.board}</p>
                      {learner.institution && (
                        <p className="text-[11px] font-bold text-text-secondary mt-0.5 flex items-center gap-1">
                          <School size={10} className="opacity-60" /> {learner.institution}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-text-tertiary group-hover:text-gold transition-colors mt-1" />
                </div>

                {/* Goal */}
                {learner.goal && (
                  <div className="flex items-center gap-2 mb-5 bg-bg-tertiary border border-border-light rounded-2xl px-4 py-3">
                    <Target size={14} className="text-gold flex-shrink-0" />
                    <span className="text-[11px] font-bold text-text-secondary truncate">{learner.goal}</span>
                    {learner.goal_deadline && (
                      <span className="ml-auto text-[9px] font-black text-text-tertiary uppercase tracking-widest flex-shrink-0">{learner.goal_deadline}</span>
                    )}
                  </div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Subjects" value={stats.subjectCount} />
                  <MiniStat label="Resources" value={stats.resourceCount} />
                  <MiniStat label="This Week" value={fmtMins(stats.weekMins)} color="text-gold" />
                </div>

                {/* Subject pills */}
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border-light">
                    {subjects.slice(0, 4).map(s => (
                      <span key={s.id} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                        style={{ color: s.color, borderColor: s.color + '33', background: s.color + '11' }}>
                        {s.name}
                      </span>
                    ))}
                    {subjects.length > 4 && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black text-text-tertiary border border-border-light">+{subjects.length - 4}</span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  /* ══════════════════════════════════════════════════════════
     LEVEL 2 — Learner Detail (Subjects + Sessions)
  ══════════════════════════════════════════════════════════ */
  const renderLearner = () => {
    if (!activeLearner) return null;
    return (
      <motion.div key="learner" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-10">

        {/* Learner Hero */}
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 text-gold font-black text-xl flex items-center justify-center border border-gold/20 shadow-lg">
              {activeLearner.avatar_initials}
            </div>
            <div>
              <h2 className="text-xl font-black text-text-primary tracking-tight">{activeLearner.name}</h2>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{activeLearner.standard} · {activeLearner.board}</p>
              {activeLearner.institution && <p className="text-[12px] font-bold text-text-secondary mt-1">{activeLearner.institution}</p>}
            </div>
            <button onClick={() => setShowLogSession(true)} className="ml-auto flex items-center gap-2 h-11 px-6 bg-gold-text text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-gold/10">
              <Clock size={14} /> Log Study
            </button>
          </div>
          {activeLearner.goal && (
            <div className="flex items-center gap-3 bg-bg-tertiary border border-border-light rounded-2xl px-5 py-3">
              <Target size={16} className="text-gold" />
              <span className="text-[13px] font-bold text-text-primary">{activeLearner.goal}</span>
              {activeLearner.goal_deadline && <span className="ml-auto text-[10px] font-black text-text-tertiary uppercase tracking-widest">{activeLearner.goal_deadline}</span>}
            </div>
          )}
        </div>

        {/* Log Session sheet */}
        <AnimatePresence>
          {showLogSession && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">Log Study Session</h3>
                <button onClick={() => setShowLogSession(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Duration (minutes) *" value={logDuration} onChange={setLogDuration} type="number" placeholder="e.g. 45" />
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Subject (optional)</label>
                  <select value={logSubjectId} onChange={e => setLogSubjectId(e.target.value)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold">
                    <option value="">General Study</option>
                    {learnerSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <Field label="Notes" value={logNotes} onChange={setLogNotes} placeholder="What did you cover?" />
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map(m => (
                      <button key={m.val} onClick={() => setLogMood(m.val as any)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${logMood === m.val ? 'bg-gold/10 border-gold text-gold' : 'border-border-light text-text-tertiary'}`}>
                        {m.emoji} {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <SaveBtn label="Save Session" onClick={handleLogSession} disabled={!logDuration} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        {learnerStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatPill icon={<Clock size={16} />} label="Total Study" value={fmtMins(learnerStats.totalMins)} />
            <StatPill icon={<Flame size={16} className="text-gold" />} label="This Week" value={fmtMins(learnerStats.weekMins)} />
            <StatPill icon={<BookOpen size={16} />} label="Resources" value={learnerStats.resourceCount} />
            <StatPill icon={<CheckCircle2 size={16} className="text-text-success" />} label="Completed" value={learnerStats.completedCount} />
          </div>
        )}

        {/* Add Subject Form */}
        <AnimatePresence>
          {showAddSubject && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">Add Subject</h3>
                <button onClick={() => setShowAddSubject(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Subject Name *" value={sName} onChange={setSName} placeholder="e.g. Physics, Python" />
                <SelectField label="Category" value={sCat} onChange={setSCat}
                  options={['Science', 'Commerce', 'Arts', 'Tech', 'Language', 'Competitive', 'General']} />
                <Field label="Target Score" value={sScore} onChange={setSScore} placeholder="e.g. 90%+" />
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Accent Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#c9971c', '#ec4899'].map(c => (
                      <button key={c} onClick={() => setSColor(c)}
                        className={`w-9 h-9 rounded-full border-4 transition-all ${sColor === c ? 'border-text-primary scale-110' : 'border-transparent'}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
              <SaveBtn label="Add Subject" onClick={handleSaveSubject} disabled={!sName.trim()} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subjects Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">
              {lang === 'en' ? 'Subjects' : 'Vishay'} ({learnerSubjects.length})
            </h3>
            {!showAddSubject && (
              <button onClick={() => setShowAddSubject(true)}
                className="flex items-center gap-2 h-9 px-5 bg-bg-secondary border border-border-light rounded-xl text-[10px] font-black text-text-tertiary hover:text-gold hover:border-gold transition-all">
                <Plus size={12} /> Add Subject
              </button>
            )}
          </div>
          {learnerSubjects.length === 0 ? (
            <EmptyState icon={<BookOpen size={32} strokeWidth={1} />} title="No Subjects Yet" subtitle="Add subjects to organise your study resources." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {learnerSubjects.map(sub => {
                const resources = vidya.getResources(sub.id);
                const done = resources.filter(r => r.is_completed).length;
                return (
                  <motion.div key={sub.id} whileHover={{ y: -3 }}
                    onClick={() => { setActiveSubject(sub); setView('subject'); }}
                    className="bg-bg-primary border border-border-light rounded-[2rem] p-6 cursor-pointer hover:shadow-xl transition-all group"
                    style={{ borderTopColor: sub.color, borderTopWidth: 3 }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sub.color + '22' }}>
                        <BookOpen size={18} style={{ color: sub.color }} />
                      </div>
                      <ChevronRight size={16} className="text-text-tertiary group-hover:text-gold transition-colors" />
                    </div>
                    <h4 className="font-black text-text-primary tracking-tight mb-1">{sub.name}</h4>
                    <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-4">{sub.category}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-tertiary">
                      <span>{resources.length} resources</span>
                      <span className="text-text-success">{done} done</span>
                    </div>
                    {sub.target_score && (
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-text-tertiary">
                        <Target size={10} style={{ color: sub.color }} /> Target: {sub.target_score}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        {learnerSessions.length > 0 && (
          <div>
            <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-5">Recent Study Sessions</h3>
            <div className="space-y-3">
              {learnerSessions.slice(0, 5).map(s => {
                const sub = learnerSubjects.find(x => x.id === s.subject_id);
                const mood = MOODS.find(m => m.val === s.mood);
                return (
                  <div key={s.id} className="bg-bg-primary border border-border-light rounded-2xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg">{mood?.emoji || '📖'}</div>
                      <div>
                        <div className="text-[12px] font-black text-text-primary">{sub?.name || 'General Study'}</div>
                        <div className="text-[10px] font-bold text-text-tertiary">{s.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-black text-gold">{fmtMins(s.duration_mins)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 3 — Subject Detail (Resources list)
  ══════════════════════════════════════════════════════════ */
  const renderSubject = () => {
    if (!activeSubject) return null;
    const done = subjectResources.filter(r => r.is_completed).length;
    return (
      <motion.div key="subject" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-8">

        {/* Subject Hero */}
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8" style={{ borderTopColor: activeSubject.color, borderTopWidth: 4 }}>
          <div className="flex items-center gap-5 mb-4">
            <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-lg" style={{ background: activeSubject.color + '22' }}>
              <BookOpen size={24} style={{ color: activeSubject.color }} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text-primary">{activeSubject.name}</h2>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{activeSubject.category}{activeSubject.target_score ? ` · Target: ${activeSubject.target_score}` : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Total" value={subjectResources.length} />
            <MiniStat label="Done" value={done} color="text-text-success" />
            <MiniStat label="Bookmarked" value={subjectResources.filter(r => r.is_bookmarked).length} color="text-gold" />
          </div>
        </div>

        {/* Add Resource Form */}
        <AnimatePresence>
          {showAddResource && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">Add Study Resource</h3>
                <button onClick={() => setShowAddResource(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
              </div>

              {/* Type selector */}
              <div>
                <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest block mb-3">Resource Type</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(RESOURCE_LABELS) as VidyaResourceType[]).map(t => {
                    const Icon = RESOURCE_ICONS[t];
                    return (
                      <button key={t} onClick={() => setRType(t)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black border transition-all ${rType === t ? 'border-gold bg-gold/10 text-gold' : 'border-border-light text-text-tertiary hover:border-gold/30'}`}>
                        <Icon size={13} style={{ color: rType === t ? undefined : RESOURCE_COLORS[t] }} />
                        {RESOURCE_LABELS[t]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title *" value={rTitle} onChange={setRTitle} placeholder="e.g. Chapter 5 — Optics (Khan Academy)" />
                <Field label={rType === 'youtube' ? 'YouTube URL' : rType === 'pdf' ? 'PDF URL / Path' : 'Link URL'} value={rUrl} onChange={setRUrl} placeholder="https://..." />
                <Field label="Chapter" value={rChapter} onChange={setRChapter} placeholder="e.g. Chapter 5" />
                <Field label="Lesson / Topic" value={rLesson} onChange={setRLesson} placeholder="e.g. Lesson 2 — Refraction" />
                <Field label="Duration (mins)" value={rDuration} onChange={setRDuration} type="number" placeholder={rType === 'youtube' ? 'Video length' : 'Estimated read time'} />
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Difficulty</label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map(d => (
                      <button key={d} onClick={() => setRDiff(d)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black border capitalize transition-all ${rDiff === d ? DIFF_COLORS[d] : 'border-border-light text-text-tertiary'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Field label="Description / Notes" value={rDesc} onChange={setRDesc} placeholder="Quick summary or what to focus on..." />
                </div>
              </div>

              {/* YouTube thumbnail preview */}
              {previewThumb && (
                <div className="flex items-center gap-4 bg-bg-secondary border border-border-light rounded-2xl p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewThumb} alt="thumbnail" className="w-32 h-20 object-cover rounded-xl border border-border-light" />
                  <div>
                    <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1">Thumbnail Preview</div>
                    <div className="text-[11px] font-bold text-text-primary">{rTitle || 'YouTube Video'}</div>
                  </div>
                </div>
              )}

              <SaveBtn label="Save Resource" onClick={handleSaveResource} disabled={!rTitle.trim()} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resource filter pills */}
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">Resources ({subjectResources.length})</h3>
          {!showAddResource && (
            <button onClick={() => setShowAddResource(true)}
              className="flex items-center gap-2 h-9 px-5 bg-bg-secondary border border-border-light rounded-xl text-[10px] font-black text-text-tertiary hover:text-gold hover:border-gold transition-all">
              <Plus size={12} /> Add Resource
            </button>
          )}
        </div>

        {subjectResources.length === 0 ? (
          <EmptyState icon={<BookOpen size={32} strokeWidth={1} />} title="No Resources Yet" subtitle="Add YouTube videos, PDFs, articles or websites to study." />
        ) : (
          <div className="space-y-4">
            {subjectResources.map(res => (
              <ResourceCard key={res.id} res={res}
                onOpen={() => { setActiveResource(res); setView('resource'); }}
                onBookmark={() => vidya.toggleBookmark(res.id, res.is_bookmarked)}
                onComplete={() => vidya.toggleComplete(res.id, res.is_completed)}
                onDelete={() => vidya.deleteResource(res.id)}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     LEVEL 4 — Resource Detail
  ══════════════════════════════════════════════════════════ */
  const renderResource = () => {
    if (!activeResource) return null;
    const Icon = RESOURCE_ICONS[activeResource.resource_type];
    const color = RESOURCE_COLORS[activeResource.resource_type];
    return (
      <motion.div key="resource" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-8">

        {/* Thumbnail / Hero */}
        {activeResource.thumbnail_url ? (
          <div className="relative rounded-[2.5rem] overflow-hidden border border-border-light shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeResource.thumbnail_url} alt={activeResource.title} className="w-full h-52 md:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div>
                <div className="text-[9px] font-black text-white/80 uppercase tracking-[0.3em] mb-2">{RESOURCE_LABELS[activeResource.resource_type]}</div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">{activeResource.title}</h2>
              </div>
            </div>
            {activeResource.resource_type === 'youtube' && activeResource.url && (
              <a href={activeResource.url} target="_blank" rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play size={26} className="text-white ml-1" fill="white" />
                </div>
              </a>
            )}
          </div>
        ) : (
          <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center" style={{ background: color + '22' }}>
              <Icon size={36} style={{ color }} />
            </div>
            <div>
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2">{RESOURCE_LABELS[activeResource.resource_type]}</div>
              <h2 className="text-xl font-black text-text-primary tracking-tight">{activeResource.title}</h2>
            </div>
          </div>
        )}

        {/* Meta grid */}
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activeResource.chapter && <MetaItem label="Chapter" value={activeResource.chapter} />}
            {activeResource.lesson && <MetaItem label="Lesson / Topic" value={activeResource.lesson} />}
            {activeResource.difficulty && (
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Difficulty</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border w-fit capitalize ${DIFF_COLORS[activeResource.difficulty]}`}>{activeResource.difficulty}</span>
              </div>
            )}
            {activeResource.duration_mins && <MetaItem label="Duration" value={fmtMins(activeResource.duration_mins)} />}
          </div>

          {activeResource.description && (
            <div>
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-2">Notes</div>
              <p className="text-[13px] font-bold text-text-secondary leading-relaxed">{activeResource.description}</p>
            </div>
          )}

          {activeResource.tags && (
            <div className="flex flex-wrap gap-2">
              {activeResource.tags.split(',').map(tag => (
                <span key={tag} className="px-3 py-1 bg-bg-tertiary border border-border-light rounded-full text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {activeResource.url && (
            <a href={activeResource.url} target="_blank" rel="noopener noreferrer"
              className="flex-1 h-14 bg-gold-text text-white font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-gold/10">
              {activeResource.resource_type === 'youtube' ? <><Play size={16} fill="white" /> Watch on YouTube</> : <><ArrowUpRight size={16} /> Open Resource</>}
            </a>
          )}
          <button onClick={() => vidya.toggleComplete(activeResource.id, activeResource.is_completed)}
            className={`flex-1 h-14 font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 border-2 transition-all ${activeResource.is_completed ? 'bg-text-success/10 border-text-success text-text-success' : 'border-border-light text-text-secondary hover:border-gold hover:text-gold'}`}>
            {activeResource.is_completed ? <><CheckCircle2 size={16} /> Completed!</> : <><Circle size={16} /> Mark as Done</>}
          </button>
          <button onClick={() => vidya.toggleBookmark(activeResource.id, activeResource.is_bookmarked)}
            className={`h-14 px-6 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all ${activeResource.is_bookmarked ? 'bg-gold/10 border-gold text-gold' : 'border-border-light text-text-tertiary hover:border-gold hover:text-gold'}`}>
            {activeResource.is_bookmarked ? <BookMarked size={18} /> : <Bookmark size={18} />}
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
        view === 'overview' ? (lang === 'en' ? 'Vidya — Study Buddy' : 'विद्या — पारिवारिक पाठशाला') :
        view === 'learner' ? activeLearner?.name ?? 'Learner' :
        view === 'subject' ? activeSubject?.name ?? 'Subject' :
        activeResource?.title ?? 'Resource'
      }
      subtitle={view === 'overview' ? (lang === 'en' ? 'Sovereign learning for every family member' : 'Har parivar ka apna adhyayan kendra') : undefined}
      onAdd={view === 'overview' && !showAddLearner ? () => setShowAddLearner(true) : undefined}
      addLabel={lang === 'en' ? 'Add Learner' : 'Vidyarthi Jodein'}
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
              {RESOURCE_LABELS[res.resource_type]}
            </div>
            {res.difficulty && (
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${DIFF_COLORS[res.difficulty]}`}>{res.difficulty}</span>
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
          <button onClick={onComplete} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${res.is_completed ? 'text-text-success bg-text-success/10' : 'text-text-tertiary hover:text-text-success hover:bg-text-success/5'}`}>
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
