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
import LanguagePicker from './LanguagePicker';

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  bho: 'भोजपुरी',
  bn: 'বাংলা',
  mni: 'মৈতেইলোন',
  ne: 'नेपाली',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు',
};

/**
 * LanguageSwitcher — Compact trigger button that opens the full LanguagePicker modal.
 * Shows the current language's native name. Supports all 12 sovereign languages.
 */
export default function LanguageSwitcher() {
  const { lang } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-10 px-4 bg-clinical border border-border-light rounded-xl font-black text-[10px] text-text-secondary uppercase tracking-widest hover:border-gold hover:text-gold transition-all active:scale-95"
        aria-label="Change language"
        title="Change language"
      >
        <Globe size={13} className="text-gold flex-shrink-0" />
        <span className="max-w-[64px] truncate">{LANG_LABELS[lang] ?? 'EN'}</span>
      </button>

      <LanguagePicker isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
