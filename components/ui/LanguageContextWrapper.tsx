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

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * Ensures the <html> tag has the correct lang and script-specific font classes
 */
export default function LanguageContextWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useAppStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('lang', lang);
      
      // Remove previous font classes
      const fontClasses = [
        'font-hindi', 'font-bengali', 'font-gujarati', 
        'font-punjabi', 'font-tamil', 'font-kannada', 'font-telugu'
      ];
      html.classList.remove(...fontClasses);

      // Add appropriate class
      switch (lang) {
        case 'hi': case 'mr': case 'bho': case 'ne':
          html.classList.add('font-hindi');
          break;
        case 'bn': case 'mni':
          html.classList.add('font-bengali');
          break;
        case 'gu':
          html.classList.add('font-gujarati');
          break;
        case 'pa':
          html.classList.add('font-punjabi');
          break;
        case 'ta':
          html.classList.add('font-tamil');
          break;
        case 'kn':
          html.classList.add('font-kannada');
          break;
        case 'te':
          html.classList.add('font-telugu');
          break;
      }
    }
  }, [lang]);

  return <>{children}</>;
}
