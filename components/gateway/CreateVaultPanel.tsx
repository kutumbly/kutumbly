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
import { Shield, ArrowLeft, Check, AlertCircle, Loader2, Key, Globe } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { createVault } from '@/lib/vault';
import { VaultMeta } from '@/types/vault';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';

interface CreateVaultPanelProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateVaultPanel({ onBack, onSuccess }: CreateVaultPanelProps) {
  const { addRecentVault, setActiveVault, lang } = useAppStore();
  const t = useTranslation(lang as Language);
  
  const [step, setStep] = useState<'details' | 'pin'>('details');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏠');
  const [authorizedEmail, setAuthorizedEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emojiList = ['🏠', '💼', '👨‍👩‍👧', '🔐', '🚜', '🍲', '💰', '🌳'];

  const handleNext = () => {
    if (!name.trim()) {
      setError(t('ERROR_ENTER_NAME'));
      return;
    }
    setError(null);
    setStep('pin');
  };

  const handleCreate = async () => {
    if (pin.length !== 4) {
      setError(t('ERROR_PIN_REQ'));
      return;
    }
    if (pin !== confirmPin) {
      setError(t('ERROR_PIN_MATCH'));
      setPin('');
      setConfirmPin('');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const emailList = authorizedEmail
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(e => e.includes('@')); // Basic validation

      const { handle, vaultId } = await createVault(name, pin, emailList);
      
      const newVault: VaultMeta = {
        id: vaultId,
        name,
        icon,
        lastOpened: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        memberCount: 1,
        fileHandle: handle || undefined,
      };

      addRecentVault(newVault);
      setActiveVault(newVault);
      onSuccess();
    } catch (err: any) {
      console.error("Vault creation failed:", err);
      setError(t('GENERIC_ERROR'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary relative overflow-hidden">
      {/* Immersive Branding Top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      {/* Header with Close/Back */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-text-secondary active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold opacity-50">
          {t('STEP_INDICATOR').replace('{current}', step === 'details' ? '1' : '2').replace('{total}', '2')}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col px-8 pb-8 pt-2 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col flex-1"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gold-light/20 rounded-[1.5rem] flex items-center justify-center mb-4 border border-gold/10 backdrop-blur-xl">
                   <Shield className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-2xl font-black text-text-primary leading-tight tracking-tight">
                  {t('CREATE_VAULT_TITLE')}
                </h2>
                <p className="text-xs font-bold text-text-tertiary mt-2 leading-relaxed">
                  {t('CREATE_VAULT_SUB')}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {t('VAULT_NAME_LABEL')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('VAULT_NAME_PH')}
                    className="w-full h-14 px-6 rounded-2xl bg-bg-secondary border-2 border-transparent focus:border-gold/50 outline-none transition-all font-bold text-base text-text-primary shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {t('BACKUP_EMAIL_LABEL')}
                  </label>
                  <input
                    type="text"
                    value={authorizedEmail}
                    onChange={(e) => setAuthorizedEmail(e.target.value)}
                    placeholder="e.g., father@gmail.com, mother@gmail.com"
                    className="w-full h-14 px-6 rounded-2xl bg-bg-secondary border-2 border-transparent focus:border-gold/50 outline-none transition-all font-bold text-base text-text-primary shadow-inner"
                  />
                  <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest ml-1">
                    {t('BACKUP_EMAIL_HINT')}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {t('ICON_LABEL')}
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {emojiList.map((e) => (
                      <button
                        key={e}
                        onClick={() => setIcon(e)}
                        className={`h-14 rounded-2xl flex items-center justify-center text-xl transition-all border-2
                          ${icon === e ? 'bg-gold-light/30 border-gold shadow-md scale-105' : 'bg-bg-secondary border-transparent'}
                        `}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {error && (
                  <div className="flex items-center gap-2 text-text-danger text-[11px] font-bold justify-center mb-4">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="w-full h-14 bg-gold text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {t('NEXT_STEP_BTN')}
                  <Check className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col flex-1"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gold-light/20 rounded-[1.5rem] flex items-center justify-center mb-4 border border-gold/10 backdrop-blur-xl">
                   <Key className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-2xl font-black text-text-primary leading-tight tracking-tight">
                  {t('SET_PIN_TITLE')}
                </h2>
                <p className="text-xs font-bold text-text-tertiary mt-2 leading-relaxed">
                  {t('SET_PIN_SUB')}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {t('CHOOSE_PIN_LABEL')}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full h-16 px-4 rounded-2xl bg-bg-secondary border-2 border-transparent text-center text-3xl tracking-[1em] outline-none focus:border-gold/50 transition-all font-bold shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {t('CONFIRM_PIN_LABEL')}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full h-16 px-4 rounded-2xl bg-bg-secondary border-2 border-transparent text-center text-3xl tracking-[1em] outline-none focus:border-gold/50 transition-all font-bold shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-6">
                {error && (
                  <div className="flex items-center gap-2 text-text-danger text-[11px] font-bold justify-center mb-4">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCreate}
                  disabled={isCreating || pin.length < 4}
                  className="w-full h-14 bg-gold text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isCreating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {t('FINALIZE_VAULT_BTN')}
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setStep('details')}
                  className="w-full mt-2 py-1 text-[10px] font-black text-text-tertiary hover:text-gold uppercase tracking-[0.3em] transition-colors"
                  disabled={isCreating}
                >
                  {t('PREV_STEP_BTN')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

