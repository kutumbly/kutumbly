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
import SparkLine from './SparkLine';
import RupeesDisplay from './RupeesDisplay';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number[];
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  isCurrency?: boolean;
  icon?: React.ReactNode;
}

// Smart value shortener: 9,85,000 → ₹9.85L; 66,240 → ₹66.2K; etc.
function formatShort(value: number | string, isCurrency: boolean): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  const abs = Math.abs(num);
  const prefix = num < 0 ? '-' : '';
  const sym = isCurrency ? '₹' : '';

  if (abs >= 10_00_00_000) return `${prefix}${sym}${(abs / 10_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000)    return `${prefix}${sym}${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000)       return `${prefix}${sym}${(abs / 1_000).toFixed(1)}K`;
  return `${prefix}${sym}${abs.toLocaleString('en-IN')}`;
}

export default function MetricCard({ 
  label, 
  value, 
  unit = "", 
  trend, 
  status = 'default',
  isCurrency = false,
  icon,
}: MetricCardProps) {
  
  const statusBorders = {
    success: 'border-text-success/20',
    warning: 'border-text-warning/20',
    danger:  'border-text-danger/20',
    info:    'border-text-info/20',
    default: 'border-border-light'
  };

  const statusAccents = {
    success: 'bg-text-success',
    warning: 'bg-text-warning',
    danger:  'bg-text-danger',
    info:    'bg-text-info',
    default: 'bg-gold'
  };

  const statusGlows = {
    success: 'rgba(6,95,70,0.1)',
    warning: 'rgba(146,64,14,0.1)',
    danger:  'rgba(153,27,27,0.1)',
    info:    'rgba(30,64,175,0.1)',
    default: 'rgba(201,151,28,0.08)'
  };

  const statusText = {
    success: 'text-text-success',
    warning: 'text-text-warning',
    danger:  'text-text-danger',
    info:    'text-text-info',
    default: 'text-text-primary'
  };

  const displayValue = formatShort(value, isCurrency);

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`relative bg-bg-primary p-4 rounded-2xl border transition-all hover:shadow-lg group overflow-hidden cursor-default ${statusBorders[status]}`}
      style={{ '--glow-color': statusGlows[status] } as React.CSSProperties}
    >
      {/* Status accent top bar — animates opacity on hover */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] rounded-b-full opacity-20 group-hover:opacity-70 transition-opacity duration-300 ${statusAccents[status]}`} />

      {/* Subtle radial glow behind value on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 20% 80%, ${statusGlows[status]} 0%, transparent 70%)` }}
      />

      {/* Label row */}
      <div className="flex justify-between items-start mb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {icon && (
            <span className="text-text-tertiary opacity-60 flex-shrink-0 group-hover:opacity-100 transition-opacity">
              {icon}
            </span>
          )}
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary leading-tight flex-1 truncate">
            {label}
          </span>
        </div>
        {trend && trend.length > 0 && (
          <div className="opacity-40 group-hover:opacity-90 transition-opacity flex-shrink-0">
            <SparkLine 
              data={trend} 
              color={status === 'default' ? 'var(--gold)' : `var(--text-${status})`} 
            />
          </div>
        )}
      </div>
      
      {/* Value — adaptive sizing, never truncates */}
      <div className="flex items-baseline gap-1 min-w-0 relative z-10">
        <span
          className={`font-black tabular-nums leading-none transition-colors ${statusText[status]}`}
          style={{ fontSize: 'clamp(0.95rem, 3.5cqi, 1.35rem)' }}
        >
          {displayValue}
        </span>
        {unit && (
          <span className="text-[9px] font-black uppercase text-text-tertiary tracking-widest flex-shrink-0">
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  );
}
