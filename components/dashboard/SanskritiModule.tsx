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
import { useSanskriti } from '@/modules/sanskriti';
import { useFamily } from '@/modules/family';
import ModuleShell from './ModuleShell';
import { useTranslation } from '@/lib/i18n';
import { 
  MapPin, 
  History, 
  Flame, 
  User, 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle,
  Library,
  Map,
  BookMarked,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SanskritiTab = 'lineage' | 'roots' | 'rituals' | 'vansh';

const PUJA_PRESETS = [
  'Sandhya Aarti',
  'Daily Puja',
  'Satyanarayan Vrat Katha',
  'Ganesh Vandana',
  'Hanuman Chalisa Path',
  'Havan / Yagna',
  'Shraadh Ritual'
];

export default function SanskritiModule() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const { profile, roots, logs, actions } = useSanskriti();
  const { familyMembers: members } = useFamily();

  const [activeTab, setActiveTab] = useState<SanskritiTab>('lineage');
  const [showAddRoot, setShowAddRoot] = useState(false);
  const [showLogRitual, setShowLogRitual] = useState(false);

  // Form States
  const [editProfile, setEditProfile] = useState(false);
  const [pData, setPData] = useState({
    gotra: profile?.gotra || '',
    pravar: profile?.pravar || '',
    kuldevta: profile?.kuldevta || '',
    kuldevi: profile?.kuldevi || '',
    kulguru: profile?.kulguru || '',
    shaakha: profile?.shaakha || '',
    veda: profile?.veda || '',
  });

  const [rData, setRData] = useState({
    village_name: '',
    district: '',
    state: '',
    gramdevi_name: '',
    gramdevi_rituals: '',
    sthan_address: '',
    notes: ''
  });

  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'DAILY' as 'DAILY' | 'SPECIAL',
    name: '',
    performer_id: '',
    sankalpa_text: '',
    notes: ''
  });

  const handleUpdateProfile = async () => {
    await actions.updateProfile(pData);
    setEditProfile(false);
  };

  const handleAddRoot = async () => {
    if (!rData.village_name) return;
    await actions.addVillageRoot(rData);
    setShowAddRoot(false);
    setRData({ village_name: '', district: '', state: '', gramdevi_name: '', gramdevi_rituals: '', sthan_address: '', notes: '' });
  };

  const handleLogRitual = async () => {
    if (!logData.name) return;
    await actions.logRitual(logData);
    setShowLogRitual(false);
    setLogData({ date: new Date().toISOString().split('T')[0], type: 'DAILY', name: '', performer_id: '', sankalpa_text: '', notes: '' });
  };

  return (
    <ModuleShell title="Sanskriti Hub">
      <div className="flex flex-col h-full bg-bg-primary overflow-hidden">
        
        {/* Header - Digital Temple Aesthetic */}
        <div className="p-6 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 flex items-center justify-center transform translate-x-8 -translate-y-8">
             <Flame size={120} strokeWidth={1} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 font-hindi text-white">
            {t('nav.sanskriti')}
          </h1>
          <p className="text-white/70 text-sm tracking-wide uppercase italic">
            {t('SANSKRITI_HERITAGE')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-bg-secondary sticky top-0 z-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'lineage', label: t('SANSKRITI_GOTRA'), icon: Shield },
            { id: 'roots', label: t('SANSKRITI_ROOTS'), icon: MapPin },
            { id: 'rituals', label: t('SANSKRITI_RITUAL_LOG'), icon: Flame },
            { id: 'vansh', label: 'Vansh (Ancestry)', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SanskritiTab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id 
                ? 'text-gold border-gold bg-white/5' 
                : 'text-text-tertiary border-transparent hover:text-text-primary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <AnimatePresence mode="wait">
            
            {/* LINEAGE TAB */}
            {activeTab === 'lineage' && (
              <motion.div 
                key="lineage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Profile Card */}
                  <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                     {/* Watermark */}
                    <div className="absolute -bottom-4 -right-4 text-white/5 transform group-hover:scale-110 transition-transform">
                      <Library size={100} />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gold/10 text-gold shadow-highlight">
                          <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">{t('SANSKRITI_GOTRA')}</h2>
                      </div>
                      <button 
                        onClick={() => {
                          setPData({
                            gotra: profile?.gotra || '',
                            pravar: profile?.pravar || '',
                            kuldevta: profile?.kuldevta || '',
                            kuldevi: profile?.kuldevi || '',
                            kulguru: profile?.kulguru || '',
                            shaakha: profile?.shaakha || '',
                            veda: profile?.veda || '',
                          });
                          setEditProfile(!editProfile);
                        }}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-text-tertiary hover:bg-gold/20 hover:text-gold transition-all"
                      >
                        {editProfile ? 'CANCEL' : 'EDIT RECORDS'}
                      </button>
                    </div>

                    {!editProfile ? (
                      <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">Rishi Gotra</p>
                            <p className="text-lg font-hindi text-gold">{profile?.gotra || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">Pravar</p>
                            <p className="text-sm text-text-secondary line-clamp-2">{profile?.pravar || '—'}</p>
                          </div>
                        </div>
                        <div className="h-px bg-white/5 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">{t('SANSKRITI_VEDA')}</p>
                            <p className="text-sm font-semibold">{profile?.veda || '—'}</p>
                            <p className="text-xs text-text-tertiary">{profile?.shaakha || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">{t('SANSKRITI_KULGURU')}</p>
                            <p className="text-sm font-semibold text-text-secondary">{profile?.kulguru || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 z-10 relative">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-text-tertiary">Gotra</label>
                          <input 
                            value={pData.gotra}
                            onChange={e => setPData({...pData, gotra: e.target.value})}
                            placeholder="e.g. Kashyap"
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-gold focus:border-gold outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-text-tertiary">Pravar (Rishis)</label>
                          <input 
                            value={pData.pravar}
                            onChange={e => setPData({...pData, pravar: e.target.value})}
                            placeholder="e.g. Maharishi Kashyap, ..."
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all"
                          />
                        </div>
                        <button 
                          onClick={handleUpdateProfile}
                          className="mt-4 w-full bg-gold text-black font-bold py-3 rounded-lg hover:shadow-gold transition-all"
                        >
                          SAVE DHARMA PROFILE
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Deities Card */}
                  <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <CheckCircle size={80} strokeWidth={1} />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF4500]/10 text-[#FF4500] shadow-highlight">
                        <Flame size={24} />
                      </div>
                      Lineage Deities
                    </h2>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 h-12 bg-gold/30 rounded-full" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">Kuldevta (Male Progenitor)</p>
                          {editProfile ? (
                            <input 
                              value={pData.kuldevta}
                              onChange={e => setPData({...pData, kuldevta: e.target.value})}
                              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-gold text-sm"
                            />
                          ) : (
                            <p className="text-lg font-bold text-text-primary">{profile?.kuldevta || '—'}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 h-12 bg-[#FF4500]/30 rounded-full" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-text-tertiary mb-1">{t('SANSKRITI_KULDEVI')}</p>
                          {editProfile ? (
                            <input 
                              value={pData.kuldevi}
                              onChange={e => setPData({...pData, kuldevi: e.target.value})}
                              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-[#FF4500] text-sm"
                            />
                          ) : (
                            <p className="text-lg font-bold text-[#FF4500]">{profile?.kuldevi || '—'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-[#4B0082]/10 border border-[#4B0082]/20 rounded-xl p-4 flex gap-4 items-center">
                  <Wind className="text-[#9370DB]" size={24} />
                  <p className="text-xs text-text-tertiary leading-relaxed italic">
                    &ldquo;Purkhauti represents the deep roots of our existence. Keeping these records ensures our descendants never lose their sovereign identity.&rdquo;
                  </p>
                </div>
              </motion.div>
            )}

            {/* ROOTS TAB */}
            {activeTab === 'roots' && (
              <motion.div 
                key="roots"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-medium text-text-secondary uppercase tracking-widest flex items-center gap-2">
                     <Map size={18} /> {t('SANSKRITI_ROOTS')}
                   </h3>
                   <button 
                    onClick={() => setShowAddRoot(true)}
                    className="p-2 rounded-full bg-gold text-black shadow-gold hover:scale-105 transition-all"
                   >
                     <Plus size={24} />
                   </button>
                </div>

                {roots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <MapPin size={80} strokeWidth={1} />
                    <p className="mt-4 tracking-widest uppercase text-sm">Mapping Ancestral Geography...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roots.map(root => (
                      <div key={root.id} className="bg-bg-secondary border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all group relative">
                        <button 
                          onClick={() => actions.deleteVillageRoot(root.id)}
                          className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className="text-[10px] uppercase text-gold/60 mb-1">{root.district}, {root.state}</p>
                        <h4 className="text-xl font-bold font-hindi mb-3">{root.village_name}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-text-secondary">
                             <CheckCircle size={14} className="text-gold" />
                             <span><strong>Devi:</strong> {root.gramdevi_name || '—'}</span>
                          </div>
                          <div className="flex items-start gap-3 text-xs text-text-tertiary border-t border-white/5 pt-2">
                             <MapPin size={14} />
                             <span>{root.sthan_address || 'Address not listed'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* RITUALS TAB */}
            {activeTab === 'rituals' && (
              <motion.div 
                key="rituals"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-medium text-text-secondary uppercase tracking-widest flex items-center gap-2">
                     <History size={18} /> {t('SANSKRITI_RITUAL_LOG')}
                   </h3>
                   <button 
                    onClick={() => setShowLogRitual(true)}
                    className="px-4 py-2 rounded-full bg-gold text-black font-bold flex items-center gap-2 shadow-gold transition-all"
                   >
                     <Plus size={18} /> LOG RITUAL
                   </button>
                </div>
                
                {/* Sankalpa Generator Teaser */}
                <div className="bg-bg-tertiary border border-gold/20 rounded-2xl p-6 mb-6">
                   <div className="flex items-center gap-3 mb-4">
                     <BookMarked className="text-gold" size={20} />
                     <h4 className="text-sm font-black uppercase tracking-widest text-gold-text">Sovereign Sankalpa Generator</h4>
                   </div>
                   <p className="text-xs text-text-tertiary leading-relaxed mb-4">
                      &ldquo;Generate formal Vedic intentions for your ceremonies based on Tithi, Location, and Gotra.&rdquo;
                   </p>
                   <button 
                     onClick={() => alert("Sankalpa Generation Logic: In the name of " + (profile?.gotra || 'Kutumb') + " Gotra, on this auspicious day, I perform this ritual...")}
                     className="text-[10px] font-black uppercase tracking-widest bg-gold/10 text-gold-text px-4 py-2 rounded-lg border border-gold/20 hover:bg-gold/20 transition-all"
                   >
                      Generate Formal Text
                   </button>
                </div>

                <div className="space-y-3">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                      <Flame size={80} strokeWidth={1} />
                      <p className="mt-4 tracking-tighter uppercase text-sm">{t('SANSKRITI_EMPTY')}</p>
                    </div>
                  ) : (
                    logs.map(log => {
                      const perfMember = members.find(m => m.id === log.performer_id);
                      return (
                        <div key={log.id} className="bg-bg-secondary border-l-4 border-l-gold rounded-xl p-4 flex justify-between items-center group">
                          <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold border border-gold/20">
                              {perfMember?.avatar_initials || 'A'}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                <h4 className="font-bold text-text-primary">{log.name}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded bg-white/5 ${log.type === 'DAILY' ? 'text-text-tertiary' : 'text-gold'}`}>
                                  {log.type}
                                </span>
                               </div>
                               <p className="text-xs text-text-tertiary mt-1">{new Date(log.date).toLocaleDateString(undefined, { dateStyle: 'long' })} • By {perfMember?.name || 'Someone'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => actions.deleteRitualLog(log.id)}
                            className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* VANSH TAB */}
            {activeTab === 'vansh' && (
              <motion.div 
                key="vansh"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                <div className="text-center py-12">
                   <User size={64} className="mx-auto text-gold/20 mb-4" strokeWidth={1} />
                   <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2">Vansh Vriksha</h3>
                   <p className="text-xs text-text-tertiary uppercase tracking-[0.2em]">Sovereign Ancestry Mapping</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="card p-6 border-dashed border-2 flex flex-col items-center justify-center gap-3 opacity-60">
                      <Plus size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Document Ancestor</span>
                   </div>
                   {/* Placeholder records */}
                   <div className="card p-6 bg-bg-secondary border border-border-light relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10"><History size={40} /></div>
                      <p className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">Grt. Grandfather</p>
                      <h4 className="text-lg font-bold text-text-primary uppercase">Late Shri Ram Prasad R. M.</h4>
                      <p className="text-xs text-text-tertiary mt-2">Circa 1920-1988 • Known for establishing the family root.</p>
                   </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* MODALS (Simplified for demo) */}
        {showAddRoot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gold">Add Ancestral Village</h3>
              <div className="space-y-4">
                <input 
                  placeholder="Village Name (e.g. Rampur)"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                  value={rData.village_name}
                  onChange={e => setRData({...rData, village_name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="District" className="bg-black/40 border border-white/10 rounded-lg p-3 outline-none" value={rData.district} onChange={e => setRData({...rData, district: e.target.value})} />
                  <input placeholder="State" className="bg-black/40 border border-white/10 rounded-lg p-3 outline-none" value={rData.state} onChange={e => setRData({...rData, state: e.target.value})} />
                </div>
                <input placeholder="Gramdevi Name" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none" value={rData.gramdevi_name} onChange={e => setRData({...rData, gramdevi_name: e.target.value})} />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowAddRoot(false)} className="flex-1 py-3 text-text-tertiary font-bold">CANCEL</button>
                <button onClick={handleAddRoot} className="flex-1 py-3 bg-gold text-black rounded-xl font-bold shadow-gold">SAVE ROOT</button>
              </div>
            </div>
          </div>
        )}

        {showLogRitual && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gold flex items-center gap-2">
                <Flame size={20} /> New Ritual Entry
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                  {PUJA_PRESETS.map(p => (
                    <button 
                      key={p} 
                      onClick={() => setLogData({...logData, name: p})}
                      className={`text-[10px] px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${logData.name === p ? 'bg-gold text-black border-gold' : 'border-white/10 text-text-tertiary'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input 
                  placeholder="Other Ritual Name..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                  value={logData.name}
                  onChange={e => setLogData({...logData, name: e.target.value})}
                />
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none"
                  value={logData.performer_id}
                  onChange={e => setLogData({...logData, performer_id: e.target.value})}
                >
                  <option value="">By Which Member?</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <textarea 
                  placeholder="Sankalpa / Notes / Experience..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 outline-none"
                  value={logData.notes}
                  onChange={e => setLogData({...logData, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowLogRitual(false)} className="flex-1 py-3 text-text-tertiary font-bold hover:text-white">DISMISS</button>
                <button onClick={handleLogRitual} className="flex-1 py-3 bg-[#FF4500] text-white rounded-xl font-bold shadow-highlight hover:bg-[#FF6347]">LOG RITUAL</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ModuleShell>
  );
}
