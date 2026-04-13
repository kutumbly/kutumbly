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
  
  const statusColors = {
    success: 'text-text-success bg-bg-success border-text-success/10',
    warning: 'text-text-warning bg-bg-warning border-text-warning/10',
    danger:  'text-text-danger bg-bg-danger border-text-danger/10',
    info:    'text-text-info bg-bg-info border-text-info/10',
    default: 'text-text-primary bg-bg-primary border-border-light'
  };

  return (
    <div className={`card p-5 border shadow-sm transition-all hover:border-gold/30 hover:shadow-md ${statusColors[status]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-80">
          {label}
        </span>
        {trend && trend.length > 0 && (
          <SparkLine 
            data={trend} 
            color={status === 'default' ? 'var(--gold)' : `var(--text-${status})`} 
          />
        )}
      </div>
      
      <div className="flex items-baseline gap-1 overflow-hidden">
        {isCurrency ? (
          <RupeesDisplay amount={value} className="text-base md:text-xl font-black truncate leading-none" />
        ) : (
          <span className="text-base md:text-xl font-black truncate leading-none">{value}</span>
        )}
        {unit && (
          <span className="text-[10px] font-bold uppercase opacity-60 ml-0.5">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
