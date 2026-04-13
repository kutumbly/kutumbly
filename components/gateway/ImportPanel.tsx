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
import { FileCode2, ArrowLeft, Loader2, AlertCircle, Key, FileUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { openVault } from '@/lib/vault';
import { VaultMeta } from '@/types/vault';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportPanelProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function ImportPanel({ onBack, onSuccess }: ImportPanelProps) {
  const { addRecentVault, setActiveVault, lang } = useAppStore();
  
  const [step, setStep] = useState<'pick' | 'pin'>('pick');
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [pin, setPin] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [picked] = await (window as any).showOpenFilePicker({
          types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
        });
        setFileHandle(picked);
        setStep('pin');
        setError(null);
      } else {
        setError(lang === 'hi' ? 'Aapka browser file picking support nahi karta' : 'Your browser does not support file picking');
      }
    } catch (err) {
      console.error("File selection cancelled or failed:", err);
    }
  };

  const handleUnlock = async () => {
    if (!fileHandle || pin.length < 4) return;

    setIsDecrypting(true);
    setError(null);

    try {
      const { db, handle } = await openVault(pin, fileHandle);
      
      // Extract stable identity from DB
      let vaultName = fileHandle.name.replace('.kutumb', '');
      let vaultId = crypto.randomUUID();
      
      try {
        const nameRes = db.exec("SELECT value FROM settings WHERE key = 'vault_name'");
        if (nameRes.length > 0) vaultName = nameRes[0].values[0][0] as string;
        
        const idRes = db.exec("SELECT value FROM settings WHERE key = 'vault_id'");
        if (idRes.length > 0) {
          vaultId = idRes[0].values[0][0] as string;
        } else {
          // Hotfix backwards compatibility: Inject permanent ID into legacy files
          db.run("INSERT INTO settings (key, value) VALUES ('vault_id', ?)", [vaultId]);
        }
      } catch (e) {}

      const importedVault: VaultMeta = {
        id: vaultId,
        name: vaultName,
        icon: '🔐',
        lastOpened: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        memberCount: 0,
        fileHandle: handle,
      };

      addRecentVault(importedVault);
      setActiveVault(importedVault);
      setUnlocked(db);
      onSuccess();
    } catch (err: any) {
      console.error("Import unlock failed:", err);
      if (err.message === 'WRONG_PIN') {
        setError(lang === 'hi' ? 'Galat PIN — dobara try karo' : 'Invalid PIN — please try again');
      } else {
        setError(lang === 'hi' ? 'Vault khul nahi paya' : 'Failed to open vault');
      }
      setPin('');
    } finally {
      setIsDecrypting(false);
    }
  };

  const { setUnlocked } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-primary relative p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-2 rounded-full bg-secondary hover:bg-gold-light/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-text-secondary" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-[400px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'pick' ? (
            <motion.div 
              key="pick"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4 border-[0.5px] border-gold/20">
                  <FileCode2 className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {lang === 'hi' ? 'Purana Vault Kholo' : 'Open Existing Vault'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {lang === 'hi' ? 'Apni .kutumb file select karein' : 'Select your existing .kutumb file'}
                </p>
              </div>

              <button
                onClick={handlePickFile}
                className="w-full aspect-video bg-secondary border-2 border-dashed border-border-medium rounded-xl flex flex-col items-center justify-center gap-3 hover:border-gold hover:bg-gold-light/20 transition-all group"
              >
                <FileUp className="w-8 h-8 text-text-tertiary group-hover:text-gold transition-colors" />
                <span className="text-xs font-bold text-text-secondary group-hover:text-gold uppercase tracking-wider">
                  {lang === 'hi' ? 'File Choose Karein' : 'Select .kutumb File'}
                </span>
              </button>

              {error && (
                <div className="flex items-center gap-2 text-danger text-[11px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4 border-[0.5px] border-gold/20">
                  <Key className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {lang === 'hi' ? 'PIN Enter Karein' : 'Enter PIN'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {lang === 'hi' ? `${fileHandle?.name} ko unlock karne ke liye` : `To unlock ${fileHandle?.name}`}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider text-center">
                  PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  autoFocus
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full h-12 px-4 rounded-lg bg-secondary border-[0.5px] border-border-medium text-center text-2xl tracking-[1em] outline-none focus:border-gold transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-danger text-[11px] font-bold justify-center">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </div>
              )}

              <button
                onClick={handleUnlock}
                disabled={isDecrypting || pin.length < 4}
                className="w-full h-12 bg-gold text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-md bg-gradient-to-tr from-gold to-[#d4af37] disabled:opacity-50"
              >
                {isDecrypting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {lang === 'hi' ? 'Unlock Karein' : 'Unlock Vault'}
                    <Key className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setStep('pick')}
                className="text-[11px] font-bold text-text-tertiary hover:text-gold uppercase tracking-widest transition-colors"
                disabled={isDecrypting}
              >
                {lang === 'hi' ? 'Doosri File Chuno' : 'Choose Different File'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
