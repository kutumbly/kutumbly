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
import { useAppStore } from '@/lib/store';
import { t, Language } from '@/lib/i18n';

interface TextProps {
  k: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A production-safe component to render localized strings.
 * Built for "Kutumbly Sovereign OS" to ensure no UI crashes.
 */
export const Text: React.FC<TextProps> = ({ k, className, style }) => {
  const { lang } = useAppStore();
  
  // Cast to Language to ensure type safety with store state
  const translated = t(k, lang as Language);

  return (
    <span className={className} style={style}>
      {translated}
    </span>
  );
};

export default Text;
