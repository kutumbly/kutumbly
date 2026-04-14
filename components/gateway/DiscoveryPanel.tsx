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
import { Search, Globe, ChevronRight, Cloud, FileUp, PlusCircle, Loader2, HardDrive } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { initTokenClient, requestAccessToken, listVaultBackups } from '@/lib/gdrive';
import { useTranslation } from '@/lib/i18n';

export default function DiscoveryPanel() {
  const { setGatewayPanel, setDiscoveryEmail, discoveryEmail, lang } = useAppStore();
  const t = useTranslation(lang);
  
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundBackups, setFoundBackups] = useState<any[]>([]);
  const [searchStep, setSearchStep] = useState<'input' | 'results'>('input');

  const handleSearch = () => {
    if (!email.includes('@')) return;
    setDiscoveryEmail(email);
    setIsSearching(true);
    
    // Check if online to scan GDrive
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isOnline) {
      initTokenClient(async (res: any) => {
        if (res.access_token) {
          try {
            const files = await listVaultBackups(res.access_token);
            setFoundBackups(files);
            setSearchStep('results');
          } catch (e) {
            setSearchStep('results'); // Show zero results but continue
          } finally {
            setIsSearching(false);
          }
        }
      });
      requestAccessToken();
    } else {
      // Offline: Just show manual options
      setSearchStep('results');
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary p-8 md:p-12 font-inter">
      <AnimatePresence mode="wait">
        {searchStep === 'input' ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full"
          >
            <div className="w-20 h-20 bg-gold-light/20 rounded-[2rem] flex items-center justify-center mb-8 border border-gold/10">
              <Globe className="w-10 h-10 text-gold" />
            </div>
            
            <h2 className="text-3xl font-black text-text-primary text-center tracking-tight mb-2">
              {t('FIND_VAULT_TITLE')}
            </h2>
            <p className="text-xs text-text-tertiary text-center font-bold uppercase tracking-widest mb-10">
               {t('EMAIL_DISCOVERY_SUB')}
            </p>

            <div className="w-full space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aapka@email.com"
                  className="w-full h-16 bg-bg-secondary border border-border-light rounded-2xl px-6 font-bold text-sm focus:border-gold outline-none transition-all shadow-sm"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch}
                  disabled={!email.includes('@') || isSearching}
                  className="absolute right-2 top-2 h-12 w-12 bg-gold text-white rounded-[1.2rem] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
              </div>
              
              <div className="flex items-center gap-4 px-2">
                 <div className="flex-1 h-px bg-border-light/50"></div>
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t('OR_SKIP')}</span>
                 <div className="flex-1 h-px bg-border-light/50"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setGatewayPanel('create')}
                  className="h-14 bg-bg-secondary border border-border-light rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:border-text-primary transition-all"
                >
                  <PlusCircle size={14} /> {t('CREATE_VAULT')}
                </button>
                <button 
                  onClick={() => setGatewayPanel('import')}
                  className="h-14 bg-bg-secondary border border-border-light rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:border-text-primary transition-all"
                >
                  <FileUp size={14} /> {t('LOCAL')}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col max-w-lg mx-auto w-full pt-10"
          >
            <div className="mb-8">
              <h3 className="text-sm font-black text-text-tertiary uppercase tracking-[0.2em] mb-4">Discovery Results</h3>
              <div className="bg-bg-secondary rounded-2xl border border-border-light p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <span className="font-bold text-xs">{email.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-text-primary">{email}</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-black">{t('SCANNING_SOURCES')}</div>
                </div>
                <button onClick={() => setSearchStep('input')} className="text-[10px] font-bold text-gold uppercase hover:underline">{t('CHANGE_EMAIL')}</button>
              </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto scroller-hide">
              {/* Cloud Block */}
              <div>
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Cloud size={12} /> Cloud-Syncript Backups
                </div>
                <div className="space-y-2">
                  {foundBackups.length > 0 ? (
                    foundBackups.map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setGatewayPanel('import')}
                        className="w-full bg-bg-primary border border-border-light rounded-2xl p-4 flex items-center justify-between hover:border-gold transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center">
                               <Cloud size={16} className="text-text-tertiary group-hover:text-gold transition-colors" />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-text-primary">{f.name}</div>
                               <div className="text-[10px] text-text-tertiary uppercase font-black">{new Date(f.createdTime).toLocaleDateString()}</div>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-text-tertiary" />
                      </button>
                    ))
                  ) : (
                    <div className="p-6 bg-bg-secondary/50 rounded-2xl border border-dashed border-border-light text-center text-xs text-text-tertiary font-medium">
                      No backups found.
                    </div>
                  )}
                </div>
              </div>

              {/* Local Sources Block */}
              <div>
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                   <HardDrive size={12} /> Physical Media
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setGatewayPanel('import')}
                    className="w-full bg-bg-primary border border-border-light rounded-2xl p-4 flex items-center gap-4 hover:border-gold transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center">
                       <FileUp size={16} className="text-text-tertiary" />
                    </div>
                    <div className="text-left flex-1">
                       <div className="text-sm font-bold text-text-primary">Restore from Local Device</div>
                    </div>
                    <ChevronRight size={18} className="text-text-tertiary" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border-light">
               <button 
                onClick={() => setGatewayPanel('create')}
                className="w-full h-14 bg-gold text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-gold/20 hover:opacity-90 active:scale-95 transition-all text-xs"
               >
                 {t('CREATE_VAULT')}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
