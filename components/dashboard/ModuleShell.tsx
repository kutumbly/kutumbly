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

interface ModuleShellProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}

export default function ModuleShell({ 
  title, 
  subtitle, 
  onAdd, 
  addLabel = "+ Add", 
  children 
}: ModuleShellProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6 px-2 md:px-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-base md:text-xl font-bold text-text-primary tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[8px] md:text-[11px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5 md:mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="btn btn-primary shadow-sm px-4 py-2 text-xs"
          >
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
