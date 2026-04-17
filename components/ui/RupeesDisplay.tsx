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

import React from 'react';
import { useAppStore } from '@/lib/store';

interface RupeesDisplayProps {
  amount: number | string;
  className?: string;
  showSymbol?: boolean;
}

export default function RupeesDisplay({ 
  amount, 
  className = "", 
  showSymbol = true 
}: RupeesDisplayProps) {
  const { lang } = useAppStore();

  // Map Kutumbly lang codes to standard i18n locales for Intl.NumberFormat
  const localeMap: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', pa: 'pa-IN',
    ta: 'ta-IN', bho: 'hi-IN', kn: 'kn-IN', te: 'te-IN', ne: 'ne-NP',
    bn: 'bn-IN', mni: 'bn-IN'
  };

  const formatted = new Intl.NumberFormat(localeMap[lang] || 'en-IN', {
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return (
    <span className={`font-bold tabular-nums ${className}`}>
      {showSymbol ? "₹" : ""}{formatted}
    </span>
  );
}
