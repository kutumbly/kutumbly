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
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(201,151,28,0.1)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="flex-1 flex flex-col w-full md:w-[80vw] md:max-w-[1280px] md:min-w-[800px] md:h-[80vh] md:max-h-[900px] md:min-h-[600px] bg-bg-primary md:rounded-xl shadow-2xl overflow-hidden md:border-[0.5px] border-border-light relative z-10 mx-auto transition-all duration-500">
        
        {/* Top bar (Immersive & Safe) */}
        <div className="h-16 md:h-12 border-b-[0.5px] border-border-light bg-bg-primary/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Image src="/favicon.svg" alt="Logo" width={24} height={24} className="brightness-110 drop-shadow-sm" />
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="font-black text-text-primary tracking-tight text-sm md:text-base leading-none">Kutumbly</span>
               <span className="text-[10px] md:text-xs text-gold font-bold uppercase tracking-widest hidden md:block">Sovereign OS</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="text-[10px] font-black tracking-[0.2em] uppercase text-text-secondary hover:text-gold transition-colors"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Sidebar (Desktop Only) */}
          <aside className="hidden md:block w-72 border-r-[0.5px] border-border-light bg-bg-secondary overflow-y-auto scroller-hide">
             {sidebar}
          </aside>

          {/* Right Panel: Dynamic Content (Immersive for Mobile) */}
          <main className="flex-1 bg-bg-primary overflow-y-auto scroller-hide flex flex-col pt-safe">
            {/* On mobile, if no sidebar is shown, we might need to show the selection here */}
            {children}
          </main>
        </div>

        {/* Status bar (Desktop Only or Hidden for cleaner Mobile) */}
        <div className="hidden md:flex h-8 border-t-[0.5px] border-border-light bg-bg-secondary items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3 text-[10px] text-text-secondary font-medium">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Offline
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              AES-256-GCM
            </div>
          </div>
          <div className="text-[10px] text-text-tertiary font-bold tracking-widest">
            BHARAT · ZERO CLOUD
          </div>
        </div>
      </div>
    </div>
  );
}

