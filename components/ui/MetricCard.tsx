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
import SparkLine from './SparkLine';
import RupeesDisplay from './RupeesDisplay';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number[];
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  isCurrency?: boolean;
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
  isCurrency = false
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

  const statusText = {
    success: 'text-text-success',
    warning: 'text-text-warning',
    danger:  'text-text-danger',
    info:    'text-text-info',
    default: 'text-text-primary'
  };

  const displayValue = formatShort(value, isCurrency);

  return (
    <div className={`relative bg-bg-primary p-4 rounded-2xl border transition-all hover:border-gold/30 hover:shadow-md group overflow-hidden ${statusBorders[status]}`}>
      {/* Status accent top bar */}
      <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-25 group-hover:opacity-80 transition-opacity ${statusAccents[status]}`} />

      {/* Label + Sparkline */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary leading-tight flex-1">
          {label}
        </span>
        {trend && trend.length > 0 && (
          <div className="opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <SparkLine 
              data={trend} 
              color={status === 'default' ? 'var(--gold)' : `var(--text-${status})`} 
            />
          </div>
        )}
      </div>
      
      {/* Value — adaptive sizing, never truncates */}
      <div className="flex items-baseline gap-1 min-w-0">
        <span
          className={`font-black tabular-nums leading-none ${statusText[status]}`}
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
    </div>
  );
}
