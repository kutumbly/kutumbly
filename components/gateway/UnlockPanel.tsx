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

import React, { useState, useEffect } from 'react';
import { Delete, Check, Lock, AlertCircle, Loader2, Fingerprint } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { openVault } from '@/lib/vault';
import { isDevBypassEnabled } from '@/lib/dev';
import { motion, AnimatePresence } from 'framer-motion';
import { unlockBiometric, hasBiometricRegistered } from '@/lib/biometric';
import { useTranslation, Language } from '@/lib/i18n';

interface UnlockPanelProps {
  onSuccess: () => void;
}

export default function UnlockPanel({ onSuccess }: UnlockPanelProps) {
  const {
    activeVault, currentPin, setCurrentPin,
    setUnlocked, addRecentVault, lang,
  } = useAppStore();
  const t = useTranslation(lang as Language);

  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [waitTimer, setWaitTimer] = useState(0);

  // Removed async useEffect to preserve user action context.

  useEffect(() => {
    if (waitTimer <= 0) return;
    const t = setTimeout(() => setWaitTimer(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [waitTimer]);

  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12); // Short pulse
    }
  };

  const handleDigit = (digit: string) => {
    if (waitTimer > 0 || isDecrypting) return;
    hapticFeedback();
    if (currentPin.length < 4) {
      const newPin = currentPin + digit;
      setCurrentPin(newPin);
      setError(null);
      if (newPin.length === 4) {
        handleUnlock(newPin); // Synchronous call preserves user-activation for Permissions API
      }
    }
  };

  const handleDelete = () => {
    if (!isDecrypting) {
      hapticFeedback();
      setCurrentPin(currentPin.slice(0, -1));
    }
  };

  const handleUnlock = async (pinOverride?: string) => {
    const targetPin = pinOverride || currentPin;
    if (!activeVault || targetPin.length < 4) return;
    setIsDecrypting(true);
    setError(null);

    try {
      const { db, handle } = await openVault(targetPin, activeVault.fileHandle);
      setUnlocked(db, handle ?? undefined);
      addRecentVault({
        ...activeVault,
        lastOpened: new Date().toISOString(),
        fileHandle: handle ?? undefined,
      });
      onSuccess();
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setCurrentPin('');

      if (err.message === 'WRONG_PIN') {
        setError(t('WRONG_PIN_ERROR'));
      } else if (err.message === 'PERMISSION_DENIED') {
        setError(t('PERMISSION_DENIED_ERROR'));
      } else if (err.message === 'INVALID_FILE' || err.name === 'NotFoundError') {
        setError(t('INVALID_FILE_ERROR'));
      } else {
        setError(t('GENERIC_ERROR'));
      }

      if (newAttempts >= 5 && err.message !== 'PERMISSION_DENIED') {
        setWaitTimer(30);
        setAttempts(0);
        setError(t('TOO_MANY_ATTEMPTS'));
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!activeVault) return null;

  const handleBiometricClick = async () => {
    hapticFeedback();
    const pin = await unlockBiometric(activeVault.id);
    if (pin) {
      setCurrentPin(pin);
      setTimeout(() => handleUnlock(pin), 100);
    } else {
      setError('Biometric Failed');
    }
  };

  const bioActive = activeVault && hasBiometricRegistered(activeVault.id);

  return (
    <div className="flex flex-col min-h-full p-6 md:p-8 overflow-y-auto scroller-hide pt-10 pb-20">
      <div className="w-full max-w-[320px] flex flex-col items-center mx-auto my-auto">

        {/* Vault Profile */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-bg-tertiary rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-border-light shadow-inner">
            <span className="text-4xl filter drop-shadow-sm">{activeVault.icon || '🛡️'}</span>
          </div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">{activeVault.name}</h2>
          <div className="flex items-center justify-center gap-1.5 mt-2 opacity-60">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary">
               {t('VAULT_SECURITY')}
             </div>
          </div>
        </motion.div>

        {/* PIN Indicators */}
        <div className="flex gap-5 mb-14">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: currentPin.length > i ? [1, 1.1, 1] : 1,
              }}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                currentPin.length > i 
                  ? 'bg-gold border-gold/20 shadow-[0_0_15px_rgba(201,151,28,0.2)]' 
                  : 'bg-transparent border-border-light'
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              disabled={isDecrypting || waitTimer > 0}
              onClick={() => handleDigit(n.toString())}
              className="w-full aspect-[4/3] rounded-[1.5rem] bg-bg-primary border border-border-light flex items-center justify-center text-xl font-black text-text-primary active:scale-95 active:bg-gold active:text-white transition-all shadow-sm hover:border-gold/30"
            >
              {n}
            </button>
          ))}
          {/* Backspace */}
          <button
            disabled={isDecrypting}
            onClick={handleDelete}
            className="w-full aspect-[4/3] flex items-center justify-center text-text-tertiary hover:text-text-danger transition-colors active:scale-95"
          >
            <Delete size={20} />
          </button>
          
          <button
            disabled={isDecrypting || waitTimer > 0}
            onClick={() => handleDigit('0')}
            className="w-full aspect-[4/3] rounded-[1.5rem] bg-bg-primary border border-border-light flex items-center justify-center text-xl font-black text-text-primary active:scale-95 active:bg-gold active:text-white transition-all shadow-sm hover:border-gold/30"
          >
            0
          </button>

          {bioActive ? (
            <button 
              onClick={handleBiometricClick}
              className="w-full aspect-[4/3] flex items-center justify-center text-gold active:scale-95 transition-all"
            >
              <Fingerprint size={24} />
            </button>
          ) : (
            <div className="w-full aspect-[4/3]" />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 w-full flex flex-col gap-4 items-center">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-text-danger text-[11px] font-bold"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error} {waitTimer > 0 && `(${waitTimer}s)`}
              </motion.div>
            )}
          </AnimatePresence>

          {isDevBypassEnabled() && (
            <button onClick={() => setCurrentPin('0000')} className="text-[10px] text-gold font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
              Dev Bypass (0000)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

