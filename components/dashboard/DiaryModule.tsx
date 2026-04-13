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
import { Search, Book, Trash2, Calendar, Smile, Heart, MessageSquare, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiaryEntry } from '@/types/db';

type DiaryView = 'overview' | 'timeline' | 'reading';

export default function DiaryModule() {
  const { lang } = useAppStore();
  const { entries } = useDiary();
  const [searchTerm, setSearchTerm] = useState('');

  const [view, setView] = useState<DiaryView>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<DiaryEntry | null>(null);

  const filteredEntries = entries.filter(e => {
    const matchesSearch = String(e.content).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth ? new Date(String(e.date)).toLocaleString('en-US', { month: 'long', year: 'numeric' }) === selectedMonth : true;
    return matchesSearch && matchesMonth;
  });

  // Group entries by month for overview
  const monthGroups = entries.reduce((acc, entry) => {
     const m = new Date(String(entry.date)).toLocaleString('en-US', { month: 'long', year: 'numeric' });
     acc[m] = (acc[m] || 0) + 1;
     return acc;
  }, {} as Record<string, number>);

  const getBreadcrumbs = () => {
    const b = [lang === 'en' ? "Diary" : "Dastaan"];
    if (view === 'timeline' || view === 'reading') b.push(selectedMonth || 'Timeline');
    if (view === 'reading') b.push("Journal Entry");
    return b;
  };

  const handleBack = () => {
    if (view === 'reading') setView('timeline');
    else if (view === 'timeline') setView('overview');
  };

  return (
    <ModuleShell 
      title={
        view === 'overview' ? (lang === 'en' ? "Family Diary" : "Dastaan-e-Parivar") :
        view === 'timeline' ? `${selectedMonth} Achive` :
        "Memoir"
      }
      subtitle={view === 'overview' ? (lang === 'en' ? "Preserving your legacy, day by day" : "Har din ki yaadein, hamesha ke liye") : undefined}
      onAdd={() => {}}
      addLabel={view === 'overview' ? (lang === 'en' ? "New Journal" : "Nayi Yaadein") : "Write Entry"}
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
        
        {/* Search & Filter Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder={lang === 'hi' ? "Kuch purana dhundhein..." : "Search through the past..."}
              className="w-full pl-14 pr-5 py-5 bg-bg-primary border border-border-light rounded-2xl text-[13px] font-black tracking-tight shadow-sm focus:outline-none focus:border-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-16 h-16 bg-bg-primary border border-border-light rounded-2xl flex items-center justify-center text-text-tertiary hover:text-gold hover:border-gold transition-all shadow-sm">
             <MessageSquare size={22} />
          </button>
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
        <div className="grid gap-10 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[1px] before:bg-border-light">
          {filteredEntries.length > 0 ? filteredEntries.map((e, i) => (
            <motion.div 
              key={String(e.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-14 group"
            >
               {/* Date Dot */}
               <div className="absolute left-0 top-2 w-11 h-11 rounded-full bg-bg-primary border border-border-light shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
               </div>

                <div 
                   onClick={() => { setActiveEntry(e); setView('reading'); }}
                   className="bg-bg-primary border border-border-light p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] relative overflow-hidden transition-all hover:border-gold/30 hover:shadow-2xl cursor-pointer"
                >
                  {/* Subtle paper texture overlay could be added here */}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gold-light flex items-center justify-center border border-border-light font-black text-xs text-gold-text tracking-tighter shadow-sm">
                          SM
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">{lang === 'hi' ? 'Sunita Mallah' : 'Sunita Mallah'}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">
                             <Calendar size={12} className="text-gold" />
                             {new Date(String(e.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <div className="bg-bg-tertiary px-4 py-2 rounded-full border border-border-light flex items-center gap-2.5">
                          <span className="text-xl">{String(e.mood_label || '📝')}</span>
                          <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">{lang === 'hi' ? 'Theek Hai' : 'Feeling Good'}</span>
                       </div>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-text-secondary leading-[1.6] tracking-tight selection:bg-gold/20 line-clamp-3">
                    {String(e.content)}
                  </p>

                  <div className="mt-8 flex items-center gap-6 text-text-tertiary border-t border-border-light/50 pt-5">
                     <button className="flex items-center gap-2 hover:text-gold transition-colors">
                        <Heart size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">1</span>
                     </button>
                     <div className="flex items-center gap-2 hover:text-gold transition-colors opacity-60">
                        <ArrowRight size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Read More</span>
                     </div>
                  </div>
                </div>
             </motion.div>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[3rem] opacity-40">
               <div className="w-24 h-24 bg-bg-tertiary rounded-full flex items-center justify-center mb-8">
                  <Book size={40} strokeWidth={1} className="text-text-tertiary" />
               </div>
               <p className="font-black uppercase tracking-[0.4em] text-[11px]">{lang === 'hi' ? 'Diary Khaali Hai' : 'Zero diary logs'}</p>
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
           className="bg-bg-primary border border-border-light rounded-[3rem] p-10 md:p-16 max-w-3xl mx-auto shadow-2xl shadow-gold/5 relative"
        >
           <div className="absolute top-0 right-0 p-8">
              <span className="text-4xl opacity-50">{String(activeEntry.mood_label || '📝')}</span>
           </div>

           <div className="mb-10 text-center border-b border-border-light/50 pb-10">
              <div className="inline-flex items-center justify-center gap-3 text-gold mb-6">
                 <div className="w-12 h-px bg-gold/30"></div>
                 <Calendar className="w-5 h-5" />
                 <div className="w-12 h-px bg-gold/30"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                 {new Date(String(activeEntry.date)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
           </div>

           <article className="prose prose-lg prose-headings:font-black prose-p:font-medium prose-p:text-text-secondary prose-p:leading-[1.8] max-w-none mb-12">
             {String(activeEntry.content).split('\n').map((para, i) => (
                <p key={i} className="mb-6">{para}</p>
             ))}
           </article>

           <div className="flex border-t border-border-light pt-8 justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-border-light flex items-center justify-center text-xs font-black">
                    SM
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{lang === 'hi' ? 'Lekhak' : 'Penner'}</div>
                    <div className="text-sm font-bold text-text-primary">Sunita Mallah</div>
                 </div>
              </div>
              
              <button className="h-10 px-6 rounded-full bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">
                 Burn Memory
              </button>
           </div>
        </motion.div>
        )}
      </AnimatePresence>
    </ModuleShell>
  );
}
