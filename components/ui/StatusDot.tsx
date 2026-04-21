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

type Status = 'online' | 'idle' | 'offline' | 'warning';

const colorMap: Record<Status, { ring: string; dot: string; pulse: string }> = {
  online:  { ring: 'ring-green-500/20',  dot: 'bg-green-500',  pulse: 'bg-green-400' },
  idle:    { ring: 'ring-amber-500/20',  dot: 'bg-amber-500',  pulse: 'bg-amber-400' },
  offline: { ring: 'ring-gray-400/20',   dot: 'bg-gray-400',   pulse: 'bg-gray-300' },
  warning: { ring: 'ring-red-500/20',    dot: 'bg-red-500',    pulse: 'bg-red-400' },
};

interface StatusDotProps {
  status?: Status;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  animate?: boolean;
}

const sizeMap = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' };

export default function StatusDot({ status = 'online', size = 'md', label, animate = true }: StatusDotProps) {
  const c = colorMap[status];
  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {animate && status !== 'offline' && (
          <motion.span
            className={`absolute inset-0 rounded-full ${c.pulse} opacity-40`}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        )}
        <span className={`relative rounded-full ${sizeMap[size]} ${c.dot}`} />
      </div>
      {label && <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{label}</span>}
    </div>
  );
}
