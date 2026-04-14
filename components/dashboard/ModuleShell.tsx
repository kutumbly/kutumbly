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
  children: React.ReactNode;
  /** Optional action area rendered beside the add button */
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6 md:space-y-8"
    >
      {/* ── Module Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          {/* Back button */}
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-2xl bg-bg-primary border border-border-light hover:border-gold hover:text-gold text-text-tertiary transition-all shadow-sm active:scale-90"
              aria-label="Go Back"
            >
              <ArrowLeft size={17} />
            </button>
          )}
          
          <div className="min-w-0 flex-1">
            {/* Breadcrumb trail */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1.5 overflow-hidden">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <span className="truncate max-w-[80px]">{crumb}</span>
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight size={9} className="flex-shrink-0 opacity-40" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight truncate leading-tight">
              {title}
            </h2>

            {/* Subtitle — only on overview (no breadcrumbs) */}
            {subtitle && !breadcrumbs && (
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {headerActions}
          {onAdd && (
            <button 
              onClick={onAdd}
              className="h-10 px-4 bg-gold text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-gold/20 active:scale-95 flex items-center gap-2"
              aria-label={addLabel}
            >
              <Plus size={14} strokeWidth={3} />
              <span className="hidden sm:inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="min-h-[300px] md:min-h-[400px]">
        {children}
      </div>
    </motion.div>
  );
}
