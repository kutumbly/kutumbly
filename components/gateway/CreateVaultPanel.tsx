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

interface CreateVaultPanelProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateVaultPanel({ onBack, onSuccess }: CreateVaultPanelProps) {
  const { addRecentVault, setActiveVault, lang } = useAppStore();
  
  const [step, setStep] = useState<'details' | 'pin'>('details');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏠');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emojiList = ['🏠', '💼', '👨‍👩‍👧', '🔐', '🚜', '🍲', '💰', '🌳'];

  const handleNext = () => {
    if (!name.trim()) {
      setError(lang === 'hi' ? 'Kripya naam enter karein' : 'Please enter a vault name');
      return;
    }
    setError(null);
    setStep('pin');
  };

  const handleCreate = async () => {
    if (pin.length !== 4) {
      setError(lang === 'hi' ? '4 digit PIN zaroori hai' : '4-digit PIN is required');
      return;
    }
    if (pin !== confirmPin) {
      setError(lang === 'hi' ? 'PIN match nahi kar raha' : 'PINs do not match');
      setPin('');
      setConfirmPin('');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { handle, vaultId } = await createVault(name, pin);
      
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
      setError(lang === 'hi' ? 'Koshish nakamyab rahi' : 'Failed to create vault');
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
          Step {step === 'details' ? '1' : '2'} of 2
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col px-8 pb-20 pt-4 relative z-10 overflow-y-auto scroller-hide">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col flex-1"
            >
              <div className="mb-10">
                <div className="w-20 h-20 bg-gold-light/20 rounded-[2rem] flex items-center justify-center mb-6 border border-gold/10 backdrop-blur-xl">
                   <Shield className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-3xl font-black text-text-primary leading-tight tracking-tight">
                  {lang === 'hi' ? 'Apna Naya Vault Banao' : 'Create Your New Vault'}
                </h2>
                <p className="text-sm font-bold text-text-tertiary mt-3 leading-relaxed">
                  {lang === 'hi' ? 'Ye aapke parivar ka private digital ghar hoga.' : 'This will be your family\'s private digital safe.'}
                </p>
              </div>

              <div className="space-y-8 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {lang === 'hi' ? 'Vault ka Naam' : 'Vault Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'hi' ? "i.e. Mallah Parivar" : "e.g. Mallah Family"}
                    className="w-full h-16 px-6 rounded-3xl bg-bg-secondary border-2 border-transparent focus:border-gold/50 outline-none transition-all font-bold text-lg text-text-primary shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {lang === 'hi' ? 'Identify with Icon' : 'Identify with Icon'}
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {emojiList.map((e) => (
                      <button
                        key={e}
                        onClick={() => setIcon(e)}
                        className={`aspect-square rounded-[1.5rem] flex items-center justify-center text-2xl transition-all border-2
                          ${icon === e ? 'bg-gold-light/30 border-gold shadow-md scale-105' : 'bg-bg-secondary border-transparent'}
                        `}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8">
                {error && (
                  <div className="flex items-center gap-2 text-text-danger text-[11px] font-bold justify-center mb-4">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="w-full h-16 bg-gold text-white rounded-[2rem] font-black text-base uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {lang === 'hi' ? 'Bas Ek Aur Step' : 'One More Step'}
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
              <div className="mb-10">
                <div className="w-20 h-20 bg-gold-light/20 rounded-[2rem] flex items-center justify-center mb-6 border border-gold/10 backdrop-blur-xl">
                   <Key className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-3xl font-black text-text-primary leading-tight tracking-tight">
                  {lang === 'hi' ? 'Master PIN Set Karein' : 'Set Master PIN'}
                </h2>
                <p className="text-sm font-bold text-text-tertiary mt-3 leading-relaxed">
                  {lang === 'hi' ? 'Ise hamesha yaad rakhein, ye vault kholne ki chabi hai.' : 'Remember this well. It is the only key to your vault.'}
                </p>
              </div>

              <div className="space-y-8 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {lang === 'hi' ? 'Choose 4-Digit PIN' : 'Choose 4-Digit PIN'}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full h-20 px-4 rounded-[2.5rem] bg-bg-secondary border-2 border-transparent text-center text-4xl tracking-[1em] outline-none focus:border-gold/50 transition-all font-bold shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                    {lang === 'hi' ? 'Confirm PIN' : 'Confirm PIN'}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full h-20 px-4 rounded-[2.5rem] bg-bg-secondary border-2 border-transparent text-center text-4xl tracking-[1em] outline-none focus:border-gold/50 transition-all font-bold shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-8">
                {error && (
                  <div className="flex items-center gap-2 text-text-danger text-[11px] font-bold justify-center mb-4">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCreate}
                  disabled={isCreating || pin.length < 4}
                  className="w-full h-16 bg-gold text-white rounded-[2rem] font-black text-base uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isCreating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {lang === 'hi' ? 'Vault Taiyaar Hai' : 'Finalize Vault'}
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setStep('details')}
                  className="w-full mt-4 py-2 text-[10px] font-black text-text-tertiary hover:text-gold uppercase tracking-[0.3em] transition-colors"
                  disabled={isCreating}
                >
                  {lang === 'hi' ? 'Pichla Page' : 'Previous Step'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

