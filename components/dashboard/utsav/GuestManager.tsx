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

import React, { useState, useMemo } from 'react';
import { useNevataEngine } from '@/modules/utsav';
import { NevataEvent, NevataGuest } from '@/types/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Phone, 
  CheckCircle2, XCircle, Clock, Send, 
  Filter, X, Save, MessageCircle, ShieldCheck 
} from 'lucide-react';
import { broadcastMission } from '@/lib/whatsapp';

interface GuestManagerProps {
  event: NevataEvent;
}

export default function GuestManager({ event }: GuestManagerProps) {
  const { guests, addGuest, updateGuestRSVP } = useNevataEngine(event.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Guest State
  const [formData, setFormData] = useState({
    guest_name: '',
    family_tag: '',
    guest_count: 1,
    phone: '',
    rsvp_status: 'pending' as NevataGuest['rsvp_status']
  });

  const stats = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').reduce((acc, g) => acc + g.guest_count, 0);
    const pending = guests.filter(g => g.rsvp_status === 'pending').length;
    return { total, confirmed, pending };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = g.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (g.family_tag?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filter === 'all' || g.rsvp_status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [guests, searchTerm, filter]);

  const handleAddGuest = () => {
    if (!formData.guest_name) return;
    addGuest(formData);
    setFormData({ guest_name: '', family_tag: '', guest_count: 1, phone: '', rsvp_status: 'pending' });
    setShowAddModal(false);
  };

  const handleBroadcastInvite = (guest: NevataGuest) => {
    broadcastMission({
      name: guest.guest_name,
      phone: guest.phone || '',
      missionType: 'CUSTOM', // Standard Invitation mission
      missionTitle: event.title,
      customBody: `Shubh Vivah Aamantran! hum aapko aur aapke pariwar ko "${event.title}" me sadar aamantrit karte hain.\n\nKripya apne pariwar ke ${guest.guest_count} sadasyon ki upasthiti confirm karein.`
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle2 size={16} className="text-text-success" />;
      case 'declined': return <XCircle size={16} className="text-text-danger" />;
      default: return <Clock size={16} className="text-text-warning" />;
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* 1. Atithi Analytics Ribbon */}
      {/* 1. Atithi Analytics Ribbon (Premium Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-gold/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Total Families Invited</p>
              <h3 className="text-3xl font-black text-text-primary tabular-nums tracking-tighter">{stats.total}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-light flex items-center justify-center text-text-tertiary shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <Users size={28} />
           </div>
        </div>

        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-text-success/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-text-success/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-text-success/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Confirmed Heads</p>
              <h3 className="text-3xl font-black text-text-success tabular-nums tracking-tighter">{stats.confirmed}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-text-success/5 border border-text-success/10 flex items-center justify-center text-text-success shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={28} />
           </div>
        </div>

        <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl flex items-center justify-between group hover:border-text-warning/30 transition-all card-lift relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-text-warning/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-text-warning/10 transition-all" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 opacity-60">Awaiting RSVP</p>
              <h3 className="text-3xl font-black text-text-warning tabular-nums tracking-tighter">{stats.pending}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-text-warning/5 border border-text-warning/10 flex items-center justify-center text-text-warning shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <Clock size={28} />
           </div>
        </div>
      </div>

      {/* 2. Command Toolbar */}
      {/* 2. Command Toolbar (Standardized Pill) */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-gold transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search Guest or Pariwar Tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 bg-bg-secondary border border-border-light rounded-[1.5rem] pl-16 pr-6 text-sm font-black text-text-primary focus:outline-none focus:border-gold/50 shadow-inner transition-all"
          />
        </div>
        
        <div className="flex bg-bg-secondary rounded-[1.8rem] border border-border-light p-1.5 h-16 w-full md:w-auto relative shadow-inner">
           {(['all', 'pending', 'confirmed', 'declined'] as const).map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${filter === f ? 'text-gold' : 'text-text-tertiary hover:text-text-primary'}`}
             >
               {f}
               {filter === f && (
                 <motion.div 
                   layoutId="guest-filter-pill"
                   className="absolute inset-0 bg-bg-primary rounded-xl shadow-md border border-border-light/50 -z-10"
                   transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                 />
               )}
             </button>
           ))}
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="h-16 px-10 bg-gold-text text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-gold/20 hover:scale-[1.03] active:scale-[0.97] transition-all w-full md:w-auto"
        >
          <UserPlus size={22} />
          Enroll Guest
        </button>
      </div>

      {/* 3. Atithi List Grid (Premium Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {filteredGuests.map((g, i) => (
               <motion.div 
                  key={g.id} layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 group hover:border-gold/30 hover:shadow-2xl transition-all relative overflow-hidden card-lift"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-gold/10 transition-colors pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div>
                        <h4 className="text-base font-black text-text-primary mb-1 group-hover:text-gold transition-colors">{g.guest_name}</h4>
                        <span className="text-[9px] font-black px-3 py-1 bg-bg-secondary border border-border-light rounded-full text-text-tertiary uppercase tracking-[0.2em] opacity-80 shadow-inner">
                           {g.family_tag || 'Individual'}
                        </span>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-[11px] font-black text-text-primary tabular-nums tracking-tighter">
                           <Users size={14} className="text-gold" /> {g.guest_count} Heads
                        </div>
                        <div className="flex items-center gap-2 uppercase tracking-[0.15em] text-[9px] font-black px-3 py-1 rounded-full bg-bg-tertiary border border-border-light shadow-sm">
                           {getStatusIcon(g.rsvp_status)} {g.rsvp_status}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3 mt-auto relative z-10">
                     <button 
                        onClick={() => updateGuestRSVP(g.id, 'confirmed')}
                        className={`flex-1 h-14 rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${g.rsvp_status === 'confirmed' ? 'bg-text-success border-text-success text-white shadow-text-success/20' : 'text-text-tertiary bg-bg-secondary border-border-light hover:border-text-success/50 hover:text-text-success'}`}
                     >
                        {g.rsvp_status === 'confirmed' ? <ShieldCheck size={18} /> : null}
                        {g.rsvp_status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                     </button>
                     <button 
                        onClick={() => handleBroadcastInvite(g)}
                        className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-light flex items-center justify-center text-text-tertiary hover:text-gold hover:border-gold/50 transition-all shadow-sm card-lift"
                        title="Broadcast Aamantran via WhatsApp"
                     >
                        <MessageCircle size={22} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Add Atithi Modal */}
      <AnimatePresence>
         {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowAddModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                  className="relative w-full max-w-lg bg-bg-primary border border-border-light rounded-[3rem] shadow-2xl p-10"
               >
                  <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-text-tertiary hover:text-text-primary">
                     <X size={24} />
                  </button>

                  <h2 className="text-2xl font-black text-text-primary tracking-tight mb-8">Enroll New Guest</h2>

                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Full Name / Head of Family</label>
                        <input 
                           type="text"
                           value={formData.guest_name}
                           onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                           placeholder="E.g. Ramesh Kumar Mallah"
                           className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Family Tag</label>
                           <input 
                              type="text"
                              value={formData.family_tag}
                              onChange={(e) => setFormData({...formData, family_tag: e.target.value})}
                              placeholder="E.g. Maama Side"
                              className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Guest Count</label>
                           <input 
                              type="number"
                              value={formData.guest_count}
                              onChange={(e) => setFormData({...formData, guest_count: Number(e.target.value)})}
                              className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50 text-center"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">WhatsApp Number (Optional)</label>
                        <input 
                           type="tel"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           placeholder="+91 00000 00000"
                           className="w-full bg-bg-secondary border border-border-light rounded-2xl p-5 text-sm font-bold text-text-primary focus:outline-none focus:border-gold/50"
                        />
                     </div>

                     <button 
                        onClick={handleAddGuest}
                        className="w-full py-6 bg-gold-text text-white font-black rounded-3xl text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
                     >
                        <Save size={20} />
                        Authorize Mission Enrollment
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
