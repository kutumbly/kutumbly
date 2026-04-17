/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
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
  children,
  headerActions,
}: ModuleShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-5 md:space-y-8"
    >
      {/* == Module Header ======================================= */}
      <div className="flex items-center justify-between gap-4">
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

          <div className="min-w-0 flex-1">
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

            {/* Title — gold left accent */}
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight leading-tight truncate">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && !breadcrumbs && (
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.28em] mt-1 truncate opacity-70">
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
              className="h-10 md:h-9 px-4 md:px-5 bg-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-gold/25 flex items-center justify-center gap-1.5"
              aria-label={addLabel}
            >
              <Plus size={14} strokeWidth={3} className="flex-shrink-0" />
              <span className="hidden sm:inline">{addLabel}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* == Content ============================================= */}
      <div>
        {children}
      </div>
    </motion.div>
  );
}
