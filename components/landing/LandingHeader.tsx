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

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import LanguagePicker from '@/components/ui/LanguagePicker';
import { Globe } from 'lucide-react';

export default function LandingHeader() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const LANG_LABELS: Record<string, string> = {
    en: 'EN', hi: 'हि', mr: 'मर', gu: 'ગુ', pa: 'ਪੰ',
    ta: 'த', bho: 'भो', kn: 'ಕ', te: 'తె', ne: 'ने', bn: 'বা', mni: 'মৈ'
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-20 z-50 bg-white/80 backdrop-blur-xl border-b border-border-light shadow-sm">
        <div className="flex items-center gap-4">
           <Link href="/" className="w-9 h-9 bg-white border border-border-light rounded-[14px] flex items-center justify-center p-1.5 shadow-sm hover:border-gold transition-all hover:scale-105 active:scale-95">
              <Image src="/favicon.svg" alt="Kutumbly Logo" width={22} height={22} style={{ height: 'auto' }} />
           </Link>
           <Link href="/" className="font-black text-xl tracking-tight text-text-primary hover:text-gold transition-colors font-inter-tight">
              Kutumbly
           </Link>
        </div>
        <div className="flex items-center gap-8">
           <div className="hidden lg:flex items-center gap-8 px-8 border-x border-border-light/40">
              <Link href="/product" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-text-primary transition-colors">
                {t('nav.technical_manifesto')}
              </Link>
              <button 
                onClick={() => window.location.pathname === '/' ? window.scrollTo({ top: 800, behavior: 'smooth' }) : window.location.href = '/'}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-text-primary transition-colors"
              >
                {t('nav.mission_arch')}
              </button>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPickerOpen(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-primary bg-clinical px-5 py-2.5 rounded-2xl border border-border-light hover:bg-white hover:shadow-sm transition-all active:scale-95"
              >
                <Globe size={14} className="text-gold" />
                {LANG_LABELS[lang] ?? lang.toUpperCase()}
              </button>

              <Link href="/os" className="px-8 py-3 bg-text-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gold transition-all shadow-lg shadow-black/5 active:scale-95">
                 {t('nav.open_app')}
              </Link>
           </div>
        </div>
      </nav>

      <LanguagePicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
      />
    </>
  );
}
