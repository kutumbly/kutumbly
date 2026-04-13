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
import { Search, Book, Trash2, Calendar, Smile, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiaryModule() {
  const { lang } = useAppStore();
  const { entries } = useDiary();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(e => 
    String(e.content).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleShell 
      title={lang === 'en' ? "Family Diary" : "Parivar ki Diary"}
      subtitle={lang === 'en' ? "Preserving your legacy, day by day" : "Har din ki yaadein sahejien"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "Nayi Yaat Kholo" : "New Entry"}
    >
      <div className="space-y-8">
        
        {/* Search & Filter Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder={lang === 'en' ? "Dhundhein yahan..." : "Search through the past..."}
              className="w-full pl-12 pr-4 py-4 bg-bg-primary border border-border-light rounded-2xl text-sm font-bold tracking-tight shadow-sm focus:outline-none focus:border-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-14 h-14 bg-bg-primary border border-border-light rounded-2xl flex items-center justify-center text-text-tertiary hover:text-gold hover:border-gold transition-all shadow-sm">
             <MessageSquare size={20} />
          </button>
        </div>

        {/* Timeline List */}
        <div className="grid gap-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-border-light before:via-border-light before:to-transparent">
          {filteredEntries.length > 0 ? filteredEntries.map((e, i) => (
            <motion.div 
              key={String(e.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-12 group"
            >
               {/* Date Dot */}
               <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-bg-primary border-[3px] border-bg-tertiary shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
               </div>

               <div className="card p-6 border shadow-sm transition-all hover:border-gold/30 hover:shadow-xl bg-bg-primary relative overflow-hidden group-hover:-translate-y-1">
                  {/* Holographic accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center border border-border-light font-black text-xs text-text-tertiary tracking-tighter shadow-inner">
                          SM
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-text-primary uppercase tracking-tighter">Sunita Mallah</h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-0.5">
                             <Calendar size={10} className="text-gold" />
                             {String(e.date)}
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="bg-bg-secondary px-3 py-1.5 rounded-full border border-border-light flex items-center gap-2">
                          <span className="text-lg">{String(e.mood_label || '📝')}</span>
                          <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Feeling Good</span>
                       </div>
                       <button className="p-2 rounded-xl text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-bg-danger hover:text-white transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  <p className="text-base font-bold text-text-secondary leading-relaxed tracking-tight select-none">
                    {String(e.content)}
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-text-tertiary border-t border-border-light/30 pt-4">
                     <button className="flex items-center gap-1.5 hover:text-gold transition-colors">
                        <Heart size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Like</span>
                     </button>
                     <button className="flex items-center gap-1.5 hover:text-gold transition-colors">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Note</span>
                     </button>
                  </div>
               </div>
            </motion.div>
          )) : (
            <div className="py-24 flex flex-col items-center justify-center opacity-30">
               <Book size={64} strokeWidth={1} />
               <p className="font-black uppercase tracking-[0.4em] text-[10px] mt-6">Zero diary logs</p>
            </div>
          )}
        </div>
      </div>
    </ModuleShell>
  );
}
