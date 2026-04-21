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
  ArrowLeft, Shield, Lock, Cpu, Database, 
  Wifi, HardDrive, Fingerprint, Zap, 
  Layers, Smartphone, Globe, Code
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";

export default function FeaturesPage() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const TECH_PILLARS = [
    {
      icon: <Database className="text-gold" />,
      title: t('product.badge.vault_core'),
      subtitle: "SQLite WASM Engine",
      desc: "Your data is stored in a relational database entirely within your browser's persistent storage. No remote database connection exists.",
      tech: [".kutumb File", "Relational Schema", "Persistent FS"]
    },
    {
      icon: <Lock className="text-gold" />,
      title: t('product.badge.aes_encryption'),
      subtitle: "AES-256 GCM Standards",
      desc: "Every byte is encrypted before it hits the disk. Your PIN is never stored; it is used to derive the encryption key via PBKDF2.",
      tech: ["Military Grade", "Zero-Knowledge", "Self-Custody"]
    },
    {
      icon: <Wifi className="text-gold" />,
      title: t('product.category.peer'),
      subtitle: "Beam Grid Protocol",
      desc: "Sync between devices using direct WebRTC channels. Your data travels encrypted through the air, never touching a central server.",
      tech: ["P2P Mesh", "No Cloud Mesh", "Instant Sync"]
    },
    {
      icon: <Smartphone className="text-gold" />,
      title: t('product.badge.off_grid_runtime'),
      subtitle: "Local-First Architecture",
      desc: "The entire OS is a static bundle. Once loaded, it works indefinitely without an internet connection. Speed is at hardware limits.",
      tech: ["Zero Latency", "Static Export", "Hardened JS"]
    }
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-gold/30">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[160px] -mr-96 -mt-96" />
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-text-tertiary hover:text-gold transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> {t('common.return_home')}
            </Link>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-clinical border border-border-light rounded-full">
                <Shield size={12} className="text-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Technical Blueprint v1.0</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight font-inter-tight leading-none">
                {t('landing.features.header_top')} <span className="text-gold">Sovereign.</span>
              </h1>
              <p className="text-xl md:text-3xl text-text-secondary font-medium leading-relaxed max-w-3xl opacity-80">
                {t('landing.features.desc')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Grid */}
      <section className="py-24 px-6 border-t border-border-light bg-clinical">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TECH_PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-12 bg-white border border-border-light rounded-[3rem] hover:border-gold/40 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-8 border border-border-light group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-gold uppercase tracking-[0.3em] font-inter-tight">{pillar.subtitle}</div>
                  <h3 className="text-3xl font-black tracking-tight">{pillar.title}</h3>
                  <p className="text-text-secondary font-medium leading-relaxed text-lg italic opacity-80">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {pillar.tech.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-clinical border border-border-light rounded-lg text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive: The .kutumb Specification */}
      <section className="py-32 px-6 bg-bg-primary overflow-hidden relative">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em]">The Standard</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight font-inter-tight">The .kutumb File.</h2>
              <p className="text-lg text-text-secondary leading-relaxed font-medium">
                Traditional apps spread your data across countless cloud tables. Kutumbly consolidates your entire legacy into a single, encrypted, portable file. 
                <br /><br />
                This is a relational database (SQLite) hardened with hardware-grade encryption. You can export it, back it up to a physical drive, or pass it down as a digital heirloom.
              </p>
              <div className="space-y-4">
                {[
                   "Zero cloud dependencies for data persistence",
                   "Relational integrity for complex family structures",
                   "Portable and version-controlled local snapshots"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm font-black text-text-primary">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md aspect-square bg-clinical border border-border-light rounded-[4rem] flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gold/5 rounded-[4rem] group-hover:scale-95 transition-transform duration-700" />
                <div className="relative text-center space-y-6">
                   <div className="w-24 h-24 mx-auto bg-text-primary rounded-3xl flex items-center justify-center text-gold shadow-2xl">
                      <HardDrive size={40} />
                   </div>
                   <div className="text-2xl font-black font-inter-tight">vault_2026.kutumb</div>
                   <div className="px-4 py-1.5 bg-text-success/10 text-text-success text-[10px] font-black uppercase tracking-widest rounded-full border border-text-success/20">
                      AES-256 GCM Hardened
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Manifest */}
      <section className="py-32 bg-text-primary text-white text-center px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-gold mb-8 flex justify-center">
              <Zap size={64} className="animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight font-inter-tight leading-none mb-12">
               Your Data. <br />
               Your Hardware. <br />
               <span className="text-gold">Your Sovereignty.</span>
            </h2>
            <p className="text-xl text-white/70 font-medium italic mb-12 leading-relaxed">
               "Kutumbly is mathematically incapable of spying on you. That is why I built it. That is why it exists."
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
               <Link href="/os" className="px-12 py-6 bg-gold text-text-primary rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-white transition-all hover:shadow-2xl hover:shadow-gold/20">
                  Launch the OS
               </Link>
               <Link href="/product" className="px-12 py-6 border border-white/20 text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                  Explore Hubs
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
