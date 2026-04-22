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

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation, Language } from '@/lib/i18n';
import { getPanchang } from '@/lib/panchang';
import { 
  Sun, 
  Moon, 
  Calendar as CalcIcon, 
  ChevronRight,
  Heart,
  Shield
} from 'lucide-react';

export default function AajKaDinStrip() {
  const { lang, setActiveModule } = useAppStore();
  const t = useTranslation(lang as Language);
  
  const panchang = useMemo(() => getPanchang(), []);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const wisdomKey = `wisdom.${today.getDate() % 6}`;
  const wisdom = t(wisdomKey);

  return (
    <div className="w-full bg-[#8B0000] text-white border-b border-gold/30 shadow-2xl relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute left-0 top-0 h-full w-24 opacity-5 flex items-center justify-center pointer-events-none">
        <Sun size={120} strokeWidth={1} />
      </div>

      <div className="max-w-[1400px] mx-auto flex items-center h-16 px-4 gap-6 relative z-10">
        
        {/* Date & Day Module */}
        <div className="flex items-center gap-3 border-r border-white/10 pr-6 shrink-0">
          <div className="p-2 bg-white/10 rounded-lg border border-white/10">
            <CalcIcon size={18} className="text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-black text-gold">
              {t(panchang.dayNameKey)}
            </span>
            <span className="text-sm font-black tracking-tight leading-none">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Panchang Marquee - Level 1 Info */}
        <div className="flex-1 flex items-center gap-8 overflow-hidden">
           <motion.div 
            className="flex items-center gap-8 whitespace-nowrap"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
           >
             {/* Muhurat Badge (Choghadiya) */}
             {panchang.choghadiya && (
               <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                 <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: panchang.choghadiya.color }} />
                 <div className="flex flex-col">
                   <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{t('panchang.muhurat')}</span>
                   <span className="text-[11px] font-bold" style={{ color: panchang.choghadiya.color }}>{t(panchang.choghadiya.labelKey)}</span>
                 </div>
               </div>
             )}

             <div className="flex items-center gap-2">
               <Moon size={14} className="text-gold" />
               <span className="text-[9px] uppercase tracking-widest opacity-50 font-black">{t('panchang.tithi')}:</span>
               <span className="text-[11px] font-black text-gold">{t(panchang.tithiKey)}</span>
               <span className="text-[9px] opacity-40 font-bold uppercase">({t(panchang.pakshaKey)})</span>
             </div>

             <div className="flex items-center gap-2">
               <Sun size={14} className="text-gold" />
               <span className="text-[9px] uppercase tracking-widest opacity-50 font-black">{t('panchang.nakshatra')}:</span>
               <span className="text-[11px] font-black">{t(panchang.nakshatraKey)}</span>
             </div>

             {/* Dina Vishesh Wisdom */}
             <div className="flex items-center gap-3 border-l border-white/10 pl-8">
               <Heart size={14} className="text-gold fill-gold/20" />
               <span className="text-[11px] italic font-medium opacity-80 tracking-tight">
                 &quot;{wisdom}&quot;
               </span>
             </div>
           </motion.div>
        </div>

        {/* Action Button - Rahu Kaal Alert */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-gold/60">{t('panchang.rahu_kaal')}</span>
            <span className="text-[11px] font-black text-[#FFA07A]">{panchang.rahuKaal.start} - {panchang.rahuKaal.end}</span>
          </div>

          <button 
            onClick={() => setActiveModule('panchang')}
            className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/20 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              {t('NAV_SANSKRITI')}
            </span>
            <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Aesthetic Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </div>
  );
}
