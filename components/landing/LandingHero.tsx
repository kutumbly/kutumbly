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
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Globe } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

export default function LandingHero() {
  const { lang, setLang } = useAppStore();

  return (
    <div className="relative min-h-[90vh] bg-bg-tertiary flex flex-col pt-24 items-center px-6 text-center overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-20 z-50 bg-bg-tertiary/80 backdrop-blur-md border-b border-border-light">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-bg-primary border border-border-light rounded-2xl flex items-center justify-center p-1 shadow-sm">
              <Image src="/favicon.svg" alt="Logo" width={20} height={20} />
           </div>
           <span className="font-black text-lg tracking-tight text-text-primary">Kutumbly</span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
             className="hidden md:block text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
           >
              {lang === 'hi' ? 'Kaise kaam karta hai' : 'How it works'}
           </button>
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

      <div className="max-w-4xl mx-auto z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-primary border border-border-light shadow-sm mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-text-success animate-pulse" />
          <span className="text-[11px] font-bold text-text-secondary">Runs in your browser - No install needed</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-black text-text-primary tracking-tighter leading-[1.05] mb-8"
        >
          Your family&apos;s <span className="text-gold">digital ghar</span>,<br />
          completely private
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          Diary, money, health, tasks, investments — all in one encrypted vault 
          that lives on your device. No cloud. No account. No subscription.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <Link href="/os" className="h-16 px-10 bg-bg-primary border-2 border-border-light rounded-[2rem] flex items-center gap-3 font-black text-base text-text-primary hover:border-gold transition-all shadow-xl shadow-black/[0.02]">
            Open Kutumbly Free
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* Mobile App Coming Soon */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="inline-flex items-center gap-3 px-6 py-3 bg-bg-secondary border border-border-light rounded-[1.5rem] mb-6 shadow-sm"
        >
           <span className="text-lg">📳</span>
           <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Installable app coming soon for Android & iOS</span>
        </motion.div>

        {/* Hero Footer Features */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary"
        >
           <div className="flex items-center gap-2">
              <Shield size={14} className="opacity-40" />
              <span>AES-256-GCM encrypted</span>
           </div>
           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border-light" />
           <div className="flex items-center gap-2">
              <Globe size={14} className="opacity-40" />
              <span>100% offline after first load</span>
           </div>
           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border-light" />
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border border-text-tertiary flex items-center justify-center text-[6px]">0</div>
              <span>Zero telemetry</span>
           </div>
        </motion.div>

      </div>

      {/* Hero Bottom Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
