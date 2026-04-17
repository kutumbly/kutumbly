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

import { GroceryItem } from '../db';

/**
 * SAMAN HUB CONTRACT
 * Defines the public API for the Household Supply Chain (Grocery) module.
 */
export interface SamanContract {
  items: GroceryItem[];
  addItem: (
    name: string,
    category: string,
    quantity: string,
    unit: string,
    estimated_price: number,
    current_stock: number,
    threshold: number
  ) => void;
  editItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  checkItem: (id: string, checked: boolean) => void;
  clearChecked: () => void;
  applyBaseline: () => void; // Standard Indian essentials
}
