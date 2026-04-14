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
import { ShieldCheck, HardDrive, Zap, Share2, ArrowDownCircle, Lock, Globe, Shield } from 'lucide-react';

const PROTOCOLS = [
  { icon: Lock, title: 'PIN: Memory-Only', desc: 'Sovereign PIN is never stored on disk. Decrypts purely in RAM.' },
  { icon: HardDrive, title: 'Single .kutumb Vault', desc: 'AES-256-GCM encrypted local storage. Zero Cloud fingerprints.' },
  { icon: Zap, title: 'Verified Offline', desc: '100% network-silent after load. Mission logs stay on your hardware.' },
  { icon: Share2, title: 'Universal Export', desc: 'Your legacy is portable. Instant JSON/CSV export at any moment.' },
];

const BADGES = ['AES-256-GCM', 'PBKDF2', 'Mission-Offline', 'Zero Telemetry', 'Sovereign Handover'];

export default function LandingPrivacy() {
  return (
    <section id="privacy" className="py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-clinical border border-border-light rounded-full shadow-sm">
                 <Lock size={14} className="text-gold" />
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Privacy Architecture v3.0</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight font-inter-tight leading-[1.1]">
                Your life never touches <br className="hidden md:block" /> any server.
              </h2>
              
              <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl">
                 Kutumbly is built on a "Zero-Trust, Zero-Cloud" foundation. Everything is locked within a single <span className="text-text-primary underline decoration-gold/40">.kutumb</span> vault—hardened with AES-256-GCM using your PIN via PBKDF2.
              </p>
            </motion.div>

            <div className="space-y-8">
               <div className="p-8 bg-clinical border border-border-light rounded-[32px] relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-gold/10 group-hover:text-gold/20 transition-colors">
                     <ShieldCheck size={64} />
                  </div>
                  <p className="text-sm md:text-base text-gold-text leading-relaxed font-bold italic relative z-10">
                    "A dedicated, local-first gateway designed for the Indian family. Your data stays in your control, offline, and secure for generations."
                  </p>
               </div>

               <div className="flex flex-wrap gap-4">
                  {BADGES.map(b => (
                    <span key={b} className="px-6 py-3 bg-clinical shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary border border-border-light rounded-2xl hover:border-gold/40 transition-colors">
                      {b}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="p-10 bg-clinical border border-border-light rounded-[4rem] shadow-2xl shadow-gold/5 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -z-10" />
                
                {/* Visual Architecture Diagram (CSS-based) */}
                <div className="space-y-8">
                   <div className="flex items-center justify-between text-[10px] font-black text-text-tertiary tracking-widest border-b border-border-light pb-4">
                      <span>PIPELINE ANALYSIS</span>
                      <span className="text-text-success">STATUS: HARDENED</span>
                   </div>
                   
                   <div className="space-y-6">
                      {[
                        { label: "Client-Side Encryption", value: "AES-256-GCM" },
                        { label: "Network Activity", value: "DISABLED / AIR-GAPPED" },
                        { label: "Database Engine", value: "SQLITE WASM (VFS)" },
                        { label: "Memory Handling", value: "ZERO PERSISTENCE" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2" >
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{item.label}</span>
                              <span className="text-[11px] font-black text-text-primary font-inter-tight">{item.value}</span>
                           </div>
                           <div className="h-1 bg-border-light rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 1 }}
                                className="h-full bg-gold"
                              />
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="pt-8 flex items-center justify-center">
                      <div className="inline-flex items-center gap-4 py-4 px-10 bg-white border border-border-light rounded-3xl shadow-sm text-[9px] font-black text-text-primary uppercase tracking-[0.3em]">
                         <Globe size={14} className="text-[#EF4444]" />
                         Cloud Zero Protocol Verified
                      </div>
                   </div>
                </div>
             </motion.div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 gold-glow -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
