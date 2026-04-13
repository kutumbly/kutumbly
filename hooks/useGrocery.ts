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

export function useGrocery() {
  const { db } = useAppStore();

  const data = useMemo(() => {
    if (!db) return { lists: [], items: [] };

    try {
      const listRes = db.exec("SELECT * FROM grocery_lists ORDER BY created_at DESC");
      const lists = listRes[0]?.values.map(v => ({
        id: v[0],
        name: v[1],
        created_at: v[2],
        status: v[3]
      })) || [];

      const itemRes = db.exec("SELECT * FROM grocery_items ORDER BY checked ASC, category ASC");
      const items = itemRes[0]?.values.map(v => ({
        id: v[0],
        list_id: v[1],
        name: v[2],
        quantity: v[3],
        unit: v[4],
        estimated_price: Number(v[5]),
        checked: Number(v[6]),
        category: v[7]
      })) || [];

      return { lists, items };
    } catch (e) {
      return { lists: [], items: [] };
    }
  }, [db]);

  return data;
}
