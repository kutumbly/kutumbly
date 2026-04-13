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

export function useDiary() {
  const { db } = useAppStore();

  const entries = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM diary_entries ORDER BY date DESC");
      return res[0]?.values.map(v => ({
        id: v[0],
        date: v[1],
        content: v[2],
        mood: v[3],
        mood_label: v[4],
        created_at: v[5]
      })) || [];
    } catch (e) {
      return [];
    }
  }, [db]);

  return { entries };
}
