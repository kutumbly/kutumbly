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
  /** 'sm' = base, 'md' = larger bold, 'hero' = display size */
  size?: 'sm' | 'md' | 'hero';
  /** Optional color override: 'gold' | 'success' | 'danger' | default (inherit) */
  color?: 'gold' | 'success' | 'danger' | 'default';
  /** Auto-abbreviate large values (1L, 9.2Cr) */
  compact?: boolean;
}

const COLOR_MAP = {
  gold:    'text-gold',
  success: 'text-text-success',
  danger:  'text-text-danger',
  default: '',
};

const SIZE_MAP = {
  sm:   'text-sm',
  md:   'text-base',
  hero: 'text-2xl md:text-3xl',
};

function compactFormat(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 10_00_00_000) return `${sign}${(abs / 10_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000)     return `${sign}${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000)        return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs.toLocaleString('en-IN')}`;
}

export default function RupeesDisplay({
  amount,
  className = "",
  showSymbol = true,
  size = 'sm',
  color = 'default',
  compact = false,
}: RupeesDisplayProps) {
  const { lang } = useAppStore();

  // Map Kutumbly lang codes → standard i18n locales for Intl.NumberFormat
  const localeMap: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', pa: 'pa-IN',
    ta: 'ta-IN', bho: 'hi-IN', kn: 'kn-IN', te: 'te-IN', ne: 'ne-NP',
    bn: 'bn-IN', mni: 'bn-IN'
  };

  const num = Number(amount);

  const formatted = compact
    ? compactFormat(num)
    : new Intl.NumberFormat(localeMap[lang] || 'en-IN', {
        maximumFractionDigits: 0,
      }).format(num);

  return (
    <span
      className={`font-black tabular-nums tracking-tight select-all transition-colors duration-200 ${SIZE_MAP[size]} ${COLOR_MAP[color]} ${className}`}
    >
      {showSymbol && <span className="opacity-70 mr-px text-[0.8em]">₹</span>}
      {formatted}
    </span>
  );
}
