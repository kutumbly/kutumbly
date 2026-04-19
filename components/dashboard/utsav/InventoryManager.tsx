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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Search, Filter, Truck, 
  CheckCircle2, Clock, User, AlertCircle,
  MoreVertical, ChevronRight, ShieldCheck,
  ExternalLink, RefreshCcw, Send, MessageCircle, 
  ScanLine, X, QrCode
} from 'lucide-react';
import { useScanner, useUtsavEngine } from '@/modules/utsav';
import { useFamily } from '@/modules/family';
import { useAppStore } from '@/lib/store';
import { requestAccessToken } from '@/lib/gdrive';
import { 
  createUniversalBridge, 
  fetchUniversalResponses 
} from '@/lib/googleBridge';
import { broadcastMission } from '@/lib/whatsapp';
import { UtsavEvent, UtsavInventoryItem } from '@/types/db';
import LogisticsPulse from '../../ui/LogisticsPulse';

interface InventoryManagerProps {
  event: UtsavEvent;
}

const CAT_COLORS: Record<string, string> = {
  'Catering': '#f59e0b',
  'Decor': '#ec4899',
  'Logistics': '#3b82f6',
  'Gift': '#10b981'
};

export default function InventoryManager({ event }: InventoryManagerProps) {
  const { 
    inventory, addInventoryItem, updateInventoryStatus, findInventoryItem 
  } = useUtsavEngine(event.id);
  const { familyMembers: family } = useFamily();

  const { videoRef, isScanning, startScanner, stopScanner, scanFrame } = useScanner();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ORDERED' | 'DISPATCHED' | 'RECEIVED' | 'RETURNED'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UtsavInventoryItem | null>(null);
  const [isBridging, setIsBridging] = useState(false);
  const { gdriveToken } = useAppStore();

  // New Item State
  const [inName, setInName] = useState('');
  const [inCat, setInCat] = useState('Catering');
  const [inQty, setInQty] = useState(1);
  const [inAssign, setInAssign] = useState(family?.[0]?.name || '');

  // Scanner Logic Loop
  useEffect(() => {
    let active = true;
    if (showScanner) {
      startScanner();
      
      const interval = setInterval(async () => {
        if (!active) return;
        const result = await scanFrame();
        if (result) {
          const item = findInventoryItem(result.rawValue);
          if (item) {
            // Success Feedback (Haptic + Beep)
            try {
               if (navigator.vibrate) navigator.vibrate(50);
               const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
               const osc = audioCtx.createOscillator();
               osc.type = 'sine';
               osc.frequency.setValueAtTime(880, audioCtx.currentTime);
               osc.connect(audioCtx.destination);
               osc.start();
               osc.stop(audioCtx.currentTime + 0.1);
            } catch(e) {}

            setSelectedItem(item);
            setShowScanner(false);
            stopScanner();
            active = false;
          }
        }
      }, 300);

      return () => {
        clearInterval(interval);
        active = false;
        stopScanner();
      };
    }
  }, [showScanner, startScanner, stopScanner, scanFrame, findInventoryItem]);

  const filtered = inventory.filter((i: UtsavInventoryItem) => {
    const sMatch = searchTerm === '' || i.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const fMatch = filter === 'ALL' || i.status === filter;
    return sMatch && fMatch;
  });

  const handleAddItem = () => {
    if (!inName.trim()) return;
    addInventoryItem({
      item_name: inName,
      category: inCat,
      quantity_expected: inQty,
      quantity_received: 0,
      quantity_used: 0,
      unit: 'pcs',
      vendor_id: null,
      assigned_to_id: inAssign,
      backup_person_id: null,
      delivery_date_expected: null,
      delivery_date_actual: null,
      is_returnable: 0,
      return_deadline: null,
      cost_estimated: 0,
      cost_actual: 0,
      notes: null
    });
    setInName('');
    setShowAddModal(false);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'RECEIVED': return 'bg-text-success/10 text-text-success border-text-success/20';
      case 'DISPATCHED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ORDERED': return 'bg-gold/10 text-gold border-gold/20';
      default: return 'bg-bg-tertiary text-text-tertiary border-border-light';
    }
  };

  const handleGenerateBridge = async () => {
    if (!gdriveToken) {
      requestAccessToken();
      return;
    }

    const itemsToBridge = inventory.filter((i: UtsavInventoryItem) => i.status === 'ORDERED');
    if (itemsToBridge.length === 0) return;

    setIsBridging(true);
    try {
      // 1. Create Universal Payload
      const payload = {
        title: `NVT Mission: ${event.title}`,
        description: `Coordination Link for ${event.title}. Mission ID: ${event.id.slice(0, 8)}`,
        fields: itemsToBridge.flatMap((i: UtsavInventoryItem) => [
          {
            title: `Actual Qty for ${i.item_name} (${i.quantity_expected} ${i.unit} EXP)`,
            description: `Task ID: ${i.id}`,
            type: 'NUMBER' as const,
            required: true
          },
          {
            title: `Final Price for ${i.item_name}`,
            type: 'NUMBER' as const,
            required: true
          }
        ])
      };

      const result = await createUniversalBridge(gdriveToken, payload);
      
      // 2. Pro-level WhatsApp Broadcast
      broadcastMission({
        name: itemsToBridge[0].assigned_to_id || 'Siddharth',
        missionType: 'INVENTORY',
        missionTitle: event.title,
        bridgeUrl: result.responderUri
      });
      
      alert(`Universal Bridge Created!\nForm opened in link/WhatsApp.\n\nForm ID: ${result.formId}`);
    } catch (err) {
      alert("Bridge failed. Check console.");
    } finally {
      setIsBridging(false);
    }
  };

  const handleSyncFulfillment = async () => {
    if (!gdriveToken) {
      requestAccessToken();
      return;
    }

    const formId = prompt("Enter the Google Form ID to sync responses:");
    if (!formId) return;

    setIsBridging(true);
    try {
      const responses = await fetchUniversalResponses(gdriveToken, formId);
      if (responses.length === 0) {
        alert("No responses found yet.");
        return;
      }

      // We take the latest response for simplicity in this V1 bridge
      const latest = responses[responses.length - 1];
      const answers = latest.answers; // Map of questionId to answer

      // High-fidelity mapping would happen here using Task IDs in descriptions.
      // For this "Simple" V1, we simply alert the user to the raw data ingestion logic.
      console.log("[EOS-BRIDGE] Syncing data:", answers);
      alert(`Found ${responses.length} responses. Sync logic initiated in console.`);
      
      // In a production scenario, we'd iterate answers and call:
      // ingestFulfillment(itemId, qty, price);
    } catch (err) {
      alert("Sync failed. Check console.");
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Interactive Hub Controls */}
      {/* 1. Interactive Hub Controls (Standardized) */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-gold transition-all" size={20} />
            <input 
               type="text" 
               placeholder="Search Saamaan / Vendor..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-bg-secondary border border-border-light rounded-[1.5rem] py-5 pl-16 pr-6 text-sm font-black text-text-primary focus:outline-none focus:border-gold focus:shadow-2xl transition-all shadow-inner"
            />
         </div>

         <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:w-auto p-1 bg-bg-secondary rounded-[1.8rem] border border-border-light">
            {(['ALL', 'ORDERED', 'DISPATCHED', 'RECEIVED'] as const).map(f => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative ${filter === f ? 'text-gold' : 'text-text-tertiary hover:text-text-primary'}`}
               >
                  {f}
                  {filter === f && (
                    <motion.div 
                      layoutId="inventory-filter-pill"
                      className="absolute inset-0 bg-bg-primary rounded-2xl shadow-md border border-border-light/50 -z-10"
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    />
                  )}
               </button>
            ))}
            <div className="h-8 w-[1px] bg-border-light/50 mx-1" />
            <button 
               onClick={() => setShowAddModal(true)}
               className="w-12 h-12 bg-gold-text text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
               <Plus size={24} strokeWidth={3} />
            </button>
         </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
          <button 
              onClick={handleGenerateBridge}
              disabled={isBridging}
              className="px-8 h-14 bg-bg-primary border border-gold/30 text-gold rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-gold/5 transition-all disabled:opacity-50 card-lift"
          >
              {isBridging ? <RefreshCcw size={16} className="animate-spin" /> : <MessageCircle size={18} />}
              Broadcast Mission
          </button>

          <button 
              onClick={handleSyncFulfillment}
              disabled={isBridging}
              className="px-8 h-14 bg-bg-primary border border-text-success/30 text-text-success rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-text-success/5 transition-all disabled:opacity-50 card-lift"
          >
              <RefreshCcw size={18} className={isBridging ? 'animate-spin' : ''} />
              Sync Protocol
          </button>

          <button 
              onClick={() => setShowScanner(true)}
              className="w-14 h-14 bg-bg-primary border border-border-light text-text-primary rounded-2xl flex items-center justify-center shadow-lg hover:border-gold/50 transition-all flex-shrink-0 card-lift"
          >
              <ScanLine size={24} />
          </button>
      </div>

      {/* 2. Inventory Grid - Lifecycle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {filtered.map((item: UtsavInventoryItem, idx: number) => (
               <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl group hover:border-gold/30 hover:shadow-2xl transition-all relative overflow-hidden card-lift"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner group-hover:scale-110 transition-transform" style={{ backgroundColor: `${CAT_COLORS[item.category] || '#ccc'}20`, borderColor: `${CAT_COLORS[item.category] || '#ccc'}40`, color: CAT_COLORS[item.category] }}>
                           <Package size={28} />
                        </div>
                        <div>
                           <h3 className="text-base font-black text-text-primary truncate max-w-[150px] group-hover:text-gold transition-colors">{item.item_name}</h3>
                           <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{item.category}</p>
                        </div>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(item.status)}`}>
                        {item.status}
                     </div>
                  </div>

                  <div className="space-y-4 mb-8 relative z-10">
                     <div className="flex items-center justify-between p-3.5 bg-bg-secondary rounded-[1.2rem] border border-border-light">
                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Responsibility</span>
                        <div className="flex items-center gap-2 text-text-primary font-black text-[11px] uppercase tracking-wider">
                           <User size={14} className="text-gold" /> {item.assigned_to_id || 'Anyone'}
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-3.5 bg-bg-secondary rounded-[1.2rem] border border-border-light">
                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Expected Qty</span>
                        <span className="text-text-primary font-black text-sm tabular-nums tracking-tighter">{item.quantity_expected} <span className="text-[10px] font-bold text-text-tertiary uppercase">{item.unit}</span></span>
                     </div>
                  </div>

                  {/* Lifecycle Quick Actions (Cousin Mode) */}
                  <div className="flex items-center gap-3 pt-6 border-t border-border-light/30 relative z-10">
                     {item.status === 'ORDERED' && (
                        <button 
                           onClick={() => updateInventoryStatus(item.id, 'RECEIVED')}
                           className="flex-1 bg-gold/10 text-gold py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-gold/10 hover:bg-gold-text hover:text-white hover:border-gold transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                           <ShieldCheck size={16} /> Mark Received
                        </button>
                     )}
                     {(item.status === 'RECEIVED' || item.status === 'IN_USE') && (
                        <button 
                           onClick={() => updateInventoryStatus(item.id, item.status === 'RECEIVED' ? 'IN_USE' : 'RETURNED')}
                           className="flex-1 bg-text-success/10 text-text-success py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-text-success/10 hover:bg-text-success hover:text-white hover:border-text-success transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                           {item.status === 'RECEIVED' ? <Truck size={16} /> : <CheckCircle2 size={16} />} 
                           {item.status === 'RECEIVED' ? 'Move to Use' : 'Mark Returned'}
                        </button>
                     )}
                     <button className="w-14 h-14 bg-bg-secondary rounded-2xl border border-border-light flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-gold/30 transition-all shadow-sm">
                        <MoreVertical size={20} />
                     </button>
                  </div>
                </motion.div>
            ))}
         </AnimatePresence>

         {filtered.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-bg-primary border-2 border-dashed border-border-light rounded-[3rem] opacity-30">
               <AlertCircle size={48} strokeWidth={1} className="mb-4" />
               <p className="text-[11px] font-black uppercase tracking-[0.4em]">No inventory items found</p>
            </div>
         )}
      </div>

      {/* Add Inventory Modal */}
      <AnimatePresence>
         {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowAddModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xl"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-xl bg-bg-primary border border-gold/30 rounded-[3rem] p-10 shadow-2xl space-y-8"
               >
                  <div>
                     <h2 className="text-xl font-black text-text-primary tracking-tight">Add New Saamaan</h2>
                     <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">Lifecycle Enrollment</p>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Item Name *</label>
                        <input 
                           type="text" value={inName} onChange={e => setInName(e.target.value)} placeholder="e.g. 500 Folding Chairs"
                           className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none focus:border-gold"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Category</label>
                           <select value={inCat} onChange={e => setInCat(e.target.value)} className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none">
                              {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Assign Responsibility</label>
                           <select value={inAssign} onChange={e => setInAssign(e.target.value)} className="bg-bg-secondary border border-border-light rounded-2xl p-4 text-sm font-bold text-text-primary focus:outline-none">
                              <option value="">Anyone</option>
                              {family.map((m: any) => <option key={m.id} value={m.name}>{m.name}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={handleAddItem}
                     className="w-full py-5 bg-gold-text text-white font-black rounded-3xl text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-gold/20"
                  >
                     Enroll in System
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {showScanner && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md"
               />
               <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                   className="relative w-full max-w-sm aspect-square bg-black border-2 border-gold/40 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                   {/* Real Camera Feed */}
                   <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover"
                   />

                   {/* Scanning Animation Overlay */}
                   <LogisticsPulse />

                   <button 
                      onClick={() => setShowScanner(false)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
                   >
                      <X size={20} />
                   </button>

                   <div className="absolute bottom-10 left-0 right-0 p-6 text-center z-10">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 drop-shadow-lg">Mission Scan Hub</h3>
                      <p className="text-[9px] font-bold text-white/70 uppercase leading-relaxed max-w-[200px] mx-auto drop-shadow-md">
                         Align NVT-QR within frame. Instant identification active.
                      </p>
                   </div>
                </motion.div>
             </div>
         )}
      </AnimatePresence>
    </div>
  );
}
