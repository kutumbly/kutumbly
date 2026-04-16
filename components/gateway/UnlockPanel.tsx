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
import { Delete, Check, Lock, AlertCircle, Loader2, Fingerprint, ShieldCheck } from 'lucide-react';
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

  useEffect(() => {
    if (waitTimer <= 0) return;
    const interval = setInterval(() => setWaitTimer(w => w - 1), 1000);
    return () => clearInterval(interval);
  }, [waitTimer]);

  const hapticFeedback = (intensity: number | number[] = 15) => {
    // Note: iOS Safari PWA does not fully support navigator.vibrate.
    // This will degrade gracefully on iOS and provide native feel on Android/wrapped apps.
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(intensity); 
    }
  };

  const handleDigit = (digit: string) => {
    if (waitTimer > 0 || isDecrypting) return;
    hapticFeedback(15);
    if (currentPin.length < 4) {
      const newPin = currentPin + digit;
      setCurrentPin(newPin);
      setError(null);
      if (newPin.length === 4) {
        // Shorter delay for premium feel
        setTimeout(() => handleUnlock(newPin), 50);
      }
    }
  };

  const handleDelete = () => {
    if (!isDecrypting) {
      hapticFeedback(20);
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
      // Success Haptic
      hapticFeedback([20, 50, 20]);
      
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
      hapticFeedback([50, 100]); // Error vibration

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
    hapticFeedback(10);
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
    <div className="flex flex-col min-h-full p-6 md:p-8 overflow-y-auto scroller-hide pt-10 pb-20 select-none">
      <div className="w-full max-w-[340px] flex flex-col items-center mx-auto my-auto">

        {/* Sovereign Vault Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative">
             <div className="w-24 h-24 bg-gradient-to-br from-bg-tertiary to-bg-primary rounded-[3rem] flex items-center justify-center mx-auto mb-6 border border-border-light shadow-2xl relative z-10">
               <span className="text-5xl filter drop-shadow-xl">{activeVault.icon || '🛡️'}</span>
             </div>
             {/* Subtle background glow */}
             <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full scale-150 -z-0"></div>
          </div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">{activeVault.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
             <ShieldCheck size={12} className="text-gold" />
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-text-tertiary opacity-60">
               {t('VAULT_SECURITY')}
             </div>
          </div>
        </motion.div>

        {/* Jeweler PIN Indicators */}
        <div className="flex gap-6 mb-16 h-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: currentPin.length > i ? [1, 1.2, 1] : 1,
                backgroundColor: currentPin.length > i ? "var(--gold)" : "transparent",
                boxShadow: currentPin.length > i ? "0 0 15px rgba(201,151,28,0.4)" : "none",
              }}
              className={`w-4 h-4 rounded-sm border-2 rotate-45 transition-all duration-300 ${
                currentPin.length > i 
                  ? 'border-gold/20' 
                  : 'border-border-light/30'
              }`}
            />
          ))}
        </div>

        {/* Tactile Numpad */}
        <div className="grid grid-cols-3 gap-6 w-full px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.94, backgroundColor: "var(--bg-secondary)", opacity: 0.8 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              disabled={isDecrypting || waitTimer > 0}
              onClick={() => handleDigit(n.toString())}
              className="w-full aspect-square rounded-[1.75rem] bg-bg-primary flex items-center justify-center text-[26px] font-black text-text-primary transition-colors shadow-sm shadow-black/[0.02] border border-border-light hover:border-gold/30 user-select-none"
            >
              {n}
            </motion.button>
          ))}
          
          {/* Biometric/Action Section */}
          <div className="flex items-center justify-center">
            {bioActive ? (
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={handleBiometricClick}
                className="w-16 h-16 rounded-full flex items-center justify-center text-gold relative"
              >
                <div className="absolute inset-0 bg-gold/10 rounded-full animate-ping opacity-20"></div>
                <Fingerprint size={28} strokeWidth={2.5} />
              </motion.button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.94, backgroundColor: "var(--bg-secondary)", opacity: 0.8 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            disabled={isDecrypting || waitTimer > 0}
            onClick={() => handleDigit('0')}
            className="w-full aspect-square rounded-[1.75rem] bg-bg-primary flex items-center justify-center text-[26px] font-black text-text-primary transition-colors shadow-sm shadow-black/[0.02] border border-border-light hover:border-gold/30 user-select-none"
          >
            0
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94, opacity: 0.7 }}
            transition={{ duration: 0.1 }}
            disabled={isDecrypting}
            onClick={handleDelete}
            className="w-full aspect-square flex items-center justify-center text-text-tertiary hover:text-text-danger transition-colors user-select-none"
          >
            <Delete size={26} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Secure Entry Footer */}
        <div className="mt-16 w-full flex flex-col gap-6 items-center">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-text-danger text-[11px] font-black uppercase tracking-widest bg-text-danger/5 px-4 py-2 rounded-full border border-text-danger/10"
              >
                <AlertCircle size={14} />
                {error} {waitTimer > 0 && `(${waitTimer}s)`}
              </motion.div>
            ) : isDecrypting ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-gold text-xs font-black uppercase tracking-[0.2em]"
              >
                <Loader2 className="animate-spin" size={16} />
                Unlocking Vault...
              </motion.div>
            ) : (
              <div className="h-8" /> 
            )}
          </AnimatePresence>

          {isDevBypassEnabled() && (
            <button onClick={() => setCurrentPin('1234')} className="text-[10px] text-gold font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity">
               Sovereign Bypass Enabled
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

