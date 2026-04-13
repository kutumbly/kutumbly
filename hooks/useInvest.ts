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

import { Investment } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export interface InvestData {
  investments: Investment[];
  summary: {
    totalPrincipal: number;
    currentValue: number;
    profit: number;
    pnlPercent: number;
  };
}

export function useInvest(): InvestData {
  const { db } = useAppStore();

  return useMemo<InvestData>(() => {
    if (!db) return { investments: [], summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0 } };

    try {
      const investments = runQuery<Investment>(db, "SELECT * FROM investments ORDER BY current_value DESC");
      
      const totalPrincipal = investments.reduce((acc: number, i: Investment) => acc + i.principal, 0);
      const currentValue = investments.reduce((acc: number, i: Investment) => acc + i.current_value, 0);
      const profit = currentValue - totalPrincipal;
      const pnlPercent = totalPrincipal > 0 ? (profit / totalPrincipal) * 100 : 0;

      return {
        investments,
        summary: {
          totalPrincipal,
          currentValue,
          profit,
          pnlPercent
        }
      };
    } catch {
      return { investments: [], summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0 } };
    }
  }, [db]);
}
