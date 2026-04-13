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
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

export default function LandingHeader() {
  const { lang, setLang } = useAppStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-20 z-50 bg-bg-tertiary/80 backdrop-blur-md border-b border-border-light">
      <div className="flex items-center gap-3">
         <Link href="/" className="w-8 h-8 bg-bg-primary border border-border-light rounded-2xl flex items-center justify-center p-1 shadow-sm hover:border-gold transition-colors block">
            <Image src="/favicon.svg" alt="Logo" width={20} height={20} />
         </Link>
         <Link href="/" className="font-black text-lg tracking-tight text-text-primary hover:text-gold transition-colors">
            Kutumbly
         </Link>
      </div>
      <div className="flex items-center gap-4">
         <button 
           onClick={() => window.location.pathname === '/' ? window.scrollTo({ top: 800, behavior: 'smooth' }) : window.location.href = '/'}
           className="hidden md:block text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
         >
            {lang === 'hi' ? 'Kaise kaam karta hai' : 'How it works'}
         </button>
         <Link 
           href="/contact"
           className="hidden md:block text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
         >
            Contact
         </Link>
         <button 
           onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
           className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5 px-4 py-2 rounded-xl border border-gold/10 hover:bg-gold-light transition-all active:scale-95"
         >
           {lang === 'en' ? 'हिन्दी' : 'EN'}
         </button>
         <Link href="/os" className="btn px-6 py-2.5 rounded-2xl border-2 border-text-primary font-black uppercase text-[11px] tracking-widest hover:bg-text-primary hover:text-white transition-all shadow-sm">
            {lang === 'hi' ? 'App Khola' : 'Open App'}
         </Link>
      </div>
    </nav>
  );
}
