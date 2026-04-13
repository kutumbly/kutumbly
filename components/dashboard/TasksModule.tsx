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
import { useTasks } from '@/hooks/useTasks';
import ModuleShell from './ModuleShell';
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FamilyTask } from '@/types/db';

export default function TasksModule() {
  const { lang } = useAppStore();
  const { tasks, toggleTask } = useTasks();
  const [filter, setFilter] = useState<'pending' | 'done' | 'all'>('pending');

  const filteredTasks = tasks.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  const getPriorityInfo = (p: string) => {
    switch(p) {
      case 'high': return { color: 'text-text-danger bg-bg-danger border-text-danger/10', label: lang === 'en' ? 'Urgent' : 'Zaroori' };
      case 'medium': return { color: 'text-gold bg-gold/10 border-gold/20', label: lang === 'en' ? 'Planned' : 'Taiyari' };
      default: return { color: 'text-text-tertiary bg-bg-tertiary border-border-light', label: lang === 'en' ? 'Routine' : 'Aam' };
    }
  };

  return (
    <ModuleShell 
      title={lang === 'en' ? "Family Tasks" : "Parivar ke Kartavya"}
      subtitle={lang === 'en' ? "Staying organized together" : "Mil kar kaam poore karein"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "New Task" : "Naya Kaam"}
    >
      <div className="space-y-8 md:space-y-10">
        
        {/* Modern Filter Pills */}
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-border-light w-fit shadow-sm">
          {(['pending', 'done', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filter === f 
                  ? "bg-gold-text text-white shadow-md" 
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {f === 'pending' ? 'Baaki' : f === 'done' ? 'Poore' : 'Sab'}
            </button>
          ))}
        </div>

        {/* Dynamic Task Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? filteredTasks.map((t: FamilyTask, idx: number) => {
               const priority = getPriorityInfo(t.priority);
               const isDone = t.status === 'done';
               return (
                <motion.div 
                  layout
                  key={String(t.id)}
                  initial={{ opacity: 0, scale: 0.98, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white border border-border-light p-6 rounded-[2rem] flex gap-6 items-start group shadow-black/[0.01] shadow-xl transition-all duration-300 ${isDone ? 'opacity-40 grayscale select-none' : 'hover:border-gold/30 hover:shadow-2xl'}`}
                >
                  <button 
                    onClick={() => toggleTask(t.id, t.status)}
                    className={`mt-1 flex-shrink-0 transition-all duration-300 transform active:scale-75 ${isDone ? 'text-gold' : 'text-border-medium group-hover:text-gold'}`}
                  >
                    {isDone ? <CheckCircle2 size={26} strokeWidth={3} /> : <Circle size={26} strokeWidth={2} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                       <h3 className={`text-base font-black tracking-tight leading-tight ${isDone ? 'line-through text-text-tertiary font-bold' : 'text-text-primary'}`}>
                         {t.title}
                       </h3>
                       <div className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border tracking-[0.2em] shadow-sm ${priority.color}`}>
                          {priority.label}
                       </div>
                    </div>
                    
                    {t.description && !isDone && (
                      <p className="text-[13px] font-bold text-text-secondary mb-5 leading-relaxed tracking-tight max-w-lg">
                        {t.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                        <Clock size={14} className={isDone ? 'text-text-tertiary' : 'text-gold-text'} />
                        {t.due_date || (lang === 'en' ? 'No Due Date' : 'Tarik Nahi')}
                      </div>
                      <div className="flex items-center gap-2.5 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-[#FAF9F6] border border-border-light flex items-center justify-center text-[9px] shadow-sm font-black text-gold-text">
                          {String(t.assigned_to).slice(0, 2).toUpperCase()}
                        </div>
                        {t.assigned_to}
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                     <button className="w-10 h-10 flex items-center justify-center rounded-xl text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-32 flex flex-col items-center justify-center bg-white border border-border-light border-dashed rounded-[3rem] opacity-40">
                 <div className="w-20 h-20 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-6">
                    <AlertCircle size={32} strokeWidth={1} className="text-text-tertiary" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.4em]">All tasks complete</h2>
                 <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-2">Kartavya poore ho gaye hain.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModuleShell>
  );
}
