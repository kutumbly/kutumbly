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
import { saveVault } from '@/lib/vault';
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
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const items = useMemo(() => samanRepo.getItems(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addItem = useCallback((
    name: string,
    category: string,
    quantity: string,
    unit: string,
    estimated_price: number,
    current_stock: number,
    threshold: number
  ) => {
    const id = samanRepo.createItem(db, { name, category, quantity, unit, estimated_price, current_stock, threshold });
    commit();
  }, [db, commit]);

  const editItem = useCallback((id: string, updates: Partial<SamanItem>) => {
    samanRepo.updateItem(db, id, updates);
    commit();
  }, [db, commit]);

  const deleteItem = useCallback((id: string) => {
    samanRepo.deleteItem(db, id);
    commit();
  }, [db, commit]);

  const checkItem = useCallback((id: string, checked: boolean) => {
    samanRepo.checkItem(db, id, checked ? 1 : 0);
    commit();
  }, [db, commit]);

  const clearChecked = useCallback(() => {
    samanRepo.clearAllChecked(db);
    commit();
  }, [db, commit]);

  const applyBaseline = useCallback(() => {
    if (!db) return;
    KUTUMBLY_BASELINE.forEach(b => {
      samanRepo.createItem(db, { ...b, quantity: '1', estimated_price: 0, current_stock: 0 });
    });
    commit();
  }, [db, commit]);

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
