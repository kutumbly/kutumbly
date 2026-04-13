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
import { Globe, Lock, Cpu } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

interface GatewayShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function GatewayShell({ children, sidebar }: GatewayShellProps) {
  const { lang, toggleLang } = useAppStore();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-tertiary relative overflow-hidden pt-safe">
      
      <div className="flex-1 flex flex-col w-full md:w-[85vw] md:max-w-[1200px] md:h-[80vh] md:max-h-[860px] md:min-h-[600px] bg-white md:rounded-[2.5rem] shadow-2xl shadow-black/[0.03] overflow-hidden border-border-light relative z-10 mx-auto transition-all duration-500 md:border md:mt-10">
        
        {/* Top bar (Clean & Minimalist) */}
        <div className="h-16 md:h-14 border-b border-border-light bg-white flex items-center justify-between px-6 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-7 md:h-7 bg-white border border-border-light rounded-xl flex items-center justify-center p-1 shadow-sm">
               <Image src="/favicon.svg" alt="Logo" width={20} height={20} className="brightness-110" />
            </div>
            <div className="flex items-baseline gap-2">
               <span className="font-black text-text-primary tracking-tight text-base md:text-lg leading-none">Kutumbly</span>
               <span className="text-[10px] text-gold font-black uppercase tracking-[0.2em] hidden md:block">Bharat</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleLang}
              className="text-[10px] font-black tracking-[0.2em] uppercase text-text-tertiary hover:text-gold transition-colors"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Sidebar (Desktop Only) */}
          <aside className="hidden md:block w-72 border-r border-border-light bg-[#FAF9F6] overflow-y-auto scroller-hide">
             {sidebar}
          </aside>

          {/* Right Panel: Dynamic Content */}
          <main className="flex-1 bg-white overflow-y-auto scroller-hide flex flex-col pt-safe">
            {children}
          </main>
        </div>

        {/* Status bar */}
        <div className="hidden md:flex h-10 border-t border-border-light bg-[#FAF9F6] items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4 text-[9px] text-text-tertiary font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-text-success shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
              Sovereign Instance
            </div>
            <div className="flex items-center gap-2">
              <Lock size={12} className="opacity-50" />
              AES-256 Protocol
            </div>
          </div>
          <div className="text-[9px] text-text-tertiary font-black tracking-[0.4em] uppercase">
             Zero Cloud · Local First
          </div>
        </div>
      </div>
    </div>
  );
}

