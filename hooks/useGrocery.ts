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

import { GroceryList, GroceryItem } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export function useGrocery() {
  const { db } = useAppStore();

  const data = useMemo(() => {
    const lists = runQuery<GroceryList>(db, "SELECT * FROM grocery_lists ORDER BY created_at DESC");
    const items = runQuery<GroceryItem>(db, "SELECT * FROM grocery_items ORDER BY checked ASC, category ASC");

    return { lists, items };
  }, [db]);

  return data;
}
