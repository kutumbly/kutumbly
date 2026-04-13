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

import { GroceryItem } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { useMemo, useCallback, useState } from 'react';

export function useGrocery() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const items = useMemo<GroceryItem[]>(() => {
    return runQuery<GroceryItem>(
      db,
      "SELECT * FROM grocery_items ORDER BY checked ASC, category ASC, name ASC"
    );
  }, [db, tick]);

  /** Add a new grocery item to the default list */
  const addItem = useCallback((
    name: string,
    category: string,
    quantity: string,
    unit: string,
    estimated_price: number
  ) => {
    if (!db || !name.trim()) return;

    // Ensure there's at least one list; use or create "Default"
    let listId: string;
    const existingList = db.exec("SELECT id FROM grocery_lists LIMIT 1");
    if (existingList[0]?.values?.[0]?.[0]) {
      listId = existingList[0].values[0][0] as string;
    } else {
      listId = crypto.randomUUID();
      db.run(
        "INSERT INTO grocery_lists (id, name, created_at, status) VALUES (?, ?, ?, ?)",
        [listId, "Main List", new Date().toISOString(), "active"]
      );
    }

    const id = crypto.randomUUID();
    db.run(
      "INSERT INTO grocery_items (id, list_id, name, quantity, unit, estimated_price, checked, category) VALUES (?, ?, ?, ?, ?, ?, 0, ?)",
      [id, listId, name.trim(), quantity || '1', unit || 'pcs', estimated_price || 0, category || 'General']
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  /** Toggle checked/unchecked state */
  const checkItem = useCallback((id: string, currentChecked: boolean | number) => {
    if (!db) return;
    const newVal = currentChecked ? 0 : 1;
    db.run("UPDATE grocery_items SET checked = ? WHERE id = ?", [newVal, id]);
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  /** Delete an item permanently */
  const deleteItem = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM grocery_items WHERE id = ?", [id]);
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  /** Clear all checked items */
  const clearChecked = useCallback(() => {
    if (!db) return;
    db.run("DELETE FROM grocery_items WHERE checked = 1");
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { items, addItem, checkItem, deleteItem, clearChecked };
}
