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
import { Shield, Lock } from 'lucide-react';

export default function LandingVaultPreview() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white rounded-[32px] border border-border-light shadow-2xl shadow-black/[0.03] overflow-hidden group"
      >
        {/* Browser Top Bar */}
        <div className="h-12 bg-[#FAF9F6] border-b border-border-light flex items-center px-6 justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-text-secondary">
             <Shield size={12} className="text-[#3b82f6]" />
             <span>Kutumbly - Vault Gateway</span>
          </div>
          <div className="text-[10px] font-bold text-text-success flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-text-success animate-pulse" />
             <span>online</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[480px]">
          {/* Sidebar Mockup */}
          <div className="w-full md:w-64 bg-[#FAF9F6] border-r border-border-light p-6">
             <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4">
               AAPKE VAULTS
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white border border-gold/20 rounded-2xl shadow-sm">
                   <div className="w-10 h-10 bg-gold-light/30 rounded-xl flex items-center justify-center text-xl">🏠</div>
                   <div className="flex-1">
                      <div className="text-sm font-bold text-text-primary leading-tight">Sharma Parivar</div>
                      <div className="text-[10px] text-text-tertiary font-bold">Aaj khola</div>
                   </div>
                   <Lock size={12} className="text-gold opacity-50" />
                </div>

                <div className="flex items-center gap-3 p-3 opacity-60">
                   <div className="w-10 h-10 bg-bg-tertiary rounded-xl flex items-center justify-center text-xl filter grayscale">💼</div>
                   <div className="flex-1">
                      <div className="text-sm font-bold text-text-primary leading-tight">Business</div>
                      <div className="text-[10px] text-text-tertiary font-bold">2 din pehle</div>
                   </div>
                   <Lock size={12} className="text-text-tertiary" />
                </div>

                <div className="flex items-center gap-3 p-3 opacity-60">
                   <div className="w-10 h-10 bg-bg-tertiary rounded-xl flex items-center justify-center text-xl filter grayscale">👨‍👩‍👧</div>
                   <div className="flex-1">
                      <div className="text-sm font-bold text-text-primary leading-tight">Joint Fund</div>
                      <div className="text-[10px] text-text-tertiary font-bold">5 din pehle</div>
                   </div>
                   <Lock size={12} className="text-text-tertiary" />
                </div>
             </div>

             <div className="mt-8 space-y-3">
                <button className="text-[11px] font-bold text-text-secondary flex items-center gap-2 hover:text-gold transition-colors">
                   <span>+</span> Naya Vault Banao
                </button>
                <button className="text-[11px] font-bold text-text-secondary flex items-center gap-2 hover:text-gold transition-colors">
                   <span>📁</span> .kutumb File Kholo
                </button>
             </div>
          </div>

          {/* Unlock Dashboard Preview */}
          <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center">
             <div className="text-center mb-10">
                <h3 className="text-base font-black text-text-primary mb-1">Sharma Parivar - PIN darj karein</h3>
                <div className="flex justify-center gap-3 mt-4">
                   <div className="w-3 h-3 rounded-full bg-gold" />
                   <div className="w-3 h-3 rounded-full bg-gold" />
                   <div className="w-3 h-3 rounded-full bg-gold" />
                   <div className="w-3 h-3 rounded-full border-2 border-border-medium" />
                </div>
             </div>

             {/* Numpad Mockup */}
             <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <div key={n} className="w-16 h-12 rounded-xl border border-border-light flex items-center justify-center text-sm font-bold text-text-secondary hover:bg-bg-secondary cursor-default shadow-sm">
                    {n}
                  </div>
                ))}
                <div className="w-16 h-12 rounded-xl flex items-center justify-center text-text-tertiary text-xs">⌫</div>
                <div className="w-16 h-12 rounded-xl border border-border-light flex items-center justify-center text-sm font-bold text-text-secondary hover:bg-bg-secondary shadow-sm">0</div>
                <div className="w-16 h-12 rounded-xl border border-border-light flex items-center justify-center text-gold shadow-sm">✓</div>
             </div>
          </div>
        </div>

        {/* Floating Accent */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-gold/10 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}
