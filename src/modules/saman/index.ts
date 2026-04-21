/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { mutateVault } from '@/lib/vault';
import { samanRepo } from './saman.repo';
import { SamanItem } from '@/types/db';

export const KUTUMBLY_BASELINE = [
  { name: 'Atta (Chakki Fresh)', category: 'Essentials', threshold: 5, unit: 'kg' },
  { name: 'Basmati Rice', category: 'Essentials', threshold: 2, unit: 'kg' },
  { name: 'Mustard Oil', category: 'Cooking', threshold: 1, unit: 'L' },
  { name: 'Sugar', category: 'Essentials', threshold: 1, unit: 'kg' },
  { name: 'Salt', category: 'Essentials', threshold: 0.5, unit: 'kg' },
  { name: 'Tea (Masala)', category: 'Essentials', threshold: 0.25, unit: 'kg' },
  { name: 'Milk', category: 'Dairy', threshold: 1, unit: 'L' },
  { name: 'Ghee', category: 'Cooking', threshold: 0.5, unit: 'kg' },
  { name: 'Moong Dal', category: 'Pulses', threshold: 1, unit: 'kg' },
  { name: 'Arhar Dal', category: 'Pulses', threshold: 1, unit: 'kg' },
  { name: 'Turmeric Powder', category: 'Spices', threshold: 0.1, unit: 'kg' },
  { name: 'Red Chili Powder', category: 'Spices', threshold: 0.1, unit: 'kg' },
  { name: 'Onion', category: 'Vegetables', threshold: 1, unit: 'kg' },
  { name: 'Potato', category: 'Vegetables', threshold: 1, unit: 'kg' },
];

/**
 * SAMAN HUB (Household Supply Chain)
 * Sealed module for inventory and grocery management.
 */
export function useSaman() {
  const { db } = useAppStore();
  const [tick, setTick] = useState(0);

  const items = useMemo(() => samanRepo.getItems(db), [db, tick]);

  const addItem = useCallback(async (
    name: string,
    category: string,
    quantity: string,
    unit: string,
    estimated_price: number,
    current_stock: number,
    threshold: number
  ) => {
    if (!db) return;
    // Resolve or create the list
    let listId: string;
    const existingList = db.exec("SELECT id FROM saman_lists LIMIT 1");
    if (existingList[0]?.values?.[0]?.[0]) {
      listId = existingList[0].values[0][0] as string;
    } else {
      listId = crypto.randomUUID();
      await mutateVault(db, "INSERT INTO saman_lists (id, name, created_at, status) VALUES (?, ?, ?, ?)",
        [listId, 'Main List', new Date().toISOString(), 'active']);
    }
    const id = crypto.randomUUID();
    await mutateVault(
      db,
      `INSERT INTO saman_items (id, list_id, name, quantity, unit, estimated_price, checked, category, current_stock, threshold, last_purchased_date) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [id, listId, name.trim(), quantity || '1', unit || 'pcs', estimated_price || 0, category || 'General', current_stock || 0, threshold || 1, new Date().toISOString()]
    );
    setTick(t => t + 1);
  }, [db]);

  const editItem = useCallback(async (id: string, updates: Partial<SamanItem>) => {
    if (!db) return;
    const setChunks: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined && key !== 'id') {
        setChunks.push(`${key} = ?`);
        values.push(typeof val === 'boolean' ? (val ? 1 : 0) : val);
      }
    }
    if (setChunks.length === 0) return;
    values.push(id);
    await mutateVault(db, `UPDATE saman_items SET ${setChunks.join(', ')} WHERE id = ?`, values);
    setTick(t => t + 1);
  }, [db]);

  const deleteItem = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM saman_items WHERE id = ?", [id]);
    setTick(t => t + 1);
  }, [db]);

  const checkItem = useCallback(async (id: string, checked: boolean) => {
    if (!db) return;
    if (checked) {
      await mutateVault(db, "UPDATE saman_items SET checked = 1, last_purchased_date = ? WHERE id = ?",
        [new Date().toISOString(), id]);
    } else {
      await mutateVault(db, "UPDATE saman_items SET checked = 0 WHERE id = ?", [id]);
    }
    setTick(t => t + 1);
  }, [db]);

  const clearChecked = useCallback(async () => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM saman_items WHERE checked = 1", []);
    setTick(t => t + 1);
  }, [db]);

  const applyBaseline = useCallback(async () => {
    if (!db) return;
    for (const b of KUTUMBLY_BASELINE) {
      samanRepo.createItem(db, { ...b, quantity: '1', estimated_price: 0, current_stock: 0 });
    }
    // Single vault save after all inserts
    const { currentPin, fileHandle } = useAppStore.getState();
    if (currentPin && fileHandle) {
      const { saveVault } = await import('@/lib/vault');
      await saveVault(db, currentPin, fileHandle);
    }
    setTick(t => t + 1);
  }, [db]);

  return {
    items,
    addItem,
    editItem,
    deleteItem,
    checkItem,
    clearChecked,
    applyBaseline
  };
}
