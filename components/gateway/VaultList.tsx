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

import React, { useState, useMemo } from 'react';
import { PlusCircle, FileCode2, Lock, ArrowRight, History, X, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { VaultMeta, GatewayPanel } from '@/types/vault';
import { motion, AnimatePresence } from 'framer-motion';

interface VaultListProps {
  onPanelChange: (panel: GatewayPanel) => void;
}

interface VaultGroup {
  primary: VaultMeta;
  history: VaultMeta[];
}

export default function VaultList({ onPanelChange }: VaultListProps) {
  const { recentVaults, activeVault, setActiveVault, lang } = useAppStore();
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);

  // Group vaults by name
  const groupedVaults = useMemo(() => {
    const groups: Record<string, VaultMeta[]> = {};
    
    recentVaults.forEach(v => {
      const key = v.name;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });

    return Object.values(groups).map(members => {
      const sorted = [...members].sort((a, b) => 
        new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime()
      );
      return {
        primary: sorted[0],
        history: sorted.slice(1)
      } as VaultGroup;
    }).sort((a, b) => 
      new Date(b.primary.lastOpened).getTime() - new Date(a.primary.lastOpened).getTime()
    );
  }, [recentVaults]);

  const historyTarget = groupedVaults.find(g => g.primary.name === showHistoryFor);

  return (
    <div className="flex flex-col h-full bg-bg-tertiary relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border-light bg-bg-tertiary sticky top-0 z-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
          {lang === 'hi' ? 'AAPKE VAULTS' : 'YOUR VAULTS'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scroller-hide p-6 space-y-3">
        {groupedVaults.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-bg-primary border border-border-light flex items-center justify-center opacity-40">
               <Lock className="w-8 h-8 text-text-tertiary" />
            </div>
            <div>
               <p className="text-sm font-bold text-text-primary">No Vaults Found</p>
               <p className="text-[9px] text-text-tertiary mt-1 uppercase font-black tracking-widest">Setup a new one below</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {groupedVaults.map((group, i) => {
              const vault = group.primary;
              const isActive = activeVault?.id === vault.id;
              const hasHistory = group.history.length > 0;

              return (
                <motion.div
                  key={vault.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group"
                >
                  <button
                    onClick={() => {
                      setActiveVault(vault);
                      onPanelChange('unlock');
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all text-left border-2
                      ${isActive 
                        ? 'bg-bg-primary border-gold/20 shadow-xl shadow-black/[0.03]' 
                        : 'bg-transparent border-transparent hover:bg-bg-primary/50'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner
                      ${isActive ? 'bg-gold-light/30' : 'bg-bg-tertiary grayscale opacity-50'}
                    `}>
                      {vault.icon || '🏠'}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="text-sm font-black text-text-primary truncate">
                         {vault.name}
                      </div>
                      <div className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">
                        {lang === 'hi' ? 'Aaj khola' : 'Last Opened: Today'}
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-gold' : 'text-border-medium group-hover:translate-x-1'}`} />
                  </button>

                  {hasHistory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHistoryFor(vault.name);
                      }}
                      className="absolute top-4 right-4 p-1.5 rounded-xl bg-bg-primary/80 text-text-tertiary hover:text-gold hover:bg-gold/10 transition-all z-20 border border-border-light/50"
                    >
                      <History size={14} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 space-y-4 pt-6 border-t border-border-light/50">
           <button 
             onClick={() => onPanelChange('create')}
             className="w-full flex items-center gap-3 px-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors"
           >
             <span className="text-lg">+</span>
             {lang === 'hi' ? 'Naya Vault Banao' : 'Create New Vault'}
           </button>
           <button 
             onClick={() => onPanelChange('import')}
             className="w-full flex items-center gap-3 px-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors"
           >
             <span className="text-lg">📁</span>
             {lang === 'hi' ? '.kutumb File Kholo' : 'Open .kutumb File'}
           </button>
        </div>
      </div>

      <div className="p-6 text-center border-t border-border-light/50">
         <button 
           onClick={() => onPanelChange('recover')}
           className="text-[9px] font-black text-text-tertiary hover:text-gold uppercase tracking-[0.3em] transition-colors"
         >
           Cloud Recovery & Reset
         </button>
      </div>

      {/* History Drawer Overlay */}
      <AnimatePresence>
        {showHistoryFor && historyTarget && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryFor(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[70%] bg-bg-primary rounded-t-[2.5rem] z-40 shadow-2xl flex flex-col border-t border-border-light"
            >
              <div className="flex items-center justify-between p-6 pb-2 border-b border-border-light/50">
                 <h3 className="text-[10px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                   <History size={14} className="text-gold" />
                   {lang === 'hi' ? 'Vault Itihas' : 'Vault History'}
                 </h3>
                 <button 
                  onClick={() => setShowHistoryFor(null)}
                  className="p-2 rounded-full bg-bg-tertiary text-text-tertiary"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 scroller-hide pb-12">
                 {historyTarget.history.map((hv) => (
                   <button
                      key={hv.id}
                      onClick={() => {
                        setActiveVault(hv);
                        setShowHistoryFor(null);
                        onPanelChange('unlock');
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-bg-tertiary border border-border-light hover:border-gold/20 transition-all text-left"
                   >
                      <div className="text-xl opacity-60 filter grayscale">{hv.icon || '🏠'}</div>
                      <div className="flex-1 min-w-0">
                         <div className="text-xs font-bold text-text-primary truncate">{hv.path || 'Previous Copy'}</div>
                         <div className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mt-1">
                            {new Date(hv.lastOpened).toLocaleString()}
                         </div>
                      </div>
                   </button>
                 ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
