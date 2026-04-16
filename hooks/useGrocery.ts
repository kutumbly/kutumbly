/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
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

export function useGrocery() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const persist = useCallback(() => {
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const items = useMemo<GroceryItem[]>(() => {
    return runQuery<GroceryItem>(
      db,
      "SELECT * FROM grocery_items ORDER BY (current_stock <= threshold) DESC, checked ASC, category ASC, name ASC"
    );
  }, [db, tick]);

  const addItem = useCallback((
    name: string,
    category: string,
    quantity: string,
    unit: string,
    estimated_price: number,
    current_stock: number = 0,
    threshold: number = 1,
    expiry_date?: string
  ) => {
    if (!db || !name.trim()) return;

    let listId: string;
    const existingList = db.exec("SELECT id FROM grocery_lists LIMIT 1");
    if (existingList[0]?.values?.[0]?.[0]) {
      listId = existingList[0].values[0][0] as string;
    } else {
      listId = crypto.randomUUID();
      db.run("INSERT INTO grocery_lists (id, name, created_at, status) VALUES (?, ?, ?, ?)", [listId, "Main List", new Date().toISOString(), "active"]);
    }

    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO grocery_items 
        (id, list_id, name, quantity, unit, estimated_price, checked, category, current_stock, threshold, expiry_date, last_purchased_date) 
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
      [id, listId, name.trim(), quantity || '1', unit || 'pcs', estimated_price || 0, category || 'General', current_stock, threshold, expiry_date || null, new Date().toISOString()]
    );
    persist();
    return id;
  }, [db, persist]);

  const updateStock = useCallback((id: string, newStock: number) => {
    if (!db) return;
    db.run("UPDATE grocery_items SET current_stock = ?, last_purchased_date = ? WHERE id = ?", [newStock, new Date().toISOString(), id]);
    persist();
  }, [db, persist]);

  const decrementStock = useCallback((id: string, amount: number) => {
    if (!db) return;
    db.run("UPDATE grocery_items SET current_stock = MAX(0, current_stock - ?) WHERE id = ?", [amount, id]);
    persist();
  }, [db, persist]);

  const checkItem = useCallback((id: string, currentChecked: boolean | number) => {
    if (!db) return;
    const newVal = currentChecked ? 0 : 1;
    // If checking (marking as bought), we should ideally update stock, but we keep it simple for now
    db.run("UPDATE grocery_items SET checked = ? WHERE id = ?", [newVal, id]);
    persist();
  }, [db, persist]);

  const deleteItem = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM grocery_items WHERE id = ?", [id]);
    persist();
  }, [db, persist]);

  const clearChecked = useCallback(() => {
    if (!db) return;
    db.run("DELETE FROM grocery_items WHERE checked = 1");
    persist();
  }, [db, persist]);

  const applyBaseline = useCallback(() => {
    if (!db) return;
    KUTUMBLY_BASELINE.forEach(b => {
      addItem(b.name, b.category, '1', b.unit, 0, 0, b.threshold);
    });
  }, [addItem, db]);

  return { items, addItem, updateStock, decrementStock, checkItem, deleteItem, clearChecked, applyBaseline };
}
