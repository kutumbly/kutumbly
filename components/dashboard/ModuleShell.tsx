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
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';

interface ModuleShellProps {
  title: string | React.ReactNode;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  onBack?: () => void;
  breadcrumbs?: string[];
  badge?: number | string;
  variant?: 'default' | 'glass';
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export default function ModuleShell({
  title,
  subtitle,
  onAdd,
  addLabel = "Add",
  onBack,
  breadcrumbs,
  badge,
  variant = 'default',
  children,
  headerActions,
}: ModuleShellProps) {
  const isGlass = variant === 'glass';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`space-y-4 md:space-y-6 ${isGlass ? 'p-4 md:p-6 bg-bg-secondary/40 backdrop-blur-xl border border-border-light/50 rounded-[2rem] shadow-sm' : ''}`}
    >
      {/* == Module Header ======================================= */}
      <div className={`sticky top-0 z-20 pb-2 flex items-center justify-between gap-4 ${!isGlass ? 'bg-bg-tertiary/90 backdrop-blur-md pt-2 -mt-2' : ''}`}>
        <div className="flex-1 flex items-center gap-3 min-w-0">

          {/* Back button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.88 }}
              className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-xl bg-bg-primary border border-border-light hover:border-gold/40 hover:text-gold text-text-tertiary transition-all shadow-sm active:scale-90"
              aria-label="Go Back"
            >
              <ArrowLeft size={16} />
            </motion.button>
          )}

          <div className="min-w-0 flex-1 relative">
            {/* Breadcrumb trail */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-[9px] font-black text-text-tertiary uppercase tracking-[0.22em] mb-1.5 overflow-hidden">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <span className="truncate max-w-[80px] opacity-60">{crumb}</span>
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight size={8} className="flex-shrink-0 opacity-30" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Title — premium gold left-accent bar */}
            <div className="flex items-center gap-2.5">
              <span className="w-[3px] h-6 rounded-full bg-gradient-to-b from-gold to-gold/20 flex-shrink-0" />
              <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight leading-tight truncate">
                {title}
              </h2>
              {badge !== undefined && badge !== 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full shadow-sm ml-1 -translate-y-2">
                  {badge}
                </span>
              )}
            </div>

            {/* Subtitle — offset to align under title */}
            {subtitle && !breadcrumbs && (
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.28em] mt-1 ml-[17px] truncate opacity-70">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {headerActions}
          {onAdd && (
            <motion.button
              onClick={onAdd}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.02 }}
              className="relative h-10 md:h-9 px-4 md:px-5 bg-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-gold/30 flex items-center justify-center gap-1.5 overflow-hidden group"
              aria-label={addLabel}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-sweep" />
              <Plus size={14} strokeWidth={3} className="flex-shrink-0 relative z-10" />
              <span className="hidden sm:inline relative z-10">{addLabel}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* == Content — slight fade-in delay ======================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
