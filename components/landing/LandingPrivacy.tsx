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
                 </div>
                 <Lock size={14} className="text-gold" />
              </div>

              <div className="p-10 space-y-10">
                 <div className="space-y-8">
                    {PROTOCOLS.map((p, idx) => (
                      <motion.div 
                        key={p.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-6 group/item"
                      >
                         <div className="w-12 h-12 bg-white rounded-2xl shadow-xl shadow-black/[0.03] border border-border-light flex items-center justify-center text-gold group-hover/item:scale-110 transition-transform shrink-0">
                            <p.icon size={22} />
                         </div>
                         <div className="pt-1">
                            <div className="text-[13px] font-black text-text-primary uppercase tracking-tight mb-1">{p.title}</div>
                            <div className="text-[11px] text-text-tertiary font-bold leading-relaxed">{p.desc}</div>
                         </div>
                      </motion.div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-border-light">
                    <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-gold"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                       />
                    </div>
                    <div className="mt-3 flex justify-between text-[9px] font-black text-gold uppercase tracking-widest">
                       <span>Encryption Active</span>
                       <span>100% Native</span>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Floating Security Badge */}
           <motion.div 
             animate={{ y: [0, -15, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-12 -right-8 w-24 h-24 bg-gold text-white rounded-[2rem] shadow-2xl shadow-gold/40 flex items-center justify-center z-20 border-4 border-white"
           >
              <ShieldCheck size={36} />
           </motion.div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gold/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
