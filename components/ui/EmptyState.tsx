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
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  compact?: boolean;
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-12 gap-4' : 'py-24 gap-6'}`}
    >
      {/* Icon or Emoji */}
      <div className={`${compact ? 'w-16 h-16' : 'w-24 h-24'} bg-bg-tertiary rounded-[2rem] border border-border-light/60 flex items-center justify-center opacity-40`}>
        {emoji ? (
          <span className={compact ? 'text-3xl' : 'text-5xl'}>{emoji}</span>
        ) : Icon ? (
          <Icon size={compact ? 28 : 40} strokeWidth={1} className="text-text-tertiary" />
        ) : null}
      </div>

      {/* Text */}
      <div className="space-y-2 opacity-50">
        <p className={`font-black uppercase tracking-[0.3em] text-text-tertiary ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-text-tertiary font-medium max-w-xs opacity-80">
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      {action && onAction && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onAction}
          className="mt-2 flex items-center gap-2 px-6 py-3 bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gold/30 opacity-90 hover:opacity-100 transition-opacity"
        >
          <Plus size={14} strokeWidth={3} />
          {action}
        </motion.button>
      )}
    </motion.div>
  );
}
