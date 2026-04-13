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
import { CheckCircle2, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SuccessPanel() {
  const { activeVault, lang } = useAppStore();
  const router = useRouter();

  const handleEnter = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-white to-secondary/30">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-[0.5px] border-success/20"
      >
        <CheckCircle2 className="w-10 h-10 text-success" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <span className="text-[11px] font-bold text-success uppercase tracking-[0.2em] mb-2 bg-success/10 px-3 py-1 rounded-full">
          {lang === 'hi' ? 'Safaltapoorvak Unlock' : 'Successfully Unlocked'}
        </span>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          {activeVault?.name}
        </h2>
        <p className="text-sm text-text-secondary max-w-[280px] mb-8 leading-relaxed font-medium">
          {lang === 'hi' 
            ? 'Aapka digital ghar taiyaar hai. Sabhi data encrypted aur local hai.' 
            : 'Your digital home is ready. All data is encrypted and stored locally.'}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          <button
            onClick={handleEnter}
            className="w-full h-14 bg-gold text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold/20 bg-gradient-to-tr from-gold to-[#d4af37] group active:scale-95"
          >
            {lang === 'hi' ? 'App mein Jao' : 'Enter Dashboard'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-4 py-4 border-t-[0.5px] border-border-light mt-2">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-text-tertiary" />
              <span className="text-[9px] font-bold text-text-tertiary uppercase">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Database className="w-4 h-4 text-text-tertiary" />
              <span className="text-[9px] font-bold text-text-tertiary uppercase">Local</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
