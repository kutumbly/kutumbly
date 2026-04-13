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
import { ShieldCheck, HardDrive, Zap, Share2, ArrowDownCircle, Lock } from 'lucide-react';

const PROTOCOLS = [
  { icon: Lock, title: 'PIN never stored', desc: 'Memory only — gone on close' },
  { icon: HardDrive, title: 'Single .kutumb file', desc: 'Copy it, back it up yourself' },
  { icon: Zap, title: 'Zero network calls', desc: 'After first load — verified' },
  { icon: Share2, title: 'Full data export', desc: 'Your data, always portable' },
];

const BADGES = ['AES-256-GCM', 'PBKDF2', '100% offline', 'Zero telemetry', 'Export anytime'];

export default function LandingPrivacy() {
  return (
    <section className="py-24 bg-white px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8">
           <h2 className="text-3xl md:text-5xl font-black text-text-primary leading-tight">
             Your data never touches any server
           </h2>
           
           <div className="space-y-6">
             <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium">
               Everything is stored in a single <span className="font-bold text-text-primary">.kutumb</span> file — 
               encrypted with AES-256-GCM using your PIN via PBKDF2. No accounts. No cloud. No one else can read it.
             </p>
             <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium">
               Inspired by Tally ERP's trusted Gateway model — familiar to every Indian business owner. Just open, unlock, and manage your family's legacy.
             </p>
           </div>

           <div className="flex flex-wrap gap-2 pt-2">
              {BADGES.map(b => (
                <span key={b} className="px-3 py-1.5 bg-gold-light/20 text-[10px] font-black uppercase tracking-widest text-gold border border-gold/10 rounded-full">
                  {b}
                </span>
              ))}
           </div>
        </div>

        {/* Visual Mockup */}
        <div className="flex-1 relative w-full">
           <div className="relative z-10 bg-white p-2 rounded-[2.5rem] border border-border-light shadow-2xl shadow-black/5">
              <div className="bg-[#FAF9F6] p-8 rounded-[2rem]">
                 <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6">
                   Sovereign Protocol
                 </div>

                 <div className="space-y-6">
                    {PROTOCOLS.map((p, idx) => (
                      <motion.div 
                        key={p.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-5 group"
                      >
                         <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-border-light flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                            <p.icon size={18} />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-text-primary">{p.title}</div>
                            <div className="text-[10px] text-text-tertiary font-bold">{p.desc}</div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Decorative Element */}
           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-10 -right-10 md:-left-12 bottom-auto md:top-1/2 w-16 h-16 bg-white rounded-full shadow-lg border border-border-light flex items-center justify-center text-text-tertiary z-20"
           >
              <ArrowDownCircle size={24} />
           </motion.div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-3xl -z-10 rounded-full" />
        </div>

      </div>
    </section>
  );
}
