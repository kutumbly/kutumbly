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
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Language } from '@/lib/i18n';

interface LanguageLink {
  code: Language;
  label: string;
  native: string;
}

const LANGUAGES: LanguageLink[] = [
  { code: 'en', label: 'English (India)', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bho', label: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'bn', label: 'Bangla', native: 'বাংলা' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতেইলোন' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

export default function LanguagePicker({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { lang, setLang } = useAppStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-bg-primary rounded-[2.5rem] border border-border-light shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-8 pb-4 flex items-center justify-between border-b border-border-light/50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                     <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-text-primary tracking-tight">Choose Language</h2>
                    <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest">Select your regional script</p>
                  </div>
               </div>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 rounded-full hover:bg-bg-secondary flex items-center justify-center text-text-tertiary transition-colors"
               >
                 <X size={20} />
               </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto scroller-hide">
               {LANGUAGES.map((l) => {
                 const isActive = lang === l.code;
                 return (
                   <button
                     key={l.code}
                     onClick={() => {
                        setLang(l.code);
                        onClose();
                     }}
                     className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-1 relative overflow-hidden group ${
                       isActive 
                         ? 'bg-gold/5 border-gold shadow-sm' 
                         : 'bg-bg-primary border-border-light hover:border-gold/30 hover:bg-bg-secondary'
                     }`}
                   >
                     {isActive && (
                       <div className="absolute top-2 right-2 text-gold">
                          <Check size={14} />
                       </div>
                     )}
                     <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-gold' : 'text-text-tertiary group-hover:text-text-primary'}`}>
                       {l.label}
                     </span>
                     <span className={`text-lg font-bold transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                       {l.native}
                     </span>
                   </button>
                 );
               })}
            </div>

            <div className="p-8 pt-4 bg-bg-secondary/50 text-center">
               <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                 Your preference is saved locally to your device
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
