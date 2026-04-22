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
  ArrowLeft, Globe, Database, 
  Cpu, Zap, 
  Wallet, Book, Activity, Calendar, CheckSquare, Users
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";

export default function ProductContent() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  const PRODUCT_MODULES = [
    {
      category: t('product.category.financial'),
      title: t('nav.cash'),
      desc: t('product.module.cash.desc'),
      specs: [t('product.spec.tally'), t('product.spec.air_gapped'), t('product.spec.ledger')],
      icon: <Wallet className="text-gold" size={24} />
    },
    {
      category: t('product.category.intelligence'),
      title: t('nav.utsav'),
      desc: t('product.module.utsav.desc'),
      specs: [t('product.spec.ledger'), t('product.spec.qr_scanner'), t('product.spec.guest_insight')],
      icon: <Calendar className="text-gold" size={24} />
    },
    {
      category: t('product.category.legacy'),
      title: t('nav.diary'),
      desc: t('product.module.diary.desc'),
      specs: [t('product.spec.rich_text'), t('product.spec.media_vault'), t('product.spec.timeline')],
      icon: <Book className="text-gold" size={24} />
    },
    {
      category: t('product.category.vitality'),
      title: t('nav.health_up'),
      desc: t('product.module.health.desc'),
      specs: [t('product.spec.vitals'), t('product.spec.prescription'), t('product.spec.trends')],
      icon: <Activity className="text-gold" size={24} />
    },
    {
      category: t('product.category.tasks'),
      title: t('nav.todo'),
      desc: t('product.module.todo.desc'),
      specs: [t('product.spec.p2p_sync'), t('product.spec.recurring'), t('product.spec.priority')],
      icon: <CheckSquare className="text-gold" size={24} />
    },
    {
      category: t('product.category.peer'),
      title: t('nav.sync'),
      desc: t('product.module.sync.desc'),
      specs: [t('product.spec.webrtc'), t('product.spec.no_server'), t('product.spec.biometric')],
      icon: <Users className="text-gold" size={24} />
    }
  ];

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
              <ArrowLeft size={14} /> {t('common.return_home')}
            </Link>
            
            <h1 className="text-5xl md:text-8xl font-black text-text-primary tracking-tight font-inter-tight leading-none">
               {t('product.manifesto.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary font-medium leading-relaxed max-w-2xl">
              {t('product.manifesto.sub')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tech Specs Summary — Research Grade */}
      <section className="py-16 bg-clinical border-b border-border-light">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: <Database />, label: t('product.badge.vault_core'), value: t('product.badge.local_persistence') },
              { icon: <Cpu />, label: t('product.badge.aes_encryption'), value: t('product.badge.hardware_hardened') },
              { icon: <Globe />, label: t('product.badge.offline_first'), value: t('product.badge.off_grid_runtime') },
              { icon: <Zap />, label: t('product.badge.zero_telemetry'), value: t('product.spec.air_gapped') }
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
               {t('product.cta.title')}
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium italic opacity-80">
               {t('product.cta.quote')}
            </p>
            <div className="flex justify-center">
               <button className="px-12 py-6 bg-text-primary text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-gold transition-all hover:shadow-2xl hover:shadow-gold/20 hover:-translate-y-1">
                  {t('product.cta.btn')}
               </button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
