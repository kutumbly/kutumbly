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
    <div className="w-full max-w-6xl mx-auto px-6 py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[160px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/60 shadow-[0_40px_120px_rgba(0,0,0,0.06)] overflow-hidden group"
      >
        {/* Browser Top Bar — Research Edition */}
        <div className="h-20 bg-white/80 border-b border-border-light flex items-center px-10 justify-between">
          <div className="flex gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-border-medium/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-border-medium/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-border-medium/30" />
          </div>
          <div className="flex items-center gap-3 py-2.5 px-8 bg-clinical rounded-2xl border border-border-light shadow-inner">
             <Shield size={14} className="text-gold" />
             <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.25em]">Sovereign Gateway v2.4</span>
          </div>
          <div className="flex items-center gap-5">
             <div className="text-[9px] font-black text-text-success flex items-center gap-2 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-text-success animate-pulse" />
                <span>Encrypted Session</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[640px]">
          {/* Sidebar — Clinical Minimalism */}
          <div className="w-full lg:w-80 bg-white/20 border-r border-border-light/40 p-10">
             <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-10 opacity-60">
               MISSION VAULTS
             </div>
             
             <div className="space-y-5">
                <motion.div 
                   whileHover={{ x: 6 }}
                   className="flex items-center gap-5 p-5 bg-white border border-gold/10 rounded-[2.5rem] shadow-xl shadow-gold/5 cursor-default group/item"
                >
                   <div className="w-14 h-14 bg-clinical border border-border-light rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm group-hover/item:scale-110 transition-transform">🏛️</div>
                   <div className="flex-1">
                      <div className="text-sm font-black text-text-primary leading-none mb-1 font-inter-tight">Mallah Parivar</div>
                      <div className="text-[9px] text-text-success font-black uppercase tracking-widest">Master Vault</div>
                   </div>
                   <Lock size={14} className="text-gold" />
                </motion.div>

                {[
                  { icon: "💰", name: "Family Savings", status: "Hardened" },
                  { icon: "🩺", name: "Health Pulse", status: "Secure" }
                ].map((v, i) => (
                   <div key={i} className="flex items-center gap-5 p-5 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="w-14 h-14 bg-clinical border border-border-light rounded-[1.5rem] flex items-center justify-center text-3xl">{v.icon}</div>
                      <div className="flex-1">
                         <div className="text-sm font-black text-text-primary font-inter-tight">{v.name}</div>
                         <div className="text-[9px] text-text-tertiary font-black uppercase tracking-widest">{v.status}</div>
                      </div>
                      <Lock size={14} className="text-border-medium" />
                   </div>
                ))}
             </div>

             <div className="mt-16 border-t border-border-light/40 pt-10">
                <button className="w-full py-5 text-[9px] font-black text-text-tertiary flex items-center justify-center gap-3 hover:text-text-primary transition-all uppercase tracking-[0.2em] border border-border-light/60 rounded-2xl hover:bg-white hover:shadow-sm">
                   + Create New Vault
                </button>
             </div>
          </div>

          {/* Unlock Dashboard — The Reasoning Interface */}
          <div className="flex-1 p-16 flex flex-col items-center justify-center relative overflow-hidden bg-clinical/30">
             <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10" />
             
             {/* Reasoning Logic Path (Visual) */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[400px] h-[400px] border border-dashed border-gold/40 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[500px] h-[500px] border border-dashed border-gold/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
             </div>

             <motion.div 
                initial={{ scale: 0.98, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-[340px] text-center relative"
             >
                <div className="w-24 h-24 bg-white rounded-[3rem] border border-gold/30 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-gold/10 relative">
                   <div className="absolute inset-[-8px] border border-gold/10 rounded-[3.5rem] animate-pulse" />
                   <Lock size={36} className="text-gold" />
                </div>

                <h3 className="text-xl font-black text-text-primary mb-3 tracking-tight font-inter-tight">Vault Mission Logic</h3>
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-12">Enter Master PIN to release decryption keys</p>

                <div className="flex justify-center gap-5 mb-12">
                   {[1,2,3].map(i => (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * i }}
                        className="w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_rgba(201,151,28,0.4)]" 
                      />
                   ))}
                   <div className="w-4 h-4 rounded-full border-2 border-gold/20" />
                </div>

                <div className="grid grid-cols-3 gap-5">
                   {[1,2,3,4,5,6,7,8,9].map(n => (
                     <motion.div 
                       key={n} 
                       whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', borderColor: '#c9971c' }}
                       whileTap={{ scale: 0.95 }}
                       className="w-full aspect-square rounded-[1.8rem] border border-border-light bg-white/60 flex items-center justify-center text-base font-black text-text-primary shadow-sm cursor-default transition-all"
                     >
                       {n}
                     </motion.div>
                   ))}
                   <div className="w-full aspect-square flex items-center justify-center text-text-tertiary text-[10px] font-black uppercase tracking-widest">BKSP</div>
                   <div className="w-full aspect-square rounded-[1.8rem] border border-border-light bg-white/60 flex items-center justify-center text-base font-black text-text-primary shadow-sm transition-all hover:border-gold">0</div>
                   <motion.div 
                      whileHover={{ scale: 1.05, backgroundColor: '#c9971c', color: '#FFFFFF' }}
                      className="w-full aspect-square rounded-[1.8rem] border border-gold text-gold flex items-center justify-center shadow-lg shadow-gold/5 transition-all"
                   >
                      ✓
                   </motion.div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Technical Metadata Footer */}
        <div className="h-14 bg-clinical border-t border-border-light px-10 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Pipeline: Local-Sync v2</span>
              <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Latency: 0ms (Air-Gapped)</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-text-success shadow-[0_0_8px_rgba(6,95,70,0.4)]" />
              <span className="text-[9px] font-black text-text-success uppercase tracking-widest">System Sovereign</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
  );
}
