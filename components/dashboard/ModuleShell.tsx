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
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface ModuleShellProps {
  title: string | React.ReactNode;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  onBack?: () => void;
  breadcrumbs?: string[];
  children: React.ReactNode;
}

export default function ModuleShell({ 
  title, 
  subtitle, 
  onAdd, 
  addLabel = "+ Add", 
  onBack,
  breadcrumbs,
  children 
}: ModuleShellProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8"
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-xl bg-bg-primary border border-border-light hover:border-gold hover:text-gold transition-colors shadow-sm"
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          
          <div className="min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1.5 truncate">
                 {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      <span className="truncate">{crumb}</span>
                      {idx < breadcrumbs.length - 1 && <ChevronRight size={10} className="flex-shrink-0 opacity-50" />}
                    </React.Fragment>
                 ))}
              </div>
            )}
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight truncate">
              {title}
            </h2>
            {subtitle && !breadcrumbs && (
              <p className="text-[10px] md:text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-1.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="h-10 px-5 bg-bg-primary border border-border-light rounded-xl font-bold text-xs text-text-secondary hover:border-gold/30 hover:text-gold transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            {addLabel}
          </button>
        )}
      </div>

      <div className="min-h-[400px]">
        {children}
      </div>
    </motion.div>
  );
}
