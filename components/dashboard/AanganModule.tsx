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
import { useAppStore } from '@/lib/store';
import { useSanskriti } from '@/modules/sanskriti';
import { useSaman } from '@/modules/saman';
import { useInvest } from '@/modules/invest';
import { useVidya } from '@/modules/vidya';
import { useCash } from '@/modules/cash';
import { useHealth } from '@/modules/health';
import { useSuvidha } from '@/modules/suvidha';
import { useVahan } from '@/modules/vahan';
import { 
  Shield, 
  ChevronRight, 
  Activity, 
  Heart, 
  Zap, 
  Package, 
  TrendingUp, 
  GraduationCap, 
  Flame, 
  Car, 
  Users, 
  Briefcase 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';
import AajKaDinStrip from './AajKaDinStrip';
import GlassCard from '../ui/GlassCard';
import SparkLine from '../ui/SparkLine';

export default function AanganModule() {
  const { lang, setActiveModule } = useAppStore();
  const t = useTranslation(lang as Language);
  
  // Module Hooks for Level 1 Summaries
  const { summary: cashSummary } = useCash();
  const { readings } = useHealth();
  const { vendors: suvidhaVendors } = useSuvidha();
  const { items: inventory } = useSaman();
  const { summary: investSummary } = useInvest();
  const { learners, getStats: getVidyaStats } = useVidya();
  const { logs: ritualLogs } = useSanskriti();
  const { vehicles, criticalAlerts: vahanAlerts } = useVahan();

  // 1. Module Grid Definition (Level 1)
  const modules = [
    { 
      id: 'money', 
      label: t('NAV_CASH'), 
      icon: TrendingUp, 
      color: 'gold', 
      value: `₹${cashSummary.balance.toLocaleString('en-IN')}`, 
      sub: cashSummary.expense > 0 ? `${Math.round((cashSummary.expense / (cashSummary.income || 1)) * 100)}% Spent` : t('aangan.budget_stable'),
      trend: [100, 120, 110, 140, 130, 160] // Placeholder list for visual
    },
    { 
      id: 'health', 
      label: t('nav.health_up'), 
      icon: Heart, 
      color: 'red', 
      value: readings[0] ? `${readings[0].bp_systolic}/${readings[0].bp_diastolic}` : t('aangan.update_needed'), 
      sub: readings.length > 0 ? `${readings.length} Logged` : 'No Record'
    },
    { 
      id: 'sewak', 
      label: t('NAV_SEWAK'), 
      icon: Users, 
      color: 'blue', 
      value: '4 Staff', 
      sub: 'All Active' 
    },
    { 
      id: 'suvidha', 
      label: t('NAV_SUVIDHA'), 
      icon: Zap, 
      color: 'amber', 
      value: `${suvidhaVendors.length} Utilities`, 
      sub: 'Service OK' 
    },
    { 
      id: 'saman', 
      label: t('NAV_SAMAN'), 
      icon: Package, 
      color: 'emerald', 
      value: `${inventory.filter(i => i.current_stock <= (i.threshold ?? 0)).length} Alerts`, 
      sub: t('aangan.refill_needed') 
    },
    { 
      id: 'vidya', 
      label: 'Vidya Hub', 
      icon: GraduationCap, 
      color: 'indigo', 
      value: `${learners.length} Learners`, 
      sub: 'Focus High' 
    },
    { 
      id: 'utsav', 
      label: t('NAV_UTSAV'), 
      icon: Briefcase, 
      color: 'rose', 
      value: '2 Events', 
      sub: 'Upcoming' 
    },
    { 
      id: 'vahan', 
      label: t('NAV_VAHAN'), 
      icon: Car, 
      color: 'slate', 
      value: `${vehicles.length} Vehicles`, 
      sub: vahanAlerts > 0 ? `${vahanAlerts} Critical` : 'Safe' 
    },
    { 
      id: 'sanskriti', 
      label: t('NAV_SANSKRITI'), 
      icon: Flame, 
      color: 'orange', 
      value: `${ritualLogs.length} Rituals`, 
      sub: 'Dharma Active' 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex flex-col gap-6 -mt-6 -mx-4 md:-mx-6 h-full bg-bg-primary">
      
      {/* ── Level 1: Aaj Ka Din Strip ────────────────────────── */}
      <AajKaDinStrip />

      <div className="px-4 md:px-6 space-y-8 pb-10">
        
        {/* ── 9-Module Interactive Grid ────────────────────────── */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {modules.map((mod) => (
            <motion.div 
              key={mod.id} 
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModule(mod.id)}
              className="cursor-pointer group"
            >
              <GlassCard className="p-4 md:p-5 flex flex-col justify-between min-h-[140px] border-border-light hover:border-gold/30 transition-all shadow-sm bg-bg-secondary relative overflow-hidden">
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 bg-current transform translate-x-4 -translate-y-4 rounded-full pointer-events-none group-hover:opacity-10 transition-opacity`} />
                
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gold group-hover:text-black transition-all`}>
                    <mod.icon size={22} strokeWidth={2.5} />
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary group-hover:text-gold transition-all" />
                </div>

                <div className="mt-4">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1">
                    {mod.label}
                  </div>
                  <div className="text-xl font-bold text-text-primary tracking-tight truncate">
                    {mod.value}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-text-tertiary/60 tracking-wider flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      {mod.sub}
                    </div>
                    {mod.id === 'money' && (
                      <div className="opacity-40">
                        <SparkLine data={[10, 15, 8, 12, 10, 20]} width={40} height={12} color="var(--gold)" />
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Secondary Family Context ────────────────────────── */}
        <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Family Pulse */}
           <div className="bg-bg-secondary border border-border-light rounded-3xl p-6 flex items-center justify-between group hover:border-gold/20 transition-all">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <Users size={28} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-text-primary mb-0.5">Family Identity</h3>
                    <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest">Sovereign Vault #2940</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveModule('family')}
                className="p-3 rounded-full bg-white/5 text-text-tertiary hover:bg-gold hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>

           {/* Security Status */}
           <div className="bg-bg-secondary border border-border-light rounded-3xl p-6 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <Shield size={28} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-text-primary mb-0.5">Sovereign Shield</h3>
                    <p className="text-[10px] text-text-success uppercase font-black tracking-widest">Zero Cloud · Local Only</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Active</span>
              </div>
           </div>
        </motion.section>

      </div>
    </div>
  );
}
