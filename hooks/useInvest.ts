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

import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export function useInvest() {
  const { db } = useAppStore();

  const data = useMemo(() => {
    if (!db) return { investments: [], summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0 } };

    try {
      const res = db.exec("SELECT * FROM investments ORDER BY current_value DESC");
      const investments = res[0]?.values.map(v => ({
        id: v[0],
        name: v[1],
        type: v[2],
        principal: Number(v[3]),
        current_value: Number(v[4]),
        units: v[5],
        monthly_sip: v[6],
        start_date: v[7],
        maturity_date: v[8],
        notes: v[9]
      })) || [];

      const totalPrincipal = investments.reduce((acc, i) => acc + i.principal, 0);
      const currentValue = investments.reduce((acc, i) => acc + i.current_value, 0);
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
    } catch (e) {
      return { investments: [], summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0 } };
    }
  }, [db]);

  return data;
}
