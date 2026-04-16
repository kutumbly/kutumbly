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
import { ArrowLeft, Clock, Save, Download, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getVaultBackups } from '@/lib/backup';
import { motion } from 'framer-motion';

interface RecoverPanelProps {
  onBack: () => void;
}

export default function RecoverPanel({ onBack }: RecoverPanelProps) {
  const { activeVault, lang } = useAppStore();
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeVault?.id) {
      getVaultBackups(activeVault.id).then(res => {
        setBackups(res);
        setLoading(false);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      queueMicrotask(() => setLoading(false));
    }
  }, [activeVault]);

  const handleDownload = (backup: any) => {
    // We already have the full encrypted 32+ bytes Uint8Array
    const blob = new Blob([backup.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Suggest a name like "Mallah_Parivar-Backup_2026-04-13.kutumb"
    const safeVaultName = activeVault?.name?.replace(/\s+/g, '_') || 'Vault';
    const dateStr = new Date(backup.timestamp).toISOString().split('T')[0];
    
    a.download = `${safeVaultName}-Backup_${dateStr}.kutumb`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary relative p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-2 rounded-full bg-bg-secondary hover:bg-gold-light/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-text-secondary" />
      </button>

      <div className="flex-1 flex flex-col items-center max-w-[500px] mx-auto w-full pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-[0.5px] border-warning/20">
              <Clock className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">
              {lang === 'hi' ? 'System Snapshots' : 'System Snapshots'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {lang === 'hi' 
                ? 'Aapke secure auto aur manual backups. Zero Cloud.' 
                : 'Your secure internal snapshots. Zero cloud, 100% safe.'}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {loading ? (
              <div className="py-12 flex justify-center text-gold">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : backups.length === 0 ? (
              <div className="p-6 text-center border-[0.5px] border-border-light rounded-xl bg-bg-secondary flex flex-col items-center gap-3">
                <AlertCircle className="w-6 h-6 text-border-medium" />
                <p className="text-xs text-text-tertiary">
                  {lang === 'hi' ? 'Koi purana backup nahi mila.' : 'No backups found for this vault.'}
                </p>
              </div>
            ) : (
              backups.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-bg-secondary border-[0.5px] border-border-light rounded-xl group hover:border-gold/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-primary flex items-center justify-center border-[0.5px] border-border-light flex-shrink-0">
                      <Save className={`w-5 h-5 transition-colors ${b.type === 'manual' ? 'text-gold' : 'text-text-tertiary group-hover:text-gold'}`} />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${b.type === 'manual' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-bg-tertiary text-text-secondary border-border-medium'}`}>
                          {b.type === 'manual' ? 'MANUAL' : 'AUTO'}
                        </span>
                        <h3 className="text-sm font-bold text-text-primary truncate">
                          {new Date(b.timestamp).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </h3>
                      </div>
                      <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-widest mt-1">
                        Time: {new Date(b.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDownload(b)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-primary border-[0.5px] border-border-medium text-xs font-bold text-text-primary hover:text-gold hover:border-gold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {lang === 'hi' ? 'Download' : 'Save File'}
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
