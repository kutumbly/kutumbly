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

  return (
    <div className={`relative bg-bg-primary p-5 rounded-[1.8rem] border shadow-black/[0.02] shadow-xl transition-all hover:border-gold/30 group ${statusBorders[status]}`}>
      {/* Subtle Status Top-bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] rounded-b-full opacity-30 group-hover:opacity-100 transition-opacity ${statusAccents[status]}`} />

      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
          {label}
        </span>
        {trend && trend.length > 0 && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <SparkLine 
              data={trend} 
              color={status === 'default' ? 'var(--gold)' : `var(--text-${status})`} 
            />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1 overflow-hidden">
        {isCurrency ? (
          <RupeesDisplay amount={value} className="text-base md:text-xl font-black text-text-primary truncate leading-none" />
        ) : (
          <span className="text-base md:text-xl font-black text-text-primary truncate leading-none">{value}</span>
        )}
        {unit && (
          <span className="text-[9px] font-black uppercase text-text-tertiary tracking-widest ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
