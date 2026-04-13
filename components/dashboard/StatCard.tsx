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

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
}

export default function StatCard({ 
  label, 
  value, 
  color = "text-text-primary", 
  bg = "bg-primary",
  size = 'md'
}: StatCardProps) {
  return (
    <div className={`card ${size === 'sm' ? 'py-4' : 'py-6'} text-center shadow-sm ${bg} border-border-light/50`}>
      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary mb-1">
        {label}
      </div>
      <div className={`${size === 'sm' ? 'text-lg' : 'text-xl'} font-black ${color}`}>
        {value}
      </div>
    </div>
  );
}
