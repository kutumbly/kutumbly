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
      title={lang === 'en' ? "Family Diary" : "Dastaan-e-Parivar"}
      subtitle={lang === 'en' ? "Preserving your legacy, day by day" : "Har din ki yaadein, hamesha ke liye"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "New Journal" : "Nayi Yaadein"}
    >
      <div className="space-y-8 md:space-y-12">
        
        {/* Search & Filter Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder={lang === 'hi' ? "Kuch purana dhundhein..." : "Search through the past..."}
              className="w-full pl-14 pr-5 py-5 bg-white border border-border-light rounded-2xl text-[13px] font-black tracking-tight shadow-sm focus:outline-none focus:border-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-16 h-16 bg-white border border-border-light rounded-2xl flex items-center justify-center text-text-tertiary hover:text-gold hover:border-gold transition-all shadow-sm">
             <MessageSquare size={22} />
          </button>
        </div>

        {/* Timeline List */}
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
               <div className="absolute left-0 top-2 w-11 h-11 rounded-full bg-white border border-border-light shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
               </div>

               <div className="bg-white border border-border-light p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] relative overflow-hidden transition-all hover:border-gold/30 hover:shadow-2xl">
                  {/* Subtle paper texture overlay could be added here */}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[#fdfaf5] flex items-center justify-center border border-border-light font-black text-xs text-gold-text tracking-tighter shadow-sm">
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
                       <div className="bg-[#FAF9F6] px-4 py-2 rounded-full border border-border-light flex items-center gap-2.5">
                          <span className="text-xl">{String(e.mood_label || '📝')}</span>
                          <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">{lang === 'hi' ? 'Theek Hai' : 'Feeling Good'}</span>
                       </div>
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-text-secondary leading-[1.6] tracking-tight selection:bg-gold/20">
                    {String(e.content)}
                  </p>

                  <div className="mt-8 flex items-center gap-6 text-text-tertiary border-t border-border-light/50 pt-5">
                     <button className="flex items-center gap-2 hover:text-gold transition-colors">
                        <Heart size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sanjeeda</span>
                     </button>
                     <button className="flex items-center gap-2 hover:text-gold transition-colors">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Memory</span>
                     </button>
                  </div>
               </div>
            </motion.div>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center bg-white border border-border-light border-dashed rounded-[3rem] opacity-40">
               <div className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-8">
                  <Book size={40} strokeWidth={1} className="text-text-tertiary" />
               </div>
               <p className="font-black uppercase tracking-[0.4em] text-[11px]">{lang === 'hi' ? 'Diary Khaali Hai' : 'Zero diary logs'}</p>
            </div>
          )}
        </div>
      </div>
    </ModuleShell>
  );
}
