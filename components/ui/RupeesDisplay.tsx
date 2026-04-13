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

interface RupeesDisplayProps {
  amount: number | string;
  className?: string;
  showSymbol?: boolean;
}

export default function RupeesDisplay({ 
  amount, 
  className = "", 
  showSymbol = true 
}: RupeesDisplayProps) {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return (
    <span className={`font-bold tabular-nums ${className}`}>
      {showSymbol ? "₹" : ""}{formatted}
    </span>
  );
}
