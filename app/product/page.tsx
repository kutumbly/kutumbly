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

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Shield, Lock, Globe, Database, 
  Smartphone, HardDrive, Cpu, Zap, 
  Wallet, Book, Activity, Calendar, CheckSquare, Users
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";

const PRODUCT_MODULES = [
  {
    category: "Financial Sovereignty",
    title: "Money (Aangan)",
    desc: "A mission-grade financial ledger. Track every paisa across bank accounts, cash, and investments with Tally-Prime XML export capability.",
    specs: ["AES-256 Ledger Encryption", "Real-time Cashflow Analysis", "Tally Bridge Enabled"],
    icon: <Wallet className="text-gold" size={24} />
  },
  {
    category: "Family Intelligence",
    title: "Nevata",
    desc: "Cultural event orchestration. Manage guest lists, gift ledgers (Lenden), and invitation payloads for weddings and family milestone missions.",
    specs: ["Family Ledger Persistence", "QR Scanner Integration", "Guest Insight Engine"],
    icon: <Calendar className="text-gold" size={24} />
  },
  {
    category: "Legacy Preservation",
    title: "Diary & Memories",
    desc: "A private digital sanctuary for family chronicles. Store intimate journals and milestones with zero telemetry and total air-gapped security.",
    specs: ["Rich Text Encryption", "Media-Vault Integration", "Timeline Persistence"],
    icon: <Book className="text-gold" size={24} />
  },
  {
    category: "Vitality Protocols",
    title: "Health Pulse",
    desc: "Encrypted health monitoring. Track vitals, medicine cycles, and family health history in a vault that never touches the cloud.",
    specs: ["Vitals Data Hardening", "Prescription Vault", "Trend Analysis (Offline)"],
    icon: <Activity className="text-gold" size={24} />
  },
  {
    category: "Task Coordination",
    title: "Sovereign To-Do",
    desc: "Autonomous family logistics. From grocery missions to property tax deadlines — managed locally, synced privately.",
    specs: ["P2P Sync Protocol", "Smart Recurring Missions", "Priority Isolation"],
    icon: <CheckSquare className="text-gold" size={24} />
  },
  {
    category: "Peer Connection",
    title: "Kutumb Sync",
    desc: "Encrypted data exchange via direct P2P pipelines. Share vaults with family members without ever passing data through a central server.",
    specs: ["WebRTC Encrypted Bricks", "No Server Relay", "Biometric Validation"],
    icon: <Users className="text-gold" size={24} />
  }
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeader />
      
      {/* Product Hero — Tactical Intro */}
      <section className="pt-40 pb-20 mission-grid border-b border-border-light">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-text-tertiary hover:text-gold transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Gateway
            </Link>
            
            <h1 className="text-5xl md:text-8xl font-black text-text-primary tracking-tight font-inter-tight leading-none">
              Technical <span className="text-gold">Manifesto.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary font-medium leading-relaxed max-w-2xl">
              An unvarnished breakdown of the Sovereign OS architecture and the modules designed to protect your family's digital sovereignty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tech Specs Summary — Research Grade */}
      <section className="py-16 bg-clinical border-b border-border-light">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: <Database />, label: "SQLite WASM", value: "Local Persistence" },
              { icon: <Cpu />, label: "AES-256-GCM", value: "Hardware Hardened" },
              { icon: <Globe />, label: "Zero Cloud", value: "Offline Runtime" },
              { icon: <Zap />, label: "Sub-5ms", value: "Latency Optimized" }
            ].map((spec, i) => (
              <div key={i} className="flex flex-col gap-3">
                 <div className="text-gold">{spec.icon}</div>
                 <div>
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">{spec.label}</div>
                    <div className="text-sm font-black text-text-primary font-inter-tight">{spec.value}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive Modules */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
            {PRODUCT_MODULES.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8 group"
              >
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-3 px-4 py-2 bg-clinical border border-border-light rounded-2xl">
                      {m.icon}
                      <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{m.category}</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight font-inter-tight group-hover:text-gold transition-colors">{m.title}</h2>
                   <p className="text-base text-text-secondary leading-relaxed font-medium">
                      {m.desc}
                   </p>
                </div>

                <div className="space-y-3 pt-4">
                   {m.specs.map((s, j) => (
                     <div key={j} className="flex items-center gap-4 text-sm font-black text-text-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {s}
                     </div>
                   ))}
                </div>

                <div className="h-px bg-border-light w-full group-hover:bg-gold/30 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture CTA */}
      <section className="py-32 bg-clinical border-t border-border-light relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full mission-grid opacity-30" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl md:text-7xl font-black text-text-primary tracking-tight font-inter-tight leading-none">
               Ready to go <br className="hidden md:block" /> 
               <span className="text-gold">Air-Gapped?</span>
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium italic opacity-80">
               "Sovereignty is not given. It is taken through cryptography."
            </p>
            <div className="flex justify-center">
               <button className="px-12 py-6 bg-text-primary text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-gold transition-all hover:shadow-2xl hover:shadow-gold/20 hover:-translate-y-1">
                  Deploy Sovereign Vault
               </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
