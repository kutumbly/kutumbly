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
import { useTranslation } from '@/lib/i18n';
import { getPanchang } from '@/lib/panchang';
import { 
  Sun, 
  Moon, 
  AlertCircle, 
  Calendar as CalcIcon, 
  ChevronRight,
  Clock,
  Car,
  Heart
} from 'lucide-react';
import { useVahan } from '@/modules/vahan';

export default function AajKaDinStrip() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const { alerts: vahanAlerts } = useVahan();
  
  const panchang = useMemo(() => getPanchang(), []);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const criticalAlertsCount = (vahanAlerts?.filter(a => a.isCritical).length || 0);

  return (
    <div className="w-full bg-[#8B0000] text-white border-b border-gold/30 shadow-2xl relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute left-0 top-0 h-full w-24 opacity-5 flex items-center justify-center pointer-events-none">
        <Sun size={120} strokeWidth={1} />
      </div>

      <div className="max-w-[1400px] mx-auto flex items-center h-14 px-4 gap-6">
        
        {/* Date & Day Module */}
        <div className="flex items-center gap-3 border-r border-white/10 pr-6 shrink-0">
          <div className="p-2 bg-white/10 rounded-lg">
            <CalcIcon size={18} className="text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold">
              {panchang.dayName}
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
             <div className="flex items-center gap-2">
               <Moon size={14} className="text-gold" />
               <span className="text-[10px] uppercase tracking-widest opacity-60">{t('TITHI')}:</span>
               <span className="text-xs font-bold text-gold">{panchang.tithi} ({panchang.paksha})</span>
             </div>

             <div className="flex items-center gap-2">
               <Sun size={14} className="text-gold" />
               <span className="text-[10px] uppercase tracking-widest opacity-60">{t('NAKSHATRA')}:</span>
               <span className="text-xs font-bold">{panchang.nakshatra}</span>
             </div>

             <div className="flex items-center gap-2 text-[#FFA07A]">
               <Clock size={14} />
               <span className="text-[10px] uppercase tracking-widest opacity-60">{t('RAHU_KAAL')}:</span>
               <span className="text-xs font-black">{panchang.rahuKaal.start} - {panchang.rahuKaal.end}</span>
             </div>

             {/* Quick Alert Ticker */}
             {criticalAlertsCount > 0 && (
               <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-gold/20 animate-pulse">
                 <AlertCircle size={14} className="text-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">
                   {criticalAlertsCount} {t('NAV_VAHAN')} Alerts
                 </span>
               </div>
             )}
           </motion.div>
        </div>

        {/* Action Button - To Level 2 (Rituals/Panchang) */}
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full transition-all group shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">
            {t('PANCHANGA')}
          </span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      {/* Aesthetic Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </div>
  );
}
