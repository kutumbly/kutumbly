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
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      title={lang === 'en' ? "Family Tasks" : "Parivar ke Kaam"}
      subtitle={lang === 'en' ? "Staying organized together" : "Mil kar kaam poore karein"}
      onAdd={() => {}}
      addLabel={lang === 'en' ? "Naya Kaam" : "New Task"}
    >
      <div className="space-y-8">
        
        {/* Modern Filter Pills */}
        <div className="flex items-center gap-3 p-1 bg-bg-secondary rounded-2xl border border-border-light w-fit">
          {(['pending', 'done', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filter === f 
                  ? "bg-bg-primary text-gold shadow-md shadow-gold/5" 
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {f === 'pending' ? 'Baaki' : f === 'done' ? 'Poore' : 'Sab'}
            </button>
          ))}
        </div>

        {/* Dynamic Task Grid */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? filteredTasks.map((t) => {
               const priority = getPriorityInfo(String(t.priority));
               const isDone = t.status === 'done';
               return (
                <motion.div 
                  layout
                  key={String(t.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`card p-6 flex gap-6 items-start group transition-all duration-300 ${isDone ? 'opacity-50 grayscale select-none' : 'hover:border-gold/30 hover:shadow-xl ring-0 hover:ring-1 hover:ring-gold/10'}`}
                >
                  <button 
                    onClick={() => toggleTask(String(t.id), String(t.status))}
                    className={`mt-1 flex-shrink-0 transition-all duration-500 scale-125 ${isDone ? 'text-gold' : 'text-border-medium group-hover:text-gold'}`}
                  >
                    {isDone ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} strokeWidth={2} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h3 className={`text-base font-black tracking-tight leading-tight ${isDone ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                            {String(t.title)}
                          </h3>
                       </div>
                       <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border tracking-widest ${priority.color}`}>
                          {priority.label}
                       </div>
                    </div>
                    
                    {t.description && !isDone && (
                      <p className="text-sm font-bold text-text-secondary mb-4 leading-relaxed tracking-tight">
                        {String(t.description)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-[0.15em]">
                        <Clock size={14} className={isDone ? 'text-text-tertiary' : 'text-gold'} />
                        {String(t.due_date)}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-[0.15em]">
                        <div className="w-5 h-5 rounded-lg bg-bg-tertiary border border-border-light flex items-center justify-center text-[8px] shadow-inner font-black">
                          {String(t.assigned_to).slice(0, 2).toUpperCase()}
                        </div>
                        {String(t.assigned_to)}
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 rounded-xl text-text-tertiary hover:bg-bg-danger hover:text-white transition-all">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-24 flex flex-col items-center justify-center opacity-20 text-center">
                 <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
                    <AlertCircle size={40} strokeWidth={1} />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.3em]">Huraay! No tasks</h2>
                 <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-2 px-10">Sab kuch poora ho gaya hai.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModuleShell>
  );
}
