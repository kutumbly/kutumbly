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
import { useVault } from '@/hooks/useVault';
import ModuleShell from './ModuleShell';
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2, Home, Briefcase, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FamilyTask, FamilyMember } from '@/types/db';

const CATEGORIES = [
  { name: 'Home', icon: Home, color: '#f59e0b' },
  { name: 'Work', icon: Briefcase, color: '#3b82f6' },
  { name: 'Personal', icon: User, color: '#10b981' },
  { name: 'Family', icon: Users, color: '#ec4899' }
];

export default function TasksModule() {
  const { lang } = useAppStore();
  const { getFamilyMembers } = useVault();
  const family = getFamilyMembers();
  const { tasks, toggleTask, addTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<'pending' | 'done' | 'all'>('pending');
  const [catFilter, setCatFilter] = useState<string>('all');

  // Add Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tPriority, setTPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [tCategory, setTCategory] = useState('Home');
  const [tAssignedTo, setTAssignedTo] = useState(family?.[0]?.name || 'Everyone');
  const [tDueDate, setTDueDate] = useState('');

  const filteredTasks = tasks.filter(t => {
    const stMatch = filter === 'all' ? true : t.status === filter;
    const catMatch = catFilter === 'all' ? true : t.category === catFilter || (catFilter === 'Home' && !t.category);
    return stMatch && catMatch;
  });

  const getPriorityInfo = (p: string) => {
    switch(p) {
      case 'high': return { color: 'text-text-danger bg-bg-danger border-text-danger/10', label: lang === 'en' ? 'Urgent' : 'Zaroori' };
      case 'medium': return { color: 'text-gold bg-gold/10 border-gold/20', label: lang === 'en' ? 'Planned' : 'Taiyari' };
      default: return { color: 'text-text-tertiary bg-bg-tertiary border-border-light', label: lang === 'en' ? 'Routine' : 'Aam' };
    }
  };

  const handleSaveTask = () => {
    if (!tTitle.trim()) return;
    addTask({
      title: tTitle,
      description: tDesc,
      priority: tPriority,
      category: tCategory,
      assigned_to: tAssignedTo,
      due_date: tDueDate,
    });
    setTTitle(''); setTDesc(''); setTPriority('medium'); setTCategory('Home'); setTDueDate('');
    setShowAddModal(false);
  };

  return (
    <ModuleShell 
      title={lang === 'en' ? "Family Tasks" : "Parivar ke Kartavya"}
      subtitle={lang === 'en' ? "Staying organized together" : "Mil kar kaam poore karein"}
      onAdd={!showAddModal ? () => setShowAddModal(true) : undefined}
      addLabel={lang === 'en' ? "New Task" : "Naya Kaam"}
    >
      <div className="space-y-8 md:space-y-10">
        
        {/* Modern Filter Pills */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-bg-primary rounded-2xl border border-border-light w-fit shadow-sm">
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
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            <button
              onClick={() => setCatFilter('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap transition-all ${catFilter === 'all' ? 'border-gold text-gold bg-gold/10' : 'border-border-light text-text-tertiary'}`}
            >
              All
            </button>
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.name}
                  onClick={() => setCatFilter(c.name)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap flex items-center gap-1.5 transition-all ${catFilter === c.name ? 'border-text-primary text-text-primary' : 'border-border-light text-text-tertiary'}`}
                >
                  <Icon size={12} style={{ color: catFilter === c.name ? c.color : undefined }} />
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Add Task Modal overlay */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-bg-primary border border-gold/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">New Task</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-tertiary hover:text-text-danger font-bold">✕</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Task Title *</label>
                  <input type="text" value={tTitle} onChange={e => setTTitle(e.target.value)} placeholder="e.g. Plan parents anniversary"
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold" />
                </div>
                
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Description</label>
                  <input type="text" value={tDesc} onChange={e => setTDesc(e.target.value)} placeholder="More details..."
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Priority</label>
                  <select value={tPriority} onChange={e => setTPriority(e.target.value as any)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold">
                    <option value="low">Routine / Low</option>
                    <option value="medium">Planned / Medium</option>
                    <option value="high">Urgent / High</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Category</label>
                  <select value={tCategory} onChange={e => setTCategory(e.target.value)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold">
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Assign To</label>
                  <select value={tAssignedTo} onChange={e => setTAssignedTo(e.target.value)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold">
                    <option value="Everyone">Everyone</option>
                    {family.map((f: FamilyMember) => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Due Date</label>
                  <input type="date" value={tDueDate} onChange={e => setTDueDate(e.target.value)}
                    className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold" />
                </div>
              </div>
              
              <button onClick={handleSaveTask} disabled={!tTitle.trim()}
                className="w-full h-14 bg-gold-text text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:opacity-90 disabled:opacity-30 shadow-lg shadow-gold/10">
                Save Task
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Task Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? filteredTasks.map((t: FamilyTask, idx: number) => {
               const priority = getPriorityInfo(t.priority);
               const isDone = t.status === 'done';
               const catInfo = CATEGORIES.find(c => c.name === t.category) || CATEGORIES[0];
               const CatIcon = catInfo.icon;
               return (
                <motion.div 
                  layout
                  key={String(t.id)}
                  initial={{ opacity: 0, scale: 0.98, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-bg-primary border border-border-light p-6 rounded-[2rem] flex gap-6 items-start group shadow-black/[0.01] shadow-xl transition-all duration-300 ${isDone ? 'opacity-40 grayscale select-none' : 'hover:border-gold/30 hover:shadow-2xl'}`}
                >
                  <button 
                    onClick={() => toggleTask(t.id, t.status)}
                    className={`mt-1 flex-shrink-0 transition-all duration-300 transform active:scale-75 ${isDone ? 'text-gold' : 'text-border-medium group-hover:text-gold'}`}
                  >
                    {isDone ? <CheckCircle2 size={26} strokeWidth={3} /> : <Circle size={26} strokeWidth={2} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                       <h3 className={`text-base font-black tracking-tight leading-tight truncate ${isDone ? 'line-through text-text-tertiary font-bold' : 'text-text-primary'}`}>
                         {t.title}
                       </h3>
                       <div className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border tracking-[0.2em] shadow-sm whitespace-nowrap ml-2 ${priority.color}`}>
                          {priority.label}
                       </div>
                    </div>
                    
                    {t.description && !isDone && (
                      <p className="text-[13px] font-bold text-text-secondary mb-5 leading-relaxed tracking-tight max-w-lg">
                        {t.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                      {t.category && (
                        <div className="flex items-center gap-1.5" style={{ color: !isDone ? catInfo.color : undefined }}>
                          <CatIcon size={12} /> {t.category}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className={isDone ? 'text-text-tertiary' : 'text-gold'} />
                        {t.due_date || (lang === 'en' ? 'No Due Date' : 'Tarik Nahi')}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-bg-tertiary border border-border-light flex items-center justify-center text-[8px] shadow-sm font-black text-gold-text">
                          {String(t.assigned_to).slice(0, 1).toUpperCase()}
                        </div>
                        {t.assigned_to}
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                     <button onClick={() => deleteTask(t.id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-text-tertiary hover:bg-text-danger/10 hover:text-text-danger transition-all">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-32 flex flex-col items-center justify-center bg-bg-primary border border-border-light border-dashed rounded-[3rem] opacity-40">
                 <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center mb-6">
                    <AlertCircle size={32} strokeWidth={1} className="text-text-tertiary" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.4em]">{filter === 'pending' ? 'All caught up' : 'No tasks found'}</h2>
                 <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-2">Kartavya soochi khaali hai.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModuleShell>
  );
}
