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
import { Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import LanguagePicker from './LanguagePicker';

interface LanguageSwitcherProps {
  variant?: 'outline' | 'minimal' | 'ghost';
  className?: string;
}

/**
 * LanguageSwitcher — Multi-variant trigger button that opens the full LanguagePicker modal.
 * Shows the current language's native name or short label depending on variant.
 */
export default function LanguageSwitcher({ variant = 'outline', className = '' }: LanguageSwitcherProps) {
  const { lang } = useAppStore();
  const [open, setOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === lang);

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-text-tertiary hover:text-gold transition-colors';
      case 'ghost':
        return 'flex items-center gap-2 h-9 px-3 hover:bg-clinical rounded-xl text-text-secondary transition-all';
      default: // outline
        return 'flex items-center gap-2 h-10 px-4 bg-clinical border border-border-light rounded-xl font-black text-[10px] text-text-secondary uppercase tracking-widest hover:border-gold hover:text-gold transition-all active:scale-95';
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${getVariantClasses()} ${className}`}
        aria-label="Change language"
        title="Change language"
      >
        <Globe size={variant === 'minimal' ? 13 : 14} className={`${variant === 'minimal' ? 'opacity-60' : 'text-gold'} flex-shrink-0`} />
        <span className={variant === 'minimal' ? '' : 'max-w-[64px] truncate'}>
          {variant === 'minimal' ? (currentLang?.short ?? 'EN') : (currentLang?.native ?? 'EN')}
        </span>
      </button>

      <LanguagePicker isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
