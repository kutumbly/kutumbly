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

import React from 'react';
import { PlusCircle, FileCode2, Lock, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { VaultMeta, GatewayPanel } from '@/types/vault';
import { motion } from 'framer-motion';

interface VaultListProps {
  onPanelChange: (panel: GatewayPanel) => void;
}

export default function VaultList({ onPanelChange }: VaultListProps) {
  const { recentVaults, activeVault, setActiveVault, lang } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-bg-secondary/50">
      {/* Header */}
      <div className="p-6 md:p-4 border-b-[0.5px] border-border-light bg-bg-primary/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">
          {lang === 'hi' ? 'Aapke Surakshit Vaults' : 'Your Secure Vaults'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scroller-hide p-6 md:p-4 space-y-4">
        {recentVaults.length === 0 ? (
          <div className="py-12 px-6 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg-primary border border-border-light flex items-center justify-center opacity-40">
               <Lock className="w-8 h-8 text-text-tertiary" />
            </div>
            <div>
               <p className="text-sm font-bold text-text-primary">Koi Vault Nahi Mila</p>
               <p className="text-[10px] text-text-tertiary mt-1 uppercase font-black tracking-widest">Setup shuru karein niche se</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recentVaults.map((vault, i) => {
              const isActive = activeVault?.id === vault.id;
              return (
                <motion.button
                  key={vault.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setActiveVault(vault);
                    onPanelChange('unlock');
                  }}
                  className={`relative flex items-center gap-5 p-5 rounded-3xl transition-all text-left group overflow-hidden border-2
                    ${isActive 
                      ? 'bg-bg-primary border-gold shadow-[0_10px_30px_rgba(201,151,28,0.1)]' 
                      : 'bg-bg-primary border-transparent hover:border-border-medium active:scale-[0.98]'
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-0 right-0 p-2">
                       <ShieldCheck className="w-4 h-4 text-gold" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-inner
                    ${isActive ? 'bg-gold-light/50 filter drop-shadow-sm' : 'bg-bg-tertiary'}
                  `}>
                    {vault.icon || '🏠'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-base font-black text-text-primary truncate">
                       {vault.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <History size={10} className="text-text-tertiary" />
                       <span className="text-[9px] text-text-tertiary font-black uppercase tracking-widest">
                         {new Date(vault.lastOpened).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                       </span>
                    </div>
                  </div>

                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-gold' : 'text-border-medium group-hover:translate-x-1'}`} />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Action Grid (Secondary) */}
        <div className="grid grid-cols-2 gap-3 pt-4">
           <button 
             onClick={() => onPanelChange('create')}
             className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-gold text-white shadow-lg active:scale-95 transition-all"
           >
             <PlusCircle className="w-6 h-6" />
             <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'hi' ? 'Naya Vault' : 'New Vault'}</span>
           </button>
           <button 
             onClick={() => onPanelChange('import')}
             className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-bg-primary border border-border-light active:scale-95 transition-all shadow-sm"
           >
             <FileCode2 className="w-6 h-6 text-text-tertiary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{lang === 'hi' ? 'Import' : 'Import'}</span>
           </button>
        </div>
      </div>

      {/* Recover / Setup (Optional/Secondary) */}
      <div className="p-6 text-center">
         <button 
           onClick={() => onPanelChange('recover')}
           className="text-[10px] font-black text-text-tertiary hover:text-gold uppercase tracking-[0.3em] transition-colors"
         >
           Cloud Recovery & Reset
         </button>
      </div>
    </div>
  );
}

