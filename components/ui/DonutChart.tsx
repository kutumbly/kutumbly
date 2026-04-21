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

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  thickness?: number;
}

export default function DonutChart({ 
  data, 
  size = 120, 
  thickness = 12 
}: DonutChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Pre-compute cumulative start angles so we don't mutate across renders
  const segments = data.reduce<{ segment: DonutData; rotation: number; strokeDasharray: string }[]>(
    (acc, segment) => {
      const prevAngle = acc.length > 0 ? acc[acc.length - 1].rotation + (acc[acc.length - 1].segment.value / total) * 360 : -90;
      const strokeDasharray = `${(segment.value / total) * circumference} ${circumference}`;
      return [...acc, { segment, rotation: prevAngle, strokeDasharray }];
    },
    []
  );

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--bg-secondary)"
          strokeWidth={thickness}
        />
        
        {/* Segments */}
        {segments.map(({ segment, rotation, strokeDasharray }, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              className="transition-all duration-500 ease-in-out"
              strokeLinecap="round"
            />
        ))}
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center text-center">
         <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Total</span>
         <span className="text-sm font-black text-text-primary">{(total / 1000).toFixed(1)}k</span>
      </div>
    </div>
  );
}
