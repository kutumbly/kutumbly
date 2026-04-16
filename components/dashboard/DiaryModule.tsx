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
import { useDiary } from '@/hooks/useDiary';
import ModuleShell from './ModuleShell';
import { useTranslation } from '@/lib/i18n';
import { Search, Book, Trash2, Calendar, Smile, Heart, MessageSquare, ArrowRight, BookOpen, MapPin, Cloud, Tag, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiaryEntry } from '@/types/db';
import { parseRichContent } from '@/lib/richContent';

type DiaryView = 'overview' | 'timeline' | 'reading';

const MOODS = ['happy', 'neutral', 'sad', 'grateful', 'anxious'];
const WEATHER = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy'];

export default function DiaryModule() {
  const { lang, currentPin } = useAppStore();
  const t = useTranslation(lang);
  const { entries, addEntry, deleteEntry } = useDiary();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cSubtitle, setCSubtitle] = useState('');
  const [cContent, setCContent] = useState('');
  const [cTags, setCTags] = useState('');
  const [cMood, setCMood] = useState<string>('neutral');
  const [cWeather, setCWeather] = useState('');
  const [cLocation, setCLocation] = useState('');
  const [cLocked, setCLocked] = useState(false);

  const [view, setView] = useState<DiaryView>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<DiaryEntry | null>(null);
  
  // Re-authentication state for viewing locked entries
  const [showPinPrompt, setShowPinPrompt] = useState<{ id: string } | null>(null);
  const [authPin, setAuthPin] = useState('');
  const [unlockedSessionEntries, setUnlockedSessionEntries] = useState<Set<string>>(new Set());

  const handleSaveEntry = () => {
    if (!cContent.trim()) return;
    addEntry({
      title: cTitle,
      subtitle: cSubtitle,
      content: cContent,
      tags: cTags,
      mood_label: cMood,
      weather: cWeather,
      location: cLocation,
      is_locked: cLocked
    });
    // Reset compose
    setCTitle(''); setCSubtitle(''); setCContent(''); setCTags('');
    setCMood('neutral'); setCWeather(''); setCLocation(''); setCLocked(false);
    setShowCompose(false);
  };

  const filteredEntries = entries.filter(e => {
    const textSearch = String(e.content).toLowerCase().includes(searchTerm.toLowerCase()) || 
                       String(e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       String(e.tags || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = searchTerm ? textSearch : true;
    const matchesMonth = selectedMonth ? new Date(String(e.date)).toLocaleString(lang === 'hi' || lang === 'bho' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' }) === selectedMonth : true;
    return matchesSearch && matchesMonth;
  });

  // Group entries by month for overview
  const monthGroups = entries.reduce((acc, entry) => {
     const m = new Date(String(entry.date)).toLocaleString(lang === 'hi' || lang === 'bho' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });
     acc[m] = (acc[m] || 0) + 1;
     return acc;
  }, {} as Record<string, number>);

  const getBreadcrumbs = () => {
    const b = [t('DIARY')];
    if (view === 'timeline' || view === 'reading') b.push(selectedMonth || (lang === 'en' ? 'Timeline' : (lang === 'hi' ? 'समय रेखा' : 'समय रेखा')));
    if (view === 'reading') b.push(activeEntry?.title || (lang === 'en' ? "Journal Entry" : "डायरी एंट्री"));
    return b;
  };

  const handleBack = () => {
    if (view === 'reading') setView('timeline');
    else if (view === 'timeline') setView('overview');
  };

  const handleEntryClick = (e: DiaryEntry) => {
    if (e.is_locked && !unlockedSessionEntries.has(e.id)) {
      setShowPinPrompt({ id: e.id });
    } else {
      setActiveEntry(e);
      setView('reading');
    }
  };

  const verifyPinAndUnlock = () => {
    if (authPin === currentPin && showPinPrompt) {
      setUnlockedSessionEntries(prev => new Set(prev).add(showPinPrompt.id));
      const entryToOpen = entries.find(x => x.id === showPinPrompt.id);
      if (entryToOpen) {
        setActiveEntry(entryToOpen);
        setView('reading');
      }
      setShowPinPrompt(null);
      setAuthPin('');
    } else {
      alert("Invalid PIN.");
      setAuthPin('');
    }
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? t('DIARY') :
        view === 'timeline' ? `${selectedMonth} Archive` :
        t('DIARY')
      }
      subtitle={view === 'overview' ? t('DIARY_SUBTITLE') : undefined}
      onAdd={view === 'overview' && !showCompose ? () => setShowCompose(true) : undefined}
      addLabel={t('NEW_ENTRY')}
      breadcrumbs={view !== 'overview' ? getBreadcrumbs() : undefined}
      onBack={view !== 'overview' ? handleBack : undefined}
    >
      <AnimatePresence mode="wait">
        {view === 'overview' && (
        <motion.div 
           key="overview"
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           className="space-y-8 md:space-y-12"
        >
        
        {/* Advanced Compose Panel */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl shadow-gold/5 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border-light pb-4">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                  {t('COMPOSE_MEMOIR')}
                </h3>
                <button onClick={() => setShowCompose(false)} className="text-text-tertiary hover:text-text-danger text-xs font-bold uppercase tracking-widest">✕</button>
              </div>

              <div className="flex flex-col gap-5">
                <input
                  autoFocus
                  placeholder={lang === 'hi' || lang === 'bho' ? (lang === 'bho' ? "शुरुआत कइसे भइल..." : "Shuruaat kya hui...") : "Title of your entry..."}
                  className="w-full bg-transparent border-none text-2xl font-black text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  value={cTitle}
                  onChange={e => setCTitle(e.target.value)}
                />

                <textarea
                  placeholder={lang === 'hi' || lang === 'bho' ? (lang === 'bho' ? "आज का भइल? अपने मन के बात लिखीं..." : "Aaj kya hua? Apne dil ki baat likhein...") : "Dear diary, today..."}
                  className="w-full bg-bg-secondary border border-border-light rounded-2xl p-6 text-[14px] font-bold text-text-primary leading-[1.8] resize-none focus:outline-none focus:border-gold transition-all min-h-[200px]"
                  value={cContent}
                  onChange={e => setCContent(e.target.value)}
                />

                {/* Metadata Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><Smile size={10} /> {t('MOOD_LABEL')}</label>
                    <select value={cMood} onChange={e => setCMood(e.target.value)} className="bg-bg-secondary border border-border-light rounded-xl p-3 text-xs font-black uppercase text-text-primary focus:border-gold outline-none">
                      {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><Tag size={10} /> {t('TAGS_LABEL')}</label>
                    <input type="text" placeholder="Work, Travel..." value={cTags} onChange={e => setCTags(e.target.value)} className="bg-bg-secondary border border-border-light rounded-xl p-3 text-xs font-bold text-text-primary focus:border-gold outline-none" />
                  </div>
 
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10} /> {t('LOCATION_LABEL')}</label>
                    <input type="text" placeholder="e.g Mumbai" value={cLocation} onChange={e => setCLocation(e.target.value)} className="bg-bg-secondary border border-border-light rounded-xl p-3 text-xs font-bold text-text-primary focus:border-gold outline-none" />
                  </div>
 
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1.5"><Cloud size={10} /> {t('WEATHER_LABEL')}</label>
                    <select value={cWeather} onChange={e => setCWeather(e.target.value)} className="bg-bg-secondary border border-border-light rounded-xl p-3 text-xs font-black uppercase text-text-primary focus:border-gold outline-none">
                      <option value="">{t('WEATHER_NONE')}</option>
                      {WEATHER.map(m => <option key={m} value={m}>{t(`WEATHER_${m.toUpperCase()}`)}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-bg-secondary border border-border-light p-4 rounded-xl mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-bg-tertiary rounded-lg text-gold">
                       <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest">{t('MARK_PRIVATE')}</h4>
                      <p className="text-[10px] text-text-tertiary mt-0.5">{t('PRIVATE_SUB')}</p>
                    </div>
                  </div>
                  <button onClick={() => setCLocked(!cLocked)} className={`w-12 h-6 rounded-full relative transition-colors ${cLocked ? 'bg-gold' : 'bg-bg-tertiary border border-border-light'}`}>
                    <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all shadow-sm ${cLocked ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <button
                  onClick={handleSaveEntry}
                  disabled={!cContent.trim()}
                  className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-gold/10 mt-2"
                >
                  {t('SAVE_TO_VAULT')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder={lang === 'hi' || lang === 'bho' ? (lang === 'bho' ? "कवनो पुरानी याद ढूँढीं..." : "Kuch purana dhundhein...") : "Search tags, titles or contents..."}
              className="w-full pl-14 pr-5 py-5 bg-bg-primary border border-border-light rounded-2xl text-[13px] font-black tracking-tight shadow-sm focus:outline-none focus:border-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Monthly Archives Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {Object.entries(monthGroups).map(([monthStr, count]) => {
             return (
               <motion.div 
                 key={monthStr}
                 whileHover={{ y: -2 }}
                 onClick={() => { setSelectedMonth(monthStr); setView('timeline'); }}
                 className="card p-6 flex flex-col items-center text-center group hover:border-gold/30 hover:shadow-xl transition-all cursor-pointer"
               >
                 <div className="w-16 h-16 rounded-full bg-bg-tertiary text-text-tertiary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-gold transition-all shadow-inner border border-border-light">
                    <BookOpen size={24} />
                 </div>
                 <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">{monthStr.split(' ')[0]}</h4>
                 <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{monthStr.split(' ')[1]}</p>
                 <div className="mt-4 px-3 py-1 bg-bg-tertiary rounded-full border border-border-light text-[9px] font-black text-text-secondary uppercase tracking-widest">
                    {count} Entries
                 </div>
               </motion.div>
             );
           })}
           {Object.keys(monthGroups).length === 0 && (
              <div className="col-span-4 text-center py-10 opacity-30">
                 <p className="text-[10px] font-black uppercase tracking-widest">No entries yet. Start writing your legacy.</p>
              </div>
           )}
        </div>
        </motion.div>
        )}

        {/* Timeline View */}
        {view === 'timeline' && (
        <motion.div 
           key="timeline"
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="space-y-8"
        >

        {/* PIN Prompt Modal */}
        <AnimatePresence>
          {showPinPrompt && (
             <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-bg-primary border border-border-light p-8 rounded-[2rem] w-full max-w-sm text-center shadow-2xl">
                 <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Lock size={32} />
                 </div>
                 <h3 className="text-lg font-black tracking-tight mb-2">Locked Entry</h3>
                 <p className="text-xs text-text-tertiary font-bold mb-6">Enter Vault PIN to read</p>
                 <input type="password" value={authPin} onChange={e=>setAuthPin(e.target.value)} placeholder="PIN" className="w-full text-center text-2xl tracking-[0.5em] p-4 bg-bg-secondary rounded-xl font-black mb-6 border border-border-light focus:border-gold outline-none" autoFocus />
                 <div className="flex gap-4">
                   <button onClick={() => {setShowPinPrompt(null); setAuthPin('');}} className="flex-1 py-4 bg-bg-tertiary text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-text-primary transition-colors">Cancel</button>
                   <button onClick={verifyPinAndUnlock} className="flex-1 py-4 bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold-light transition-colors shadow-lg shadow-gold/20">Unlock</button>
                 </div>
               </motion.div>
             </div>
          )}
        </AnimatePresence>

        <div className="grid gap-10 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[1px] before:bg-border-light">
          {filteredEntries.length > 0 ? filteredEntries.map((e, i) => {
            const isLockedView = e.is_locked && !unlockedSessionEntries.has(e.id);

            return (
            <motion.div 
              key={String(e.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-14 group"
            >
               {/* Date Dot */}
               <div className="absolute left-0 top-2 w-11 h-11 rounded-full bg-bg-primary border border-border-light shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  {e.is_locked ? <Lock size={14} className="text-gold" /> : <div className="w-2 h-2 rounded-full bg-gold"></div>}
               </div>

                <div 
                   onClick={() => handleEntryClick(e)}
                   className={`bg-bg-primary border ${isLockedView ? 'border-dashed border-border-light/50 bg-bg-primary/50' : 'border-border-light'} p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] relative overflow-hidden transition-all hover:border-gold/30 hover:shadow-2xl cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                       <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                             <span className="flex items-center gap-1.5 text-gold"><Calendar size={12}/> {new Date(String(e.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                             {e.weather && <span className="flex items-center gap-1 opacity-70"><Cloud size={10}/> {e.weather}</span>}
                             {e.location && <span className="flex items-center gap-1 opacity-70"><MapPin size={10}/> {e.location}</span>}
                          </div>
                          {!isLockedView && <h4 className="text-xl font-black text-text-primary tracking-tight">{e.title || "Untitled Entry"}</h4>}
                          {isLockedView && <h4 className="text-xl font-black text-text-tertiary tracking-tight flex items-center gap-3"><Lock size={18}/> Private Entry</h4>}
                       </div>
                    </div>
                    
                    {!isLockedView && (
                    <div className="flex items-center gap-4">
                       <div className="bg-bg-tertiary px-4 py-2 rounded-full border border-border-light flex items-center gap-2.5 shadow-sm">
                          <span className="text-lg">{String(e.mood_label || '📝')}</span>
                       </div>
                    </div>
                    )}
                  </div>

                  {!isLockedView && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {e.tags && e.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="bg-bg-tertiary border border-border-light text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full text-text-secondary select-none">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isLockedView ? (
                    <p className="text-sm font-bold text-text-secondary leading-[1.8] tracking-tight selection:bg-gold/20 line-clamp-3">
                      {String(e.content)}
                    </p>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center opacity-40">
                       <div className="blur-sm bg-text-tertiary h-2 w-3/4 rounded mb-2"></div>
                       <div className="blur-sm bg-text-tertiary h-2 w-1/2 rounded"></div>
                       <div className="text-[9px] font-black uppercase tracking-widest mt-4">Tap to unlock</div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between text-text-tertiary border-t border-border-light/50 pt-5">
                     <button onClick={(ev) => { ev.stopPropagation(); deleteEntry(e.id); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-colors z-20">
                        <Trash2 size={14} />
                     </button>
                     <div className="flex items-center gap-2 hover:text-gold transition-colors opacity-60">
                        <ArrowRight size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isLockedView ? 'Unlock' : 'Read Full'}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="py-32 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[3rem] opacity-40">
               <div className="w-24 h-24 bg-bg-tertiary rounded-full flex items-center justify-center mb-8">
                  <Book size={40} strokeWidth={1} className="text-text-tertiary" />
               </div>
               <p className="font-black uppercase tracking-[0.4em] text-[11px]">{t('DIARY_EMPTY')}</p>
            </div>
          )}
        </div>
        </motion.div>
        )}

        {/* Level 3: Immersive Reading Mode */}
        {view === 'reading' && activeEntry && (
        <motion.div 
           key="reading"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, x: -10 }}
           className="bg-bg-primary border border-border-light rounded-[3rem] p-10 md:p-16 max-w-3xl mx-auto shadow-2xl shadow-black/5 relative"
        >
           <div className="absolute top-0 right-0 p-8 flex items-center gap-3">
              {activeEntry.is_locked && <Lock size={20} className="text-text-tertiary opacity-50" />}
              <span className="text-4xl opacity-50">{String(activeEntry.mood_label || '📝')}</span>
           </div>

           <div className="mb-10 text-center border-b border-border-light/50 pb-10">
              <div className="inline-flex items-center justify-center gap-3 text-gold mb-6">
                 <div className="w-12 h-px bg-gold/30"></div>
                 <Calendar className="w-5 h-5" />
                 <div className="w-12 h-px bg-gold/30"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-4">
                 {activeEntry.title || new Date(String(activeEntry.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              {activeEntry.subtitle && (
                <h3 className="text-lg font-medium text-text-tertiary italic max-w-xl mx-auto">
                  "{activeEntry.subtitle}"
                </h3>
              )}
           </div>

           <div className="flex flex-wrap items-center opacity-60 gap-4 mb-8 text-[11px] font-black uppercase tracking-widest text-text-secondary border-b border-border-light pb-6">
              {activeEntry.weather && <span className="flex items-center gap-1.5"><Cloud size={14}/> {activeEntry.weather}</span>}
              {activeEntry.location && <span className="flex items-center gap-1.5"><MapPin size={14}/> {activeEntry.location}</span>}
              {activeEntry.tags && activeEntry.tags.split(',').map((tag, idx) => <span key={idx} className="flex items-center gap-1"><Tag size={12}/> {tag.trim()}</span>)}
           </div>

           <article className="prose prose-lg prose-headings:font-black prose-p:font-bold prose-p:text-text-primary prose-p:leading-[2] max-w-none mb-12">
             {parseRichContent(activeEntry.content)}
           </article>

           <div className="flex border-t border-border-light pt-8 justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-border-light flex items-center justify-center text-xs font-black">
                    KS
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{lang === 'hi' ? 'Kutumbly' : 'Secure Entry'}</div>
                    <div className="text-sm font-bold text-text-primary">Vault Memory Storage</div>
                 </div>
              </div>
              
              <button 
                onClick={() => { deleteEntry(activeEntry.id); setView('timeline'); }} 
                className="h-10 px-6 rounded-full bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">
                 Burn Memory
              </button>
           </div>
        </motion.div>
        )}
      </AnimatePresence>
    </ModuleShell>
  );
}
