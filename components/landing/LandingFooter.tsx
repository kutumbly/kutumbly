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
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function LandingFooter() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <footer className="py-12 border-t border-border-light bg-bg-primary text-center">
       <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] flex flex-col items-center gap-4">
          <span>Built with ❤️ by AITDL Network · Gorakhpur, India</span>
          <div className="flex gap-6">
             <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
             <Link href="/founders" className="hover:text-gold transition-colors">{lang === 'en' ? 'Founders' : t('HOME')}</Link>
             <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
          </div>
          <div className="mt-4 opacity-50">
             © 2026 Kutumbly Sovereign. India&apos;s Family OS.
          </div>
       </div>
    </footer>
  );
}
